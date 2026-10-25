import { apiRequest } from './api'
import type { Audience, Brand, Content, Product } from '../types'

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
  created_at?: string
}

// Color palette for brands if none provided
const BRAND_COLORS = [
  '#0d9488', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'
]

export const backendSync = {
  // Fetch Brands from Database
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

  // Save Brand to Database
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
      const saved = await apiRequest<BackendBrand>('/brands', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return {
        ...brand,
        id: String(saved.id),
      }
    } catch (err) {
      console.warn('Could not save brand to backend:', err)
      return null
    }
  },

  // Fetch Products from Database
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

  // Save Product to Database
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
      const saved = await apiRequest<BackendProduct>('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return {
        ...product,
        id: String(saved.id),
      }
    } catch (err) {
      console.warn('Could not save product to backend:', err)
      return null
    }
  },

  // Fetch Audiences from Database
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

  // Save Audience to Database
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
      const saved = await apiRequest<BackendAudience>('/audiences', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return {
        ...audience,
        id: String(saved.id),
      }
    } catch (err) {
      console.warn('Could not save audience to backend:', err)
      return null
    }
  },

  // Fetch Contents from Database
  async fetchContents(): Promise<Content[]> {
    try {
      const list = await apiRequest<BackendContent[]>('/contents')
      if (!Array.isArray(list)) return []
      return list.map((c) => ({
        id: String(c.id),
        title: c.title,
        body: c.body,
        type: c.content_type || 'Social post',
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
        kind: 'text',
      }))
    } catch (err) {
      console.warn('Could not fetch contents from backend:', err)
      return []
    }
  },

  // Save Content to Database
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
        content_type: content.type || 'Social post',
      }
      const saved = await apiRequest<BackendContent>('/contents', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return {
        ...content,
        id: String(saved.id),
      }
    } catch (err) {
      console.warn('Could not save content to backend:', err)
      return null
    }
  },
}
