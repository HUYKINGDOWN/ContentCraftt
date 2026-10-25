import React, { useState } from 'react'
import {
  Sparkles,
  Sliders,
  FileText,
  Image as ImageIcon,
  Eye,
  CheckCircle2,
  Plus,
  Check,
  Copy
} from 'lucide-react'
import { Brand, Product, ContentItem, Audience, ContentRule } from '../types'
import { aiApi } from '../services/ai-api'
import { useI18n } from '../context/I18nContext'

interface ContentStudioPageProps {
  brands: Brand[]
  products: Product[]
  contents: ContentItem[]
  audiences: Audience[]
  rules: ContentRule[]
  activeBrandId: number | null
  initialProductId?: number | ''
  initialTopic?: string
  initialAudienceId?: number | ''
  onSaveContent: (content: {
    title: string
    body: string
    platform: string
    product_id: number | null
    target_customer_id: number | null
    rule_id: number | null
    status: string
  }) => Promise<void>
  onOpenAddAssetModal: (asset: {
    product_id: number
    url: string
    name: string
    kind: string
    extracted_tags: string
    color_palette: string
  }) => void
  onError: (msg: string) => void
  onShowToast: (msg: string) => void
}

export const ContentStudioPage: React.FC<ContentStudioPageProps> = ({
  brands,
  products,
  contents,
  audiences,
  rules,
  activeBrandId,
  initialProductId = '',
  initialTopic = 'Ra mắt bộ sưu tập cà phê muối mùa thu',
  initialAudienceId = '',
  onSaveContent,
  onOpenAddAssetModal,
  onError,
  onShowToast
}) => {
  const { t, language } = useI18n()
  const [studioMode, setStudioMode] = useState<'text' | 'image' | 'vision'>('text')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Studio form states
  const [topic, setTopic] = useState(initialTopic)
  const [platform, setPlatform] = useState('Facebook')
  const [tone, setTone] = useState(language === 'en' ? 'Friendly, casual' : 'Thân thiện, mộc mạc')
  const [selectedProductId, setSelectedProductId] = useState<number | ''>(initialProductId)
  const [selectedAudienceId, setSelectedAudienceId] = useState<number | ''>(initialAudienceId)
  const [selectedRuleId, setSelectedRuleId] = useState<number | ''>('')

  // Studio generated outputs
  const [generatedText, setGeneratedText] = useState<{
    title: string
    body: string
    platform: string
    prompt_preview?: string
  } | null>(null)

  React.useEffect(() => {
    if (initialProductId !== '') setSelectedProductId(initialProductId)
  }, [initialProductId])

  React.useEffect(() => {
    if (initialTopic) setTopic(initialTopic)
  }, [initialTopic])

  React.useEffect(() => {
    if (initialAudienceId !== '') setSelectedAudienceId(initialAudienceId)
  }, [initialAudienceId])

  // Image generation form
  const [imagePrompt, setImagePrompt] = useState(
    'A rustic cup of salted cream iced coffee on an outdoor wooden table with morning sunshine'
  )
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  // Vision analysis form
  const [visionUrl, setVisionUrl] = useState(
    'https://s3.ap-southeast-1.amazonaws.com/contentcraft/coffee_salted.jpg'
  )
  const [visionPrompt, setVisionPrompt] = useState(
    language === 'en'
      ? 'Analyze main subject, color palette, and lighting'
      : 'Phân tích đối tượng chính, màu sắc và bối cảnh chụp'
  )
  const [visionResult, setVisionResult] = useState<{ description: string; tags: string[] } | null>(null)

  function copyToClipboard(text: string) {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    onShowToast(language === 'en' ? 'Copied to clipboard!' : 'Đã sao chép vào bộ nhớ tạm!')
    setTimeout(() => setCopied(false), 2000)
  }

  // AI Text generation
  async function handleGenerateText() {
    setLoading(true)
    try {
      const brandObj = brands.find(b => b.id === activeBrandId)
      const audienceObj = audiences.find(a => a.id === selectedAudienceId)
      const audienceStr = audienceObj ? audienceObj.name : (language === 'en' ? 'target audience' : 'khách hàng mục tiêu')
      const toneStr = brandObj?.brand_voice || tone

      const res = await aiApi.generateText({
        topic,
        platform,
        tone: toneStr,
        audience: audienceStr
      })
      setGeneratedText(res)
      onShowToast(language === 'en' ? 'AI content generated successfully!' : 'Đã sinh nội dung AI thành công!')
    } catch (err) {
      onError(language === 'en' ? `Error generating content: ${String(err)}` : `Lỗi khi tạo nội dung: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // AI Image generation
  async function handleGenerateImage() {
    setLoading(true)
    try {
      const res = await aiApi.generateImage({ prompt: imagePrompt })
      setGeneratedImage(res.image_url)
      onShowToast(language === 'en' ? 'AI image generated successfully!' : 'Đã sinh ảnh AI thành công!')
    } catch (err) {
      onError(language === 'en' ? `Error rendering image: ${String(err)}` : `Lỗi sinh ảnh: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  // Vision analysis
  async function handleVisionAnalysis() {
    setLoading(true)
    try {
      const res = await aiApi.analyzeImage({
        image_url: visionUrl,
        prompt: visionPrompt
      })
      setVisionResult(res)
      onShowToast(language === 'en' ? 'Image analyzed successfully!' : 'Đã phân tích hình ảnh thành công!')
    } catch (err) {
      onError(language === 'en' ? `Error analyzing image: ${String(err)}` : `Lỗi phân tích: ${String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (status: string) => {
    if (!generatedText) return
    await onSaveContent({
      title: generatedText.title,
      body: generatedText.body,
      platform: generatedText.platform,
      product_id: selectedProductId ? Number(selectedProductId) : null,
      target_customer_id: selectedAudienceId ? Number(selectedAudienceId) : null,
      rule_id: selectedRuleId ? Number(selectedRuleId) : null,
      status
    })
  }

  const toneOptions =
    language === 'en'
      ? ['Friendly, casual', 'Professional, authoritative', 'Humorous, trendy', 'Luxury, elegant', 'Exciting, energetic']
      : ['Thân thiện, mộc mạc', 'Chuyên nghiệp, tin cậy', 'Hài hước, bắt trend', 'Sang trọng, quý phái', 'Sôi động, kích thích']

  return (
    <>
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">
            <Sparkles size={13} /> {t('studio.hero.tag')}
          </span>
          <h2 className="hero-title">
            {t('studio.hero.title')}
          </h2>
          <p className="hero-desc">
            {t('studio.hero.desc')}
          </p>
        </div>

        <div className="hero-stats-chips">
          <div className="stat-chip">
            <span>{t('studio.hero.brands')}</span>
            <b>{brands.length.toString().padStart(2, '0')}</b>
          </div>
          <div className="stat-chip">
            <span>{t('studio.hero.products')}</span>
            <b>{products.length.toString().padStart(2, '0')}</b>
          </div>
          <div className="stat-chip">
            <span>{t('studio.hero.contents')}</span>
            <b>{contents.length.toString().padStart(2, '0')}</b>
          </div>
        </div>
      </section>

      <div className="studio-grid">
        {/* Left Configuration Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-header-title">
              <Sliders size={18} color="#7c5cff" />
              <h3>{t('studio.panel.settings')}</h3>
            </div>

            <div className="studio-mode-tabs">
              <button
                className={`mode-tab ${studioMode === 'text' ? 'active' : ''}`}
                onClick={() => setStudioMode('text')}
              >
                <FileText size={13} /> {t('studio.tab.text')}
              </button>
              <button
                className={`mode-tab ${studioMode === 'image' ? 'active' : ''}`}
                onClick={() => setStudioMode('image')}
              >
                <ImageIcon size={13} /> {t('studio.tab.image')}
              </button>
              <button
                className={`mode-tab ${studioMode === 'vision' ? 'active' : ''}`}
                onClick={() => setStudioMode('vision')}
              >
                <Eye size={13} /> {t('studio.tab.vision')}
              </button>
            </div>
          </div>

          {/* Mode 1: Text Generation */}
          {studioMode === 'text' && (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('studio.form.product')}</label>
                  <select
                    className="select"
                    value={selectedProductId}
                    onChange={e => setSelectedProductId(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">{t('studio.form.product_none')}</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('studio.form.audience')}</label>
                  <select
                    className="select"
                    value={selectedAudienceId}
                    onChange={e => setSelectedAudienceId(e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">{t('studio.form.audience_all')}</option>
                    {audiences.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.age_min || 18}-{a.age_max || 35} {t('audiences.years_old')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('studio.form.rule')}</label>
                <select
                  className="select"
                  value={selectedRuleId}
                  onChange={e => setSelectedRuleId(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">{t('studio.form.rule_auto')}</option>
                  {rules.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({language === 'en' ? 'Restricted:' : 'Chặn từ:'} {r.restricted_words || t('rules.none')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('studio.form.topic')}</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder={t('studio.form.topic_placeholder')}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('studio.form.platform')}</label>
                <div className="platform-chips">
                  {['Facebook', 'TikTok', 'Instagram', 'LinkedIn'].map(p => (
                    <button
                      key={p}
                      className={`platform-chip ${platform === p ? 'selected' : ''}`}
                      onClick={() => setPlatform(p)}
                    >
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('studio.form.tone')}</label>
                <div className="tone-chips">
                  {toneOptions.map(tOption => (
                    <button
                      key={tOption}
                      className={`tone-chip ${tone === tOption ? 'selected' : ''}`}
                      onClick={() => setTone(tOption)}
                    >
                      {tOption}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-accent"
                style={{ width: '100%', padding: '13px', marginTop: '10px' }}
                onClick={() => void handleGenerateText()}
                disabled={loading || !topic.trim()}
              >
                <Sparkles size={16} />
                {loading ? t('studio.form.generating_text') : t('studio.form.generate_text')}
              </button>
            </div>
          )}

          {/* Mode 2: AI Image */}
          {studioMode === 'image' && (
            <div>
              <div className="form-group">
                <label className="form-label">{t('studio.image.prompt')}</label>
                <textarea
                  className="textarea"
                  rows={4}
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  placeholder={t('studio.image.prompt_placeholder')}
                />
              </div>
              <button
                className="btn btn-accent"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => void handleGenerateImage()}
                disabled={loading || !imagePrompt.trim()}
              >
                <ImageIcon size={16} />
                {loading ? t('studio.image.generating') : t('studio.image.generate')}
              </button>
            </div>
          )}

          {/* Mode 3: Vision Analysis */}
          {studioMode === 'vision' && (
            <div>
              <div className="form-group">
                <label className="form-label">{t('studio.vision.url')}</label>
                <input
                  className="input"
                  value={visionUrl}
                  onChange={e => setVisionUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('studio.vision.prompt')}</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={visionPrompt}
                  onChange={e => setVisionPrompt(e.target.value)}
                  placeholder={t('studio.vision.prompt_placeholder')}
                />
              </div>
              <button
                className="btn btn-accent"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => void handleVisionAnalysis()}
                disabled={loading || !visionUrl.trim()}
              >
                <Eye size={16} />
                {loading ? t('studio.vision.analyzing') : t('studio.vision.analyze')}
              </button>
            </div>
          )}
        </div>

        {/* Right Output Preview Panel */}
        <div className="panel-card preview-pane">
          <div className="panel-header">
            <div className="panel-header-title">
              <Eye size={18} color="#ec4899" />
              <h3>{t('studio.preview.title')}</h3>
            </div>
            <span className="card-badge badge-draft">LIVE DEMO</span>
          </div>

          <div className="preview-box">
            {studioMode === 'text' && generatedText ? (
              <div className="preview-post-card">
                <div className="post-card-header">
                  <div className="post-card-author">
                    <div className="author-avatar">
                      {brands.find(b => b.id === activeBrandId)?.name.charAt(0) || 'C'}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
                        {brands.find(b => b.id === activeBrandId)?.name || 'ContentCraft Brand'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                        {generatedText.platform} · {t('studio.preview.just_now')}
                      </div>
                    </div>
                  </div>
                  <span className="card-badge badge-platform">{generatedText.platform}</span>
                </div>

                <div className="post-card-body">
                  <h4>{generatedText.title}</h4>
                  <p>{generatedText.body}</p>
                </div>

                <div className="preview-actions">
                  <button className="btn btn-accent" onClick={() => void handleSave('Approved')}>
                    <CheckCircle2 size={14} /> {t('studio.preview.save_approve')}
                  </button>
                  <button className="btn btn-primary" onClick={() => void handleSave('Draft')}>
                    <Plus size={14} /> {t('studio.preview.save_draft')}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => copyToClipboard(`${generatedText.title}\n\n${generatedText.body}`)}
                  >
                    {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copied ? t('common.copied') : t('common.copy')}</span>
                  </button>
                </div>
              </div>
            ) : studioMode === 'image' && generatedImage ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={generatedImage}
                  alt="AI Generated"
                  style={{
                    width: '100%',
                    maxHeight: 280,
                    objectFit: 'cover',
                    borderRadius: 12,
                    marginBottom: 14
                  }}
                />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{imagePrompt}</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    onOpenAddAssetModal({
                      product_id: selectedProductId ? Number(selectedProductId) : 1,
                      url: generatedImage,
                      name: 'ai_generated.jpg',
                      kind: 'image/jpeg',
                      extracted_tags: 'ai, generated, prompt',
                      color_palette: '#7C5CFF, #EC4899'
                    })
                  }}
                >
                  <Plus size={14} /> {t('studio.preview.save_to_assets')}
                </button>
              </div>
            ) : studioMode === 'vision' && visionResult ? (
              <div style={{ padding: 10 }}>
                <h4 style={{ fontSize: 15, color: 'var(--text-main)', marginBottom: 10 }}>
                  {t('studio.preview.vision_result')}
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>
                  {visionResult.description}
                </p>
                <div className="form-label">{t('studio.preview.tags')}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {visionResult.tags.map((tTag, idx) => (
                    <span key={idx} className="card-badge badge-platform">
                      #{tTag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-box">
                <div className="empty-icon-wrap">
                  <Sparkles size={28} />
                </div>
                <h4>{t('studio.preview.empty_title')}</h4>
                <p>{t('studio.preview.empty_desc')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
export default ContentStudioPage
