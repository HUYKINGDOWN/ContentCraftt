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
  if (!input.brandName || !input.productName || !input.audienceName)
    throw new Error('Choose a brand, product, and target audience first.')

  // Thử gọi FastAPI backend AI generation thật (sử dụng Gemini hoặc provider đã cấu hình)
  try {
    const topic = `${input.productName} (${input.brandName})${input.brief ? ': ' + input.brief : ''}`
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
      const fullText = res.title ? `${res.title}\n\n${res.body}` : res.body
      return fullText
    }
  } catch (error) {
    console.warn('Backend AI generation offline hoặc lỗi, chuyển sang fallback demo:', error)
  }

  // Fallback demo local nếu backend chưa chạy hoặc gặp sự cố
  await new Promise((resolve) => window.setTimeout(resolve, 700))
  return composeDemoText(input)
}

export async function generateImage(input: {
  prompt: string
  aspectRatio: string
  style: string
}): Promise<string> {
  if (!input.prompt.trim()) throw new Error('Enter an image prompt first.')

  // Thử gọi FastAPI backend AI image generation
  try {
    const res = await apiRequest<{
      image_url?: string
      url?: string
      prompt?: string
    }>('/ai/image', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `${input.prompt} (Style: ${input.style}, Aspect ratio: ${input.aspectRatio})`,
      }),
    })

    if (res?.image_url) {
      return res.image_url
    }
  } catch (error) {
    console.warn('Backend AI image offline hoặc lỗi, chuyển sang demo illustration:', error)
  }

  await new Promise((resolve) => window.setTimeout(resolve, 850))
  return '/assets/demo-image.svg'
}

