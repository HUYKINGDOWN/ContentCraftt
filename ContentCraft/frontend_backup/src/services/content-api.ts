import { api } from './api-client'
import { ContentItem } from '../types'

export const contentApi = {
  list: () => api<ContentItem[]>('/contents'),
  create: (payload: Partial<ContentItem>) => api<ContentItem>('/contents', { method: 'POST', body: JSON.stringify(payload) }),
  approve: (id: number) => api<ContentItem>(`/contents/${id}/approve`, { method: 'POST' }),
  updateStatus: (id: number, status: string) => api<ContentItem>(`/contents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
}
