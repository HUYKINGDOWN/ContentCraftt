import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

interface RuleModalProps {
  isOpen: boolean
  onClose: () => void
  defaultBrandId: number
  onSubmit: (ruleData: {
    name: string
    brand_id: number
    restricted_words: string
    warnings: string
    language_preference: string
  }) => Promise<void>
}

export const RuleModal: React.FC<RuleModalProps> = ({
  isOpen,
  onClose,
  defaultBrandId,
  onSubmit
}) => {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: 'Khuyến mãi & Cam kết',
    brand_id: defaultBrandId || 1,
    restricted_words: 'rẻ nhất, cam kết 100%, vĩnh viễn, trị bệnh',
    warnings: 'Ghi rõ địa chỉ và thời gian áp dụng ưu đãi',
    language_preference: 'VI'
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
      restricted_words: '',
      warnings: '',
      language_preference: 'VI'
    })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{t('modal.rule.title')}</h3>
          <button
            style={{ background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.rule.name')}</label>
          <input
            className="input"
            placeholder="Ví dụ: Quy định từ cấm & Giảm giá"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.rule.restricted')}</label>
          <textarea
            className="textarea"
            rows={3}
            placeholder="Ví dụ: rẻ nhất, cam kết 100%, vĩnh viễn, trị bệnh"
            value={formData.restricted_words}
            onChange={e => setFormData({ ...formData, restricted_words: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.rule.warnings')}</label>
          <textarea
            className="textarea"
            rows={2}
            placeholder="Ví dụ: Cần ghi rõ thời gian kết thúc chương trình..."
            value={formData.warnings}
            onChange={e => setFormData({ ...formData, warnings: e.target.value })}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {t('modal.rule.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
