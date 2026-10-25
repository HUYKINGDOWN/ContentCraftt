import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

interface AudienceModalProps {
  isOpen: boolean
  onClose: () => void
  defaultBrandId: number
  onSubmit: (audienceData: {
    name: string
    brand_id: number
    age_min: number
    age_max: number
    gender: string
    interests: string
    behaviors: string
    notes: string
  }) => Promise<void>
}

export const AudienceModal: React.FC<AudienceModalProps> = ({
  isOpen,
  onClose,
  defaultBrandId,
  onSubmit
}) => {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: '',
    brand_id: defaultBrandId || 1,
    age_min: 18,
    age_max: 35,
    gender: 'All',
    interests: '',
    behaviors: '',
    notes: ''
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
      age_min: 18,
      age_max: 35,
      gender: 'All',
      interests: '',
      behaviors: '',
      notes: ''
    })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t('modal.audience.title')}</h3>
          <button
            style={{ background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.audience.name')}</label>
          <input
            className="input"
            placeholder="Ví dụ: Gen Z & Dân văn phòng Sài Gòn"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{t('modal.audience.age_min')}</label>
            <input
              type="number"
              className="input"
              value={formData.age_min}
              onChange={e => setFormData({ ...formData, age_min: Number(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('modal.audience.age_max')}</label>
            <input
              type="number"
              className="input"
              value={formData.age_max}
              onChange={e => setFormData({ ...formData, age_max: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.audience.gender')}</label>
          <select
            className="select"
            value={formData.gender}
            onChange={e => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="All">{t('modal.audience.gender_all')}</option>
            <option value="Nam">{t('modal.audience.gender_male')}</option>
            <option value="Nữ">{t('modal.audience.gender_female')}</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.audience.interests')}</label>
          <textarea
            className="textarea"
            rows={2}
            value={formData.interests}
            onChange={e => setFormData({ ...formData, interests: e.target.value })}
            placeholder="Thích khám phá đồ uống mới, tụ tập bạn bè..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.audience.behaviors')}</label>
          <textarea
            className="textarea"
            rows={2}
            value={formData.behaviors}
            onChange={e => setFormData({ ...formData, behaviors: e.target.value })}
            placeholder="Đặt đồ uống qua ShopeeFood/GrabFood vào 9h-10h sáng..."
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {t('modal.audience.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
