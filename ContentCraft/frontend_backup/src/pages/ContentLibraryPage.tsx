import React, { useState } from 'react'
import {
  Search,
  CheckCircle2,
  Send,
  RotateCcw,
  Star,
  Copy,
  FileText
} from 'lucide-react'
import { Brand, Product, ContentItem } from '../types'
import { useI18n } from '../context/I18nContext'

interface ContentLibraryPageProps {
  contents: ContentItem[]
  brands: Brand[]
  products: Product[]
  onApprove: (id: number) => Promise<void>
  onUpdateStatus: (id: number, status: string) => Promise<void>
  onOpenPublishModal: (item: ContentItem) => void
  onOpenFeedbackModal: (contentId: number) => void
  onShowToast: (msg: string) => void
}

export const ContentLibraryPage: React.FC<ContentLibraryPageProps> = ({
  contents,
  brands,
  products,
  onApprove,
  onUpdateStatus,
  onOpenPublishModal,
  onOpenFeedbackModal,
  onShowToast
}) => {
  const { t, language } = useI18n()
  const [libraryFilter, setLibraryFilter] = useState('all')
  const [libraryPlatform, setLibraryPlatform] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  function copyToClipboard(text: string) {
    void navigator.clipboard.writeText(text)
    onShowToast(language === 'en' ? 'Copied to clipboard!' : 'Đã sao chép vào bộ nhớ tạm!')
  }

  const filteredContents = contents.filter(c => {
    const matchesFilter = libraryFilter === 'all' || c.status?.toLowerCase() === libraryFilter.toLowerCase()
    const matchesPlatform = libraryPlatform === 'all' || c.platform?.toLowerCase() === libraryPlatform.toLowerCase()
    const matchesSearch =
      !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.body?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesPlatform && matchesSearch
  })

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-pills">
          {[
            { id: 'all', label: t('library.filter.all') },
            { id: 'draft', label: t('library.filter.draft') },
            { id: 'approved', label: t('library.filter.approved') },
            { id: 'published', label: t('library.filter.published') }
          ].map(f => (
            <button
              key={f.id}
              className={`filter-pill ${libraryFilter === f.id ? 'active' : ''}`}
              onClick={() => setLibraryFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <select
            className="select"
            style={{ width: 'auto', padding: '6px 12px' }}
            value={libraryPlatform}
            onChange={e => setLibraryPlatform(e.target.value)}
          >
            <option value="all">{t('library.platform.all')}</option>
            <option value="Facebook">Facebook</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>

          <div className="search-input-wrap">
            <Search size={14} />
            <input
              className="input"
              placeholder={t('library.search_placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredContents.length > 0 ? (
        <div className="items-grid">
          {filteredContents.map(c => {
            const brand = brands.find(b => b.id === c.brand_id)
            const product = products.find(p => p.id === c.product_id)
            return (
              <div key={c.id} className="card-item">
                <div className="card-item-header">
                  <div>
                    <span className="card-badge badge-platform">{c.platform || 'General'}</span>
                    <span
                      className={`card-badge ${
                        c.status?.toLowerCase() === 'published'
                          ? 'badge-published'
                          : c.status?.toLowerCase() === 'approved'
                          ? 'badge-approved'
                          : 'badge-draft'
                      }`}
                      style={{ marginLeft: 6 }}
                    >
                      {c.status || 'Draft'}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#888' }}>ID #{c.id}</span>
                </div>

                <div className="card-item-title">{c.title}</div>
                <div className="card-desc">{c.body}</div>

                <div className="card-meta-list">
                  <div className="card-meta-row">
                    <span>{t('library.brand')}</span>
                    <b>{brand ? brand.name : `Brand #${c.brand_id}`}</b>
                  </div>
                  {product && (
                    <div className="card-meta-row">
                      <span>{t('library.product')}</span>
                      <b>{product.name}</b>
                    </div>
                  )}
                  <div className="card-meta-row">
                    <span>{t('library.content_type')}</span>
                    <b>{c.content_type || 'Caption'}</b>
                  </div>
                </div>

                <div className="card-actions">
                  <div className="action-main-btns">
                    {c.status?.toLowerCase() === 'draft' && (
                      <>
                        <button
                          className="btn btn-sm btn-accent"
                          onClick={() => void onApprove(c.id)}
                          title={language === 'en' ? 'Approve post' : 'Duyệt bài viết'}
                        >
                          <CheckCircle2 size={12} /> {t('library.btn.approve')}
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onOpenPublishModal(c)}
                          title={language === 'en' ? 'Publish to Social' : 'Xuất bản ngay lên MXH'}
                        >
                          <Send size={12} /> {t('library.btn.publish')}
                        </button>
                      </>
                    )}
                    {c.status?.toLowerCase() === 'approved' && (
                      <>
                        <button
                          className="btn btn-sm btn-accent"
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 0,
                            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                          }}
                          onClick={() => onOpenPublishModal(c)}
                          title={language === 'en' ? 'Publish to Social' : 'Xuất bản lên mạng xã hội ngay'}
                        >
                          <Send size={12} /> {t('library.btn.publish_social')}
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => void onUpdateStatus(c.id, 'Draft')}
                          title={language === 'en' ? 'Revert to draft' : 'Chuyển về trạng thái bản nháp'}
                        >
                          <RotateCcw size={12} /> {t('library.btn.revert_draft')}
                        </button>
                      </>
                    )}
                    {c.status?.toLowerCase() === 'published' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onOpenPublishModal(c)}
                        title={language === 'en' ? 'Republish to Social' : 'Đăng lại bài viết lên MXH'}
                      >
                        <Send size={12} /> {t('library.btn.republish')} ({c.platform || 'Facebook'})
                      </button>
                    )}
                  </div>

                  <div className="action-util-btns">
                    <button
                      className="btn-icon-sm"
                      title={language === 'en' ? 'Review post' : 'Đánh giá bài viết'}
                      onClick={() => onOpenFeedbackModal(c.id)}
                    >
                      <Star size={13} />
                    </button>
                    <button
                      className="btn-icon-sm"
                      title={language === 'en' ? 'Copy content' : 'Sao chép nội dung'}
                      onClick={() => copyToClipboard(`${c.title}\n\n${c.body}`)}
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="panel-card empty-box">
          <FileText size={36} color="#7c5cff" style={{ marginBottom: 12 }} />
          <h4>{t('library.empty_title')}</h4>
          <p>{t('library.empty_desc')}</p>
        </div>
      )}
    </div>
  )
}
export default ContentLibraryPage
