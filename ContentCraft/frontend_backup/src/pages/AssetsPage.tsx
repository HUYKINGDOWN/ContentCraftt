import React from 'react'
import { ProductAsset, Product } from '../types'
import { useI18n } from '../context/I18nContext'

interface AssetsPageProps {
  assets: ProductAsset[]
  products: Product[]
}

export const AssetsPage: React.FC<AssetsPageProps> = ({ assets, products }) => {
  const { t } = useI18n()

  return (
    <div className="asset-gallery">
      {assets.map(ass => {
        const product = products.find(p => p.id === ass.product_id)
        const colors = ass.color_palette ? ass.color_palette.split(',') : []
        return (
          <div key={ass.id} className="asset-card">
            <div className="asset-image-wrap">
              <img src={ass.url} alt={ass.name || 'Product Asset'} />
            </div>
            <div className="asset-content">
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                {ass.name || t('assets.image_title')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                {t('assets.product')} {product ? product.name : `#${ass.product_id}`}
              </div>

              {colors.length > 0 && (
                <div>
                  <span className="form-label">{t('assets.palette')}</span>
                  <div className="palette-swatches">
                    {colors.map((c, i) => (
                      <div
                        key={i}
                        className="palette-swatch"
                        style={{ backgroundColor: c.trim() }}
                        title={c.trim()}
                      />
                    ))}
                  </div>
                </div>
              )}

              {ass.extracted_tags && (
                <div>
                  <span className="form-label">{t('assets.tags')}</span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {ass.extracted_tags.split(',').map((tTag, idx) => (
                      <span key={idx} className="card-badge badge-platform" style={{ fontSize: 9 }}>
                        #{tTag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default AssetsPage
