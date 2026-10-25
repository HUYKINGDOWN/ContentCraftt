import { api } from './api-client'
import { Product } from '../types'

export const productApi = {
  list: () => api<Product[]>('/products'),
  create: (payload: Partial<Product>) => api<Product>('/products', { method: 'POST', body: JSON.stringify(payload) }),
}
