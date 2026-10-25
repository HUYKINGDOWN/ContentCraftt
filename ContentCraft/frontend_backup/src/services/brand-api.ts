import { api } from './api-client'
import { Brand } from '../types'

export const brandApi = {
  list: () => api<Brand[]>('/brands'),
  create: (payload: Partial<Brand>) => api<Brand>('/brands', { method: 'POST', body: JSON.stringify(payload) }),
}
