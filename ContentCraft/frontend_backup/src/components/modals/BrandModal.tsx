import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

interface BrandModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (brandData: {
    name: string
    industry: string
    brand_voice: string
    communication_style: string
    core_values: string
    marketing_preferences: string
  }) => Promise<void>
}

export const BrandModal: React.FC<BrandModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: '',
    industry: 'F&B / Đồ uống',
    brand_voice: 'Thân thiện, trẻ trung',
    communication_style: 'Gần gũi xưng Bạn - Mình',
    core_values: 'Chất lượng, nguyên bản',
    marketing_preferences: 'Tập trung Facebook & TikTok'
  })

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!formData.name.trim()) return
    await onSubmit(formData)
    setFormData({
      name: '',
      industry: 'F&B / Đồ uống',
      brand_voice: 'Thân thiện, trẻ trung',
      communication_style: 'Gần gũi xưng Bạn - Mình',
      core_values: 'Chất lượng, nguyên bản',
      marketing_preferences: 'Tập trung Facebook & TikTok'
    })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t('modal.brand.title')}</h3>
          <button
            style={{ background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.brand.name')}</label>
          <input
            className="input"
            placeholder="Ví dụ: Cà Phê Muối Sài Gòn"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.brand.industry')}</label>
          <input
            className="input"
            value={formData.industry}
            onChange={e => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.brand.voice')}</label>
          <input
            className="input"
            value={formData.brand_voice}
            onChange={e => setFormData({ ...formData, brand_voice: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.brand.style')}</label>
          <input
            className="input"
            value={formData.communication_style}
            onChange={e => setFormData({ ...formData, communication_style: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.brand.values')}</label>
          <textarea
            className="textarea"
            rows={2}
            value={formData.core_values}
            onChange={e => setFormData({ ...formData, core_values: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.brand.marketing')}</label>
          <textarea
            className="textarea"
            rows={2}
            value={formData.marketing_preferences}
            onChange={e => setFormData({ ...formData, marketing_preferences: e.target.value })}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {t('modal.brand.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
