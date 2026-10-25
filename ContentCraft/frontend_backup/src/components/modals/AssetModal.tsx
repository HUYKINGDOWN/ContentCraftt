import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Product } from '../../types'
import { useI18n } from '../../context/I18nContext'

interface AssetModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onSubmit: (assetData: {
    product_id: number
    url: string
    name: string
    kind: string
    extracted_tags: string
    color_palette: string
  }) => Promise<void>
}

export const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  products,
  onSubmit
}) => {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    product_id: products.length > 0 ? products[0].id : 1,
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772',
    name: 'cafe_latte_art.jpg',
    kind: 'image/jpeg',
    extracted_tags: 'coffee, latte, cup, drink, cafe',
    color_palette: '#3B2314, #E8C39E, #FFFFFF'
  })

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!formData.url.trim()) return
    await onSubmit(formData)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t('modal.asset.title')}</h3>
          <button
            style={{ background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.asset.url')}</label>
          <input
            className="input"
            value={formData.url}
            onChange={e => setFormData({ ...formData, url: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.asset.name')}</label>
          <input
            className="input"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.asset.product')}</label>
          <select
            className="select"
            value={formData.product_id}
            onChange={e => setFormData({ ...formData, product_id: Number(e.target.value) })}
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.asset.palette')}</label>
          <input
            className="input"
            placeholder="#3B2314, #E8C39E, #FFFFFF"
            value={formData.color_palette}
            onChange={e => setFormData({ ...formData, color_palette: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.asset.tags')}</label>
          <input
            className="input"
            placeholder="coffee, salted cream, iced coffee"
            value={formData.extracted_tags}
            onChange={e => setFormData({ ...formData, extracted_tags: e.target.value })}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {t('modal.asset.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
