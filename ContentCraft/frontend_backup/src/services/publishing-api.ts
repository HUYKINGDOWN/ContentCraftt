import { api } from './api-client'

export interface PublishPayload {
  content_id: number
  platform: string
}

export interface PublishResult {
  message?: string
  instructions?: string
  live_published?: boolean
}

export const publishingApi = {
  publish: (payload: PublishPayload) =>
    api<PublishResult>('/publishing', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
}
