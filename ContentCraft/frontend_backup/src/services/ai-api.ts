import { api } from './api-client'

export interface GenerateTextPayload {
  topic: string
  platform: string
  tone: string
  audience: string
}

export interface GeneratedTextResult {
  title: string
  body: string
  platform: string
  prompt_preview?: string
}

export interface GenerateImagePayload {
  prompt: string
}

export interface GeneratedImageResult {
  image_url: string
  prompt: string
}

export interface VisionAnalysisPayload {
  image_url: string
  prompt: string
}

export interface VisionAnalysisResult {
  description: string
  tags: string[]
}

export const aiApi = {
  generateText: (payload: GenerateTextPayload) =>
    api<GeneratedTextResult>('/ai/text', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  generateImage: (payload: GenerateImagePayload) =>
    api<GeneratedImageResult>('/ai/image', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  analyzeImage: (payload: VisionAnalysisPayload) =>
    api<VisionAnalysisResult>('/image-analysis', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
}
