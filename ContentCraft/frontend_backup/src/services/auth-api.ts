import { api } from './api-client'
export const authapi = {
  list: () => api<any[]>('/auth'),
  create: (payload: unknown) => api<any>('/auth', { method: 'POST', body: JSON.stringify(payload) }),
}
