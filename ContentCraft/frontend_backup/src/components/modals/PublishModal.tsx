import React, { useState, useEffect } from 'react'
import { X, Send, CheckCircle2, ExternalLink } from 'lucide-react'
import { ContentItem } from '../../types'
import { useI18n } from '../../context/I18nContext'

interface PublishModalProps {
  item: ContentItem | null
  onClose: () => void
  onPublishApi: (contentId: number, platform: string) => Promise<void>
  onPublishLive: (item: ContentItem, platform: string) => Promise<void>
}

export const PublishModal: React.FC<PublishModalProps> = ({
  item,
  onClose,
  onPublishApi,
  onPublishLive
}) => {
  const { t } = useI18n()
  const [platform, setPlatform] = useState('Facebook')

  useEffect(() => {
    if (item?.platform) {
      setPlatform(item.platform)
    }
  }, [item])

  if (!item) return null

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Send size={18} color="#10b981" />
            <h3>{t('modal.publish.title')}</h3>
          </div>
          <button
            style={{ background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            background: 'var(--bg-card-subtle)',
            padding: 14,
            borderRadius: 10,
            border: '1px solid var(--border-subtle)',
            marginBottom: 18
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 700 }}>
              {t('modal.publish.article')} #{item.id}
            </span>
            <span className={`card-badge badge-${item.status?.toLowerCase() || 'approved'}`}>
              {item.status || 'APPROVED'}
            </span>
          </div>
          <h4 style={{ fontSize: 15, color: 'var(--text-main)', marginBottom: 6 }}>{item.title}</h4>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              maxHeight: 120,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap'
            }}
          >
            {item.body}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">{t('modal.publish.platform_label')}</label>
          <div className="platform-chips">
            {['Facebook', 'TikTok', 'Instagram', 'LinkedIn'].map(p => (
              <button
                key={p}
                type="button"
                className={`platform-chip ${platform.toLowerCase() === p.toLowerCase() ? 'selected' : ''}`}
                onClick={() => setPlatform(p)}
              >
                <span>
                  {p === 'Facebook' ? '📘' : p === 'TikTok' ? '🎵' : p === 'Instagram' ? '📸' : '💼'}
                </span>
                <span>{p}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            padding: '12px 14px',
            background: 'rgba(124, 92, 255, 0.08)',
            border: '1px solid rgba(124, 92, 255, 0.25)',
            borderRadius: 10,
            fontSize: 12,
            color: 'var(--text-main)',
            marginTop: 14
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>
              {t('modal.publish.notice_title')} {platform}:
            </span>
          </div>
          <div>{t('modal.publish.notice_m1')}</div>
          <div>{t('modal.publish.notice_m2')}</div>
        </div>

        <div className="modal-footer" style={{ flexWrap: 'wrap', gap: 8 }}>
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            className="btn btn-secondary"
            title="API Backend"
            onClick={() => onPublishApi(item.id, platform)}
          >
            <Send size={14} /> {t('modal.publish.btn_api')}
          </button>
          <button
            className="btn btn-accent"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 0,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
            onClick={() => onPublishLive(item, platform)}
          >
            <ExternalLink size={14} /> {t('modal.publish.btn_live')} {platform}
          </button>
        </div>
      </div>
    </div>
  )
}
