import { api } from './api-client'
import { UserFeedback } from '../types'

export interface CreateFeedbackPayload {
  content_id: number
  rating: number
  comment?: string
}

export const feedbackApi = {
  create: (payload: CreateFeedbackPayload) =>
    api<UserFeedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
}
