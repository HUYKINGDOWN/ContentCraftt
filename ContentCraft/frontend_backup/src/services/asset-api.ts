import { api } from './api-client'
import { ProductAsset } from '../types'

export const assetApi = {
  list: () => api<ProductAsset[]>('/assets'),
  create: (payload: Partial<ProductAsset>) => api<ProductAsset>('/assets', { method: 'POST', body: JSON.stringify(payload) }),
}
