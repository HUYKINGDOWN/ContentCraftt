import React from 'react'
import { Sparkles } from 'lucide-react'
import { Audience } from '../types'
import { useI18n } from '../context/I18nContext'

interface AudiencesPageProps {
  audiences: Audience[]
  onSelectAudienceForStudio: (audience: Audience) => void
}

export const AudiencesPage: React.FC<AudiencesPageProps> = ({
  audiences,
  onSelectAudienceForStudio
}) => {
  const { t } = useI18n()

  return (
    <div className="items-grid">
      {audiences.map(a => (
        <div key={a.id} className="card-item">
          <div className="card-item-header">
            <span className="card-badge badge-approved">
              {a.age_min || 18} - {a.age_max || 35} {t('audiences.years_old')}
            </span>
            <span className="card-badge badge-platform">{a.gender || 'All'}</span>
          </div>
          <div className="card-item-title">{a.name}</div>
          <div className="card-desc">{a.notes || a.description || t('audiences.no_notes')}</div>

          <div className="card-meta-list">
            <div className="card-meta-row">
              <span>{t('audiences.interests')}</span>
              <b>{a.interests || t('audiences.not_updated')}</b>
            </div>
            <div className="card-meta-row">
              <span>{t('audiences.behaviors')}</span>
              <b>{a.behaviors || t('audiences.not_updated')}</b>
            </div>
          </div>

          <div className="card-actions">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onSelectAudienceForStudio(a)}
            >
              <Sparkles size={12} /> {t('audiences.apply')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default AudiencesPage
