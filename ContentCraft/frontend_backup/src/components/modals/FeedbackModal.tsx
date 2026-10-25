import React, { useState } from 'react'
import { X, Star } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

interface FeedbackModalProps {
  isOpen: boolean
  contentId: number | null
  onClose: () => void
  onSubmit: (contentId: number, rating: number, comment: string) => Promise<void>
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  contentId,
  onClose,
  onSubmit
}) => {
  const { t } = useI18n()
  const [rating, setRating] = useState(5)
  const [notes, setNotes] = useState('')

  if (!isOpen || !contentId) return null

  const handleSubmit = async () => {
    await onSubmit(contentId, rating, notes)
    setNotes('')
    setRating(5)
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {t('modal.feedback.title')} #{contentId}
          </h3>
          <button
            style={{ background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.feedback.rating')}</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                <Star size={24} fill={star <= rating ? '#fbbf24' : 'transparent'} />
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t('modal.feedback.notes')}</label>
          <textarea
            className="textarea"
            rows={3}
            placeholder="Ví dụ: Giọng văn rất chuẩn phong cách quán, độ dài vừa phải cho TikTok/Facebook..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {t('modal.feedback.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
