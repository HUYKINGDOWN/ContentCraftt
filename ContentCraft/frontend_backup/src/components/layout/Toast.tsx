import React from 'react'
import { Check } from 'lucide-react'

interface ToastProps {
  message: string | null
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null

  return (
    <div className="toast-container">
      <div className="toast">
        <Check size={16} color="#10b981" />
        <span>{message}</span>
      </div>
    </div>
  )
}
