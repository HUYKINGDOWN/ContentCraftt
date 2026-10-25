import { api } from './api-client'
import { User } from '../types'

export const userApi = {
  list: () => api<User[]>('/users'),
}
