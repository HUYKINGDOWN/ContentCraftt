import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Brand } from '../../types'
import { useI18n } from '../../context/I18nContext'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  brands: Brand[]
  defaultBrandId: number
  onSubmit: (productData: {
    name: string
    brand_id: number
    category_name: string
    usp: string
    key_features: string
    description: string
  }) => Promise<void>
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  brands,
  defaultBrandId,
  onSubmit
}) => {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: '',
    brand_id: defaultBrandId || 1,
    category_name: 'Cà phê',
    usp: '',
    key_features: '',
    description: ''
  })

  useEffect(() => {
    if (defaultBrandId) {
      setFormData(prev => ({ ...prev, brand_id: defaultBrandId }))
    }
  }, [defaultBrandId])

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!formData.name.trim()) return
    await onSubmit(formData)
    setFormData({
      name: '',
      brand_id: defaultBrandId || 1,
      category_name: 'Cà phê',
      usp: '',
      key_features: '',
      description: ''
    })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t('modal.product.title')}</h3>
          <button
            style={{ background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.product.name')}</label>
          <input
            className="input"
            placeholder="Ví dụ: Cà Phê Muối Kem Béo Chai 250ml"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.product.brand')}</label>
          <select
            className="select"
            value={formData.brand_id}
            onChange={e => setFormData({ ...formData, brand_id: Number(e.target.value) })}
          >
            {brands.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.product.category')}</label>
          <input
            className="input"
            placeholder="Đồ uống, Bánh ngọt..."
            value={formData.category_name}
            onChange={e => setFormData({ ...formData, category_name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.product.usp')}</label>
          <input
            className="input"
            placeholder="Lớp kem muối sánh mịn giữ trọn vị 24h..."
            value={formData.usp}
            onChange={e => setFormData({ ...formData, usp: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.product.features')}</label>
          <input
            className="input"
            placeholder="Hạt Robusta Đắk Lắk, kem béo không ngấy..."
            value={formData.key_features}
            onChange={e => setFormData({ ...formData, key_features: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.product.desc')}</label>
          <textarea
            className="textarea"
            rows={3}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {t('modal.product.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
