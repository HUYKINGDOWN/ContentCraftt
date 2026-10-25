import { apiRequest } from './api'

export interface PublishPayload {
  content_id: number
  platform: string
}

export interface PublishResult {
  message?: string
  instructions?: string
  live_published?: boolean
}

export const publishingService = {
  // Check live API status
  async checkStatus(): Promise<{ facebook_live: boolean; webhook_configured: boolean }> {
    try {
      return await apiRequest('/publishing/status')
    } catch {
      return { facebook_live: false, webhook_configured: false }
    }
  },

  // Publish content
  async publish(contentId: number | string, platform: string = 'Facebook'): Promise<PublishResult> {
    const numericId = typeof contentId === 'string' ? parseInt(contentId, 10) : contentId
    try {
      return await apiRequest<PublishResult>('/publishing', {
        method: 'POST',
        body: JSON.stringify({
          content_id: isNaN(numericId) ? 1 : numericId,
          platform,
        }),
      })
    } catch (err) {
      console.warn('API publishing endpoint returned error, fallback to manual flow:', err)
      return {
        live_published: false,
        message: 'Published locally (Manual handoff)',
      }
    }
  },

  // Open social media platform URL
  getPlatformUrl(platform: string): string {
    const p = platform.toLowerCase()
    if (p.includes('tiktok')) return 'https://www.tiktok.com/creator-center/upload'
    if (p.includes('linkedin')) return 'https://www.linkedin.com/feed/'
    if (p.includes('instagram')) return 'https://www.instagram.com/'
    if (p.includes('x') || p.includes('twitter')) return 'https://twitter.com/compose/tweet'
    return 'https://www.facebook.com'
  },
}
