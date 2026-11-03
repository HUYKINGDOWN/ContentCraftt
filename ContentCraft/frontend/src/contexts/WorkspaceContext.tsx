import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react'
import type { Audience, Brand, Content, Product, User, WorkspaceData } from '../types'
import { readWorkspace, upsert, WORKSPACE_KEY } from '../utils/storage'
import { useToast } from './ToastContext'
import { backendSync } from '../services/backend-sync'

interface WorkspaceContextValue extends WorkspaceData {
  saveProduct: (item: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  saveBrand: (item: Brand) => Promise<void>
  deleteBrand: (id: string) => Promise<void>
  saveAudience: (item: Audience) => Promise<void>
  deleteAudience: (id: string) => Promise<void>
  saveContent: (item: Content) => Promise<void>
  deleteContent: (id: string) => Promise<void>
  saveUser: (item: User) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  refreshFromBackend: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { notify } = useToast()
  const [data, setData] = useState<WorkspaceData>(() => {
    try {
      return readWorkspace(localStorage.getItem(WORKSPACE_KEY))
    } catch {
      return readWorkspace(null)
    }
  })

  // Đồng bộ từ FastAPI Backend Database
  const refreshFromBackend = useCallback(async () => {
    try {
      const [brands, products, audiences, contents, users] = await Promise.all([
        backendSync.fetchBrands(),
        backendSync.fetchProducts(),
        backendSync.fetchAudiences(),
        backendSync.fetchContents(),
        backendSync.fetchUsers(),
      ])

      setData((prev) => {
        const mergeList = <T extends { id: string }>(backendList: T[], localList: T[]) => {
          if (!backendList.length) return localList
          const backendIds = new Set(backendList.map((i) => i.id))
          const remainingLocal = localList.filter((i) => !backendIds.has(i.id))
          return [...backendList, ...remainingLocal]
        }

        return {
          ...prev,
          brands: brands.length ? mergeList(brands, prev.brands) : prev.brands,
          products: products.length ? mergeList(products, prev.products) : prev.products,
          audiences: audiences.length ? mergeList(audiences, prev.audiences) : prev.audiences,
          contents: contents.length ? mergeList(contents, prev.contents) : prev.contents,
          users: users.length ? mergeList(users, prev.users) : prev.users,
        }
      })
    } catch (err) {
      console.warn('Lỗi khi đồng bộ dữ liệu từ database backend:', err)
    }
  }, [])

  useEffect(() => {
    refreshFromBackend()
  }, [refreshFromBackend])

  // Lưu vào localStorage dự phòng
  useEffect(() => {
    try {
      localStorage.setItem(WORKSPACE_KEY, JSON.stringify(data))
    } catch {
      notify(
        'Browser storage is unavailable or full. Changes remain available until this page closes.',
        'error',
      )
    }
  }, [data, notify])

  // Product
  const saveProduct = async (item: Product) => {
    const saved = await backendSync.saveProduct(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      products: upsert(prev.products, toSave),
    }))
  }

  const deleteProduct = async (id: string) => {
    await backendSync.deleteProduct(id)
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((item) => item.id !== id),
    }))
  }

  // Brand
  const saveBrand = async (item: Brand) => {
    const saved = await backendSync.saveBrand(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      brands: upsert(prev.brands, toSave),
    }))
  }

  const deleteBrand = async (id: string) => {
    await backendSync.deleteBrand(id)
    setData((prev) => ({
      ...prev,
      brands: prev.brands.filter((item) => item.id !== id),
    }))
  }

  // Audience
  const saveAudience = async (item: Audience) => {
    const saved = await backendSync.saveAudience(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      audiences: upsert(prev.audiences, toSave),
    }))
  }

  const deleteAudience = async (id: string) => {
    await backendSync.deleteAudience(id)
    setData((prev) => ({
      ...prev,
      audiences: prev.audiences.filter((item) => item.id !== id),
    }))
  }

  // Content
  const saveContent = async (item: Content) => {
    const saved = await backendSync.saveContent(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      contents: upsert(prev.contents, toSave),
    }))
  }

  const deleteContent = async (id: string) => {
    await backendSync.deleteContent(id)
    setData((prev) => ({
      ...prev,
      contents: prev.contents.filter((item) => item.id !== id),
    }))
  }

  // User
  const saveUser = async (item: User) => {
    const saved = await backendSync.saveUser(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      users: upsert(prev.users, toSave),
    }))
  }

  const deleteUser = async (id: string) => {
    await backendSync.deleteUser(id)
    setData((prev) => ({
      ...prev,
      users: prev.users.filter((item) => item.id !== id),
    }))
  }

  return (
    <WorkspaceContext.Provider
      value={{
        ...data,
        saveProduct,
        deleteProduct,
        saveBrand,
        deleteBrand,
        saveAudience,
        deleteAudience,
        saveContent,
        deleteContent,
        saveUser,
        deleteUser,
        refreshFromBackend,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) throw new Error('WorkspaceProvider is missing')
  return context
}
