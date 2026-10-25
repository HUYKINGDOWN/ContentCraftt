import { api } from './api-client'
import { ContentRule } from '../types'

export const ruleApi = {
  list: () => api<ContentRule[]>('/content-rules'),
  create: (payload: Partial<ContentRule>) => api<ContentRule>('/content-rules', { method: 'POST', body: JSON.stringify(payload) }),
}
