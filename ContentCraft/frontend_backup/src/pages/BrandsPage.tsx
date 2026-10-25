import React from 'react'
import { Sparkles } from 'lucide-react'
import { Brand } from '../types'
import { useI18n } from '../context/I18nContext'

interface BrandsPageProps {
  brands: Brand[]
  onSelectBrandForStudio: (brandId: number) => void
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ brands, onSelectBrandForStudio }) => {
  const { t } = useI18n()

  return (
    <div className="items-grid">
      {brands.map(b => (
        <div key={b.id} className="card-item">
          <div className="card-item-header">
            <span className="card-badge badge-approved">{b.industry || 'Brand'}</span>
            <span style={{ fontSize: 11, color: '#888' }}>ID #{b.id}</span>
          </div>
          <div className="card-item-title">{b.name}</div>
          <div className="card-desc">
            {b.description || b.marketing_preferences || t('brands.no_desc')}
          </div>

          <div className="card-meta-list">
            <div className="card-meta-row">
              <span>{t('brands.voice')}</span>
              <b>{b.brand_voice || b.tone || 'Friendly'}</b>
            </div>
            <div className="card-meta-row">
              <span>{t('brands.values')}</span>
              <b>{b.core_values || 'Authentic, Quality'}</b>
            </div>
            <div className="card-meta-row">
              <span>{t('brands.style')}</span>
              <b>{b.communication_style || 'Direct & Warm'}</b>
            </div>
          </div>

          <div className="card-actions">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onSelectBrandForStudio(b.id)}
            >
              <Sparkles size={12} /> {t('brands.use_in_studio')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default BrandsPage
