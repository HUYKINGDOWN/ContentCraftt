import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react'
import type { Audience, Brand, Content, Product, User, WorkspaceData } from '../types'
import { readWorkspace, upsert, WORKSPACE_KEY } from '../utils/storage'
import { useToast } from './ToastContext'
import { backendSync } from '../services/backend-sync'

interface WorkspaceContextValue extends WorkspaceData {
  saveProduct: (item: Product) => Promise<void>
  deleteProduct: (id: string) => void
  saveBrand: (item: Brand) => Promise<void>
  deleteBrand: (id: string) => void
  saveAudience: (item: Audience) => Promise<void>
  deleteAudience: (id: string) => void
  saveContent: (item: Content) => Promise<void>
  deleteContent: (id: string) => void
  saveUser: (item: User) => void
  deleteUser: (id: string) => void
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

  // Đồng bộ ban đầu từ FastAPI Backend Database
  const refreshFromBackend = useCallback(async () => {
    try {
      const [brands, products, audiences, contents] = await Promise.all([
        backendSync.fetchBrands(),
        backendSync.fetchProducts(),
        backendSync.fetchAudiences(),
        backendSync.fetchContents(),
      ])

      setData((prev) => {
        // Hợp nhất dữ liệu backend database (ưu tiên backend items)
        const mergeList = <T extends { id: string }>(backendList: T[], localList: T[]) => {
          if (!backendList.length) return localList
          // Map backend items đè hoặc bổ sung
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

  const saveProduct = async (item: Product) => {
    const saved = await backendSync.saveProduct(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      products: upsert(prev.products, toSave),
    }))
  }

  const deleteProduct = (id: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((item) => item.id !== id),
    }))
  }

  const saveBrand = async (item: Brand) => {
    const saved = await backendSync.saveBrand(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      brands: upsert(prev.brands, toSave),
    }))
  }

  const deleteBrand = (id: string) => {
    setData((prev) => ({
      ...prev,
      brands: prev.brands.filter((item) => item.id !== id),
    }))
  }

  const saveAudience = async (item: Audience) => {
    const saved = await backendSync.saveAudience(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      audiences: upsert(prev.audiences, toSave),
    }))
  }

  const deleteAudience = (id: string) => {
    setData((prev) => ({
      ...prev,
      audiences: prev.audiences.filter((item) => item.id !== id),
    }))
  }

  const saveContent = async (item: Content) => {
    const saved = await backendSync.saveContent(item)
    const toSave = saved || item
    setData((prev) => ({
      ...prev,
      contents: upsert(prev.contents, toSave),
    }))
  }

  const deleteContent = (id: string) => {
    setData((prev) => ({
      ...prev,
      contents: prev.contents.filter((item) => item.id !== id),
    }))
  }

  const saveUser = (item: User) => {
    setData((prev) => ({
      ...prev,
      users: upsert(prev.users, item),
    }))
  }

  const deleteUser = (id: string) => {
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
