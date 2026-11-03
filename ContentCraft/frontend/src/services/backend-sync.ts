import { apiRequest } from './api'
import type { Audience, Brand, Content, Product, User } from '../types'

// Backend Database Data Types
interface BackendBrand {
  id: number
  name: string
  description?: string
  tone?: string
  industry?: string
  brand_voice?: string
  marketing_preferences?: string
  created_at?: string
}

interface BackendProduct {
  id: number
  name: string
  description?: string
  brand_id: number
  category_name?: string
  usp?: string
  key_features?: string
  status?: boolean
  created_at?: string
}

interface BackendAudience {
  id: number
  name: string
  description?: string
  platform?: string
  brand_id: number
  age_min?: number
  age_max?: number
  gender?: string
  interests?: string
  behaviors?: string
  notes?: string
  created_at?: string
}

interface BackendContent {
  id: number
  title: string
  body: string
  status: string
  platform: string
  brand_id: number
  product_id?: number | null
  target_customer_id?: number | null
  content_type: string
  language_preference?: string
  image?: string | null
  generated_image_url?: string | null
  created_at?: string
}

export interface BackendContentVersion {
  id: number
  content_id: number
  version_number: number
  body: string
  edited_by_user_id: number
  change_summary?: string | null
  created_at?: string
}

interface BackendUser {
  id: number
  email: string
  full_name: string
  role?: string
  status?: string
  created_at?: string
}

export interface BackendAnalyticsSummary {
  total_events: number
  events_by_type: Record<string, number>
}

// Color palette for brands if none provided
const BRAND_COLORS = [
  '#0d9488', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'
]

function isNumericId(id: string): boolean {
  return /^\d+$/.test(id)
}

