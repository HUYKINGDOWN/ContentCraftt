import { apiRequest } from './api'

export interface GenerationInput {
  brandName: string
  productName: string
  audienceName: string
  contentType: string
  tone: string
  channel: string
  brief: string
  language: string
}

export function composeDemoText(input: GenerationInput): string {
  const { brandName, productName, audienceName, contentType, tone, channel, brief, language } =
    input
  if (language.toLowerCase().startsWith('vi'))
    return `${brandName} — Một chút cảm hứng cho ngày mới.\n\nKhám phá ${productName}, được tạo nên bằng sự tận tâm dành cho ${audienceName}. Mỗi chi tiết là một lời mời bạn sống chậm lại và tận hưởng điều mình yêu thích.\n\n${brief ? `Ý tưởng chiến dịch: ${brief}\n\n` : ''}Tìm hiểu câu chuyện của ${brandName} hôm nay.\n\n#${brandName.replace(/\s/g, '')} #CraftedWithCare\n\n[Bản nháp mẫu ${contentType} cho ${channel}; giọng điệu: ${tone}.]`
  return `${brandName} — a little more intention, every day.\n\nMeet ${productName}. Thoughtfully crafted for ${audienceName.toLowerCase()}, with care in every detail and a story worth sharing.\n\n${brief ? `Campaign direction: ${brief}\n\n` : ''}Make room for what matters. Discover ${productName} with ${brandName} today.\n\n#${brandName.replace(/\s/g, '')} #CraftedWithCare\n\n[Demo ${contentType} draft for ${channel}; tone: ${tone}.]`
}

export async function generateText(input: GenerationInput): Promise<string> {
  if (!input.brandName && !input.productName)
    throw new Error('Choose a brand or product first.')

  // Thử gọi FastAPI backend AI generation thật
  try {
    const topic = `${input.productName || input.brandName} (${input.brandName})${input.brief ? ': ' + input.brief : ''}`
    const res = await apiRequest<{
      title: string
      body: string
      platform: string
      prompt_preview?: string
    }>('/ai/text', {
      method: 'POST',
      body: JSON.stringify({
        topic,
        platform: input.channel || 'Facebook',
        tone: input.tone || 'friendly',
        audience: input.audienceName || 'general audience',
      }),
    })

    if (res && res.body) {
      return res.title ? `${res.title}\n\n${res.body}` : res.body
    }
  } catch (error) {
    console.warn('Backend AI generation offline hoặc lỗi, chuyển sang fallback demo:', error)
  }

  // Fallback demo local nếu backend gặp sự cố
  await new Promise((resolve) => window.setTimeout(resolve, 500))
  return composeDemoText(input)
}

export async function generateImage(input: {
  prompt: string
  aspectRatio: string
  style: string
  referenceSubject?: string
  referenceName?: string
}): Promise<string> {
  if (!input.prompt.trim()) throw new Error('Vui lòng nhập mô tả ảnh (prompt).')

  // 1. Thử gọi FastAPI backend AI Image Generation
  try {
    const res = await apiRequest<{
      image_url?: string
      url?: string
      prompt?: string
      provider?: string
    }>('/ai/image', {
      method: 'POST',
      body: JSON.stringify({
        prompt: input.prompt,
        style: input.style,
        aspect_ratio: input.aspectRatio,
        reference_subject: input.referenceSubject,
        reference_name: input.referenceName,
      }),
    })

    if (res?.image_url) {
      return res.image_url
    }
  } catch (error) {
    console.warn('Backend AI image endpoint offline hoặc gặp sự cố, sử dụng engine Flux AI:', error)
  }

  // 2. Trực tiếp sinh ảnh chất lượng cao thông qua mô hình Flux.1 / SDXL
  const aspectMap: Record<string, { w: number; h: number }> = {
    '1:1': { w: 1024, h: 1024 },
    '4:5': { w: 1024, h: 1280 },
    '16:9': { w: 1536, h: 864 },
    '9:16': { w: 1080, h: 1920 },
  }
  const dims = aspectMap[input.aspectRatio] || { w: 1024, h: 1024 }
  const seed = Math.floor(Math.random() * 900000) + 100000

  let effectivePrompt = input.prompt
  if (input.referenceSubject && !effectivePrompt.toLowerCase().includes(input.referenceSubject.toLowerCase())) {
    effectivePrompt = `featuring ${input.referenceSubject}, ${effectivePrompt}`
  }

  const cleanPrompt = encodeURIComponent(`${effectivePrompt}, ${input.style || 'clean lifestyle'}, photorealistic 8k, masterpiece`)
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${dims.w}&height=${dims.h}&model=flux&seed=${seed}&nologo=true`
}
