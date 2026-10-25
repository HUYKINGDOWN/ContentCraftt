import React from 'react'
import { ContentRule } from '../types'
import { useI18n } from '../context/I18nContext'

interface RulesPageProps {
  rules: ContentRule[]
}

export const RulesPage: React.FC<RulesPageProps> = ({ rules }) => {
  const { t } = useI18n()

  return (
    <div className="items-grid">
      {rules.map(r => (
        <div key={r.id} className="card-item">
          <div className="card-item-header">
            <span className="card-badge badge-platform">{r.category || r.name}</span>
            <span style={{ fontSize: 11, color: '#888' }}>
              {t('rules.priority')} {r.language_preference || 'VI'}
            </span>
          </div>
          <div className="card-item-title">{r.name}</div>

          <div style={{ marginTop: 10, marginBottom: 14 }}>
            <div className="form-label" style={{ color: '#ef4444' }}>
              {t('rules.restricted')}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {(r.restricted_words || r.rules || t('rules.none'))
                .split(',')
                .map((word, idx) => (
                  <span
                    key={idx}
                    className="card-badge badge-draft"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}
                  >
                    ✕ {word.trim()}
                  </span>
                ))}
            </div>
          </div>

          {r.warnings && (
            <div style={{ marginBottom: 14 }}>
              <div className="form-label" style={{ color: '#f59e0b' }}>
                {t('rules.warnings')}
              </div>
              <div style={{ fontSize: 12, color: '#fed7aa', lineHeight: 1.5 }}>
                ⚠️ {r.warnings}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
export default RulesPage