export const backendSync = {
  // ===================== BRANDS =====================
  async fetchBrands(): Promise<Brand[]> {
    try {
      const list = await apiRequest<BackendBrand[]>('/brands')
      if (!Array.isArray(list)) return []
      return list.map((b, idx) => ({
        id: String(b.id),
        name: b.name,
        industry: b.industry || 'Thương hiệu',
        description: b.description || '',
        voice: b.tone || b.brand_voice || 'Chuyên nghiệp',
        audience: b.marketing_preferences || 'Khách hàng mục tiêu',
        website: '',
        color: BRAND_COLORS[idx % BRAND_COLORS.length],
        status: 'Active',
      }))
    } catch (err) {
      console.warn('Could not fetch brands from backend:', err)
      return []
    }
  },

  async saveBrand(brand: Brand): Promise<Brand | null> {
    try {
      const payload = {
        name: brand.name,
        description: brand.description,
        tone: brand.voice,
        industry: brand.industry,
        brand_voice: brand.voice,
        marketing_preferences: brand.audience,
      }

      if (isNumericId(brand.id)) {
        const updated = await apiRequest<BackendBrand>(`/brands/${brand.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        return { ...brand, id: String(updated.id) }
      } else {
        const saved = await apiRequest<BackendBrand>('/brands', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        return { ...brand, id: String(saved.id) }
      }
    } catch (err) {
      console.warn('Could not save brand to backend:', err)
      return null
    }
  },

  async deleteBrand(id: string): Promise<boolean> {
    if (!isNumericId(id)) return true
    try {
      await apiRequest(`/brands/${id}`, { method: 'DELETE' })
      return true
    } catch (err) {
      console.warn(`Could not delete brand ${id} on backend:`, err)
      return false
    }
  },

  // ===================== PRODUCTS =====================
  async fetchProducts(): Promise<Product[]> {
    try {
      const list = await apiRequest<BackendProduct[]>('/products')
      if (!Array.isArray(list)) return []
      return list.map((p) => ({
        id: String(p.id),
        name: p.name,
        category: p.category_name || 'Sản phẩm',
        description: p.description || '',
        price: 0,
        status: p.status !== false ? 'Active' : 'Draft',
        image: '',
        brandId: String(p.brand_id),
        features: p.key_features || p.usp || '',
      }))
    } catch (err) {
      console.warn('Could not fetch products from backend:', err)
      return []
    }
  },

  async saveProduct(product: Product): Promise<Product | null> {
    try {
      const numericBrandId = parseInt(product.brandId, 10)
      const payload = {
        name: product.name,
        description: product.description,
        brand_id: isNaN(numericBrandId) ? 1 : numericBrandId,
        category_name: product.category,
        key_features: product.features,
        usp: product.features,
        status: product.status === 'Active',
      }

      if (isNumericId(product.id)) {
        const updated = await apiRequest<BackendProduct>(`/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        return { ...product, id: String(updated.id) }
      } else {
        const saved = await apiRequest<BackendProduct>('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        return { ...product, id: String(saved.id) }
      }
    } catch (err) {
      console.warn('Could not save product to backend:', err)
      return null
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!isNumericId(id)) return true
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' })
      return true
    } catch (err) {
      console.warn(`Could not delete product ${id} on backend:`, err)
      return false
    }
  },

  // ===================== AUDIENCES =====================
  async fetchAudiences(): Promise<Audience[]> {
    try {
      const list = await apiRequest<BackendAudience[]>('/audiences')
      if (!Array.isArray(list)) return []
      return list.map((a) => {
        let ageStr = '18 - 45'
        if (a.age_min || a.age_max) {
          ageStr = `${a.age_min || 18} - ${a.age_max || 60}`
        }
        return {
          id: String(a.id),
          name: a.name,
          description: a.description || '',
          age: ageStr,
          location: a.platform || 'Toàn quốc',
          interests: a.interests || a.behaviors || '',
          tone: a.notes || 'Thân thiện',
          status: 'Active',
        }
      })
    } catch (err) {
      console.warn('Could not fetch audiences from backend:', err)
      return []
    }
  },

  async saveAudience(audience: Audience): Promise<Audience | null> {
    try {
      const payload = {
        name: audience.name,
        description: audience.description,
        platform: audience.location || 'general',
        brand_id: 1,
        gender: 'All',
        interests: audience.interests,
        notes: audience.tone,
      }

      if (isNumericId(audience.id)) {
        const updated = await apiRequest<BackendAudience>(`/audiences/${audience.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        return { ...audience, id: String(updated.id) }
      } else {
        const saved = await apiRequest<BackendAudience>('/audiences', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        return { ...audience, id: String(saved.id) }
      }
    } catch (err) {
      console.warn('Could not save audience to backend:', err)
      return null
    }
  },

  async deleteAudience(id: string): Promise<boolean> {
    if (!isNumericId(id)) return true
    try {
      await apiRequest(`/audiences/${id}`, { method: 'DELETE' })
      return true
    } catch (err) {
      console.warn(`Could not delete audience ${id} on backend:`, err)
      return false
    }
  },

  // ===================== CONTENTS =====================
  async fetchContents(): Promise<Content[]> {
    try {
      const list = await apiRequest<BackendContent[]>('/contents')
      if (!Array.isArray(list)) return []
      return list.map((c) => {
        const isVisual = Boolean(c.image || c.generated_image_url || c.content_type === 'Product visual')
        return {
          id: String(c.id),
          title: c.title,
          body: c.body,
          type: c.content_type || (isVisual ? 'Product visual' : 'Social post'),
          channel: c.platform || 'Facebook',
          brandId: c.brand_id ? String(c.brand_id) : '',
          productId: c.product_id ? String(c.product_id) : '',
          audienceId: c.target_customer_id ? String(c.target_customer_id) : '',
          status:
            c.status === 'Approved'
              ? 'Approved'
              : c.status === 'In review'
                ? 'In review'
                : 'Draft',
          createdAt: c.created_at
            ? new Date(c.created_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          kind: isVisual ? 'image' : 'text',
          image: c.image || c.generated_image_url || undefined,
        }
      })
    } catch (err) {
      console.warn('Could not fetch contents from backend:', err)
      return []
    }
  },

  async saveContent(content: Content): Promise<Content | null> {
    try {
      const numericBrandId = parseInt(content.brandId, 10)
      const numericProductId = parseInt(content.productId, 10)
      const numericAudienceId = parseInt(content.audienceId, 10)
      const payload = {
        title: content.title,
        body: content.body,
        status: content.status,
        platform: content.channel || 'Facebook',
        brand_id: isNaN(numericBrandId) ? 1 : numericBrandId,
        product_id: isNaN(numericProductId) ? null : numericProductId,
        target_customer_id: isNaN(numericAudienceId) ? null : numericAudienceId,
        content_type: content.type || (content.kind === 'image' ? 'Product visual' : 'Social post'),
        image: content.image || null,
        generated_image_url: content.image || null,
      }

      let savedResult: Content | null = null

      if (isNumericId(content.id)) {
        const updated = await apiRequest<BackendContent>(`/contents/${content.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        savedResult = {
          ...content,
          id: String(updated.id),
          image: updated.image || updated.generated_image_url || content.image,
        }
      } else {
        const saved = await apiRequest<BackendContent>('/contents', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        savedResult = {
          ...content,
          id: String(saved.id),
          image: saved.image || saved.generated_image_url || content.image,
        }
      }

      // Tự động ghi nhận một bản ghi Version vào ContentVersions trong SQL Server
      if (savedResult && isNumericId(savedResult.id)) {
        await this.saveContentVersion(
          savedResult.id,
          savedResult.body || savedResult.title,
          `Phiên bản lưu (${savedResult.status}) - ${savedResult.kind === 'image' ? 'Visual' : 'Copy'}`
        )
      }

      return savedResult
    } catch (err) {
      console.warn('Could not save content to backend:', err)
      return null
    }
  },

  async deleteContent(id: string): Promise<boolean> {
    if (!isNumericId(id)) return true
    try {
      await apiRequest(`/contents/${id}`, { method: 'DELETE' })
      return true
    } catch (err) {
      console.warn(`Could not delete content ${id} on backend:`, err)
      return false
    }
  },

  async updateContentStatus(id: string, status: string): Promise<Content | null> {
    if (!isNumericId(id)) return null
    try {
      const updated = await apiRequest<BackendContent>(`/contents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      const isVisual = Boolean(updated.image || updated.generated_image_url || updated.content_type === 'Product visual')
      return {
        id: String(updated.id),
        title: updated.title,
        body: updated.body,
        type: updated.content_type || (isVisual ? 'Product visual' : 'Social post'),
        channel: updated.platform || 'Facebook',
        brandId: updated.brand_id ? String(updated.brand_id) : '',
        productId: updated.product_id ? String(updated.product_id) : '',
        audienceId: updated.target_customer_id ? String(updated.target_customer_id) : '',
        status: updated.status as 'Draft' | 'In review' | 'Approved',
        createdAt: updated.created_at
          ? new Date(updated.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        kind: isVisual ? 'image' : 'text',
        image: updated.image || updated.generated_image_url || undefined,
      }
    } catch (err) {
      console.warn(`Could not update content status for ${id}:`, err)
      return null
    }
  },

  async approveContent(id: string): Promise<Content | null> {
    if (!isNumericId(id)) return null
    try {
      const updated = await apiRequest<BackendContent>(`/contents/${id}/approve`, {
        method: 'POST',
      })
      const isVisual = Boolean(updated.image || updated.generated_image_url || updated.content_type === 'Product visual')
      return {
        id: String(updated.id),
        title: updated.title,
        body: updated.body,
        type: updated.content_type || (isVisual ? 'Product visual' : 'Social post'),
        channel: updated.platform || 'Facebook',
        brandId: updated.brand_id ? String(updated.brand_id) : '',
        productId: updated.product_id ? String(updated.product_id) : '',
        audienceId: updated.target_customer_id ? String(updated.target_customer_id) : '',
        status: 'Approved',
        createdAt: updated.created_at
          ? new Date(updated.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        kind: isVisual ? 'image' : 'text',
        image: updated.image || updated.generated_image_url || undefined,
      }
    } catch (err) {
      console.warn(`Could not approve content ${id}:`, err)
      return null
    }
  },

  // ===================== CONTENT VERSIONS =====================
  async saveContentVersion(
    contentId: string | number,
    body: string,
    summary?: string
  ): Promise<BackendContentVersion | null> {
    const numericId = typeof contentId === 'string' ? parseInt(contentId, 10) : contentId
    if (isNaN(numericId)) return null
    try {
      return await apiRequest<BackendContentVersion>('/content-versions', {
        method: 'POST',
        body: JSON.stringify({
          content_id: numericId,
          body,
          change_summary: summary || 'Phiên bản lưu mới',
        }),
      })
    } catch (err) {
      console.warn('Could not save content version to backend:', err)
      return null
    }
  },

  async fetchContentVersions(contentId: string | number): Promise<BackendContentVersion[]> {
    const numericId = typeof contentId === 'string' ? parseInt(contentId, 10) : contentId
    if (isNaN(numericId)) return []
    try {
      const list = await apiRequest<BackendContentVersion[]>(`/content-versions?content_id=${numericId}`)
      return Array.isArray(list) ? list : []
    } catch (err) {
      console.warn('Could not fetch content versions from backend:', err)
      return []
    }
  },

  // ===================== USERS =====================
  async fetchUsers(): Promise<User[]> {
    try {
      const list = await apiRequest<BackendUser[]>('/users')
      if (!Array.isArray(list)) return []
      return list.map((u) => ({
        id: String(u.id),
        name: u.full_name,
        email: u.email,
        role: (u.role === 'Admin' ? 'Admin' : u.role === 'Reviewer' ? 'Reviewer' : 'Editor') as User['role'],
        status: (u.status === 'Suspended' ? 'Suspended' : u.status === 'Invited' ? 'Invited' : 'Active') as User['status'],
      }))
    } catch (err) {
      console.warn('Could not fetch users from backend:', err)
      return []
    }
  },

  async saveUser(user: User): Promise<User | null> {
    try {
      const payload = {
        email: user.email,
        full_name: user.name,
        role: user.role,
        status: user.status,
      }

      if (isNumericId(user.id)) {
        const updated = await apiRequest<BackendUser>(`/users/${user.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        return { ...user, id: String(updated.id) }
      } else {
        const saved = await apiRequest<BackendUser>('/users', {
          method: 'POST',
          body: JSON.stringify({ ...payload, password: 'demo1234' }),
        })
        return { ...user, id: String(saved.id) }
      }
    } catch (err) {
      console.warn('Could not save user to backend:', err)
      return null
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    if (!isNumericId(id)) return true
    try {
      await apiRequest(`/users/${id}`, { method: 'DELETE' })
      return true
    } catch (err) {
      console.warn(`Could not delete user ${id} on backend:`, err)
      return false
    }
  },

  // ===================== ANALYTICS =====================
  async fetchAnalyticsSummary(): Promise<BackendAnalyticsSummary | null> {
    try {
      return await apiRequest<BackendAnalyticsSummary>('/analytics/summary')
    } catch (err) {
      console.warn('Could not fetch analytics summary from backend:', err)
      return null
    }
  },
}
