import { api } from './api-client'
import { Audience } from '../types'

export const audienceApi = {
  list: () => api<Audience[]>('/audiences'),
  create: (payload: Partial<Audience>) => api<Audience>('/audiences', { method: 'POST', body: JSON.stringify(payload) }),
}
