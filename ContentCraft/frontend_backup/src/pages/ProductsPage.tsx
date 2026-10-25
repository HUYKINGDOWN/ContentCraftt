import React from 'react'
import { Sparkles } from 'lucide-react'
import { Product, Brand } from '../types'
import { useI18n } from '../context/I18nContext'

interface ProductsPageProps {
  products: Product[]
  brands: Brand[]
  onSelectProductForStudio: (product: Product) => void
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  brands,
  onSelectProductForStudio
}) => {
  const { t } = useI18n()

  return (
    <div className="items-grid">
      {products.map(p => {
        const brand = brands.find(b => b.id === p.brand_id)
        return (
          <div key={p.id} className="card-item">
            <div className="card-item-header">
              <span className="card-badge badge-platform">{p.category_name || 'Product'}</span>
              <span className="card-badge badge-published">
                {p.status ? t('products.active') : t('products.inactive')}
              </span>
            </div>
            <div className="card-item-title">{p.name}</div>
            <div className="card-desc">{p.description || t('products.no_desc')}</div>

            <div className="card-meta-list">
              <div className="card-meta-row">
                <span>{t('products.brand')}</span>
                <b>{brand ? brand.name : `Brand #${p.brand_id}`}</b>
              </div>
              {p.usp && (
                <div className="card-meta-row">
                  <span>{t('products.usp')}</span>
                  <b style={{ color: '#a855f7' }}>{p.usp}</b>
                </div>
              )}
              {p.key_features && (
                <div className="card-meta-row">
                  <span>{t('products.features')}</span>
                  <b>{p.key_features}</b>
                </div>
              )}
            </div>

            <div className="card-actions">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onSelectProductForStudio(p)}
              >
                <Sparkles size={12} /> {t('products.create_post')}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default ProductsPage
