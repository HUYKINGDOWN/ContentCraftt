import React from 'react'
import { motion } from 'motion/react'

export interface TabItem<T extends string = string> {
  id: T
  label: React.ReactNode
  icon?: React.ReactNode
}

interface SlidingTabsProps<T extends string = string> {
  tabs: TabItem<T>[]
  activeId: T
  onChange: (id: T) => void
  layoutId: string
  className?: string
  pillClassName?: string
  size?: 'sm' | 'md'
}

export function SlidingTabs<T extends string = string>({
  tabs,
  activeId,
  onChange,
  layoutId,
  className = '',
  pillClassName = '',
  size = 'md',
}: SlidingTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={`relative inline-flex items-center rounded-xl p-1 select-none ${className}`}
      style={{
        background: 'var(--card-subtle, rgba(0, 0, 0, 0.04))',
        border: '1px solid var(--line, rgba(0, 0, 0, 0.08))',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative z-10 inline-flex items-center justify-center gap-1.5 font-semibold transition-colors duration-150 ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs'
            }`}
            style={{
              color: isActive ? '#059669' : 'var(--muted, #6b7280)',
              borderRadius: '8px',
            }}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>

            {/* Sliding Pill Indicator powered by Motion layoutId */}
            {isActive && (
              <motion.span
                layoutId={layoutId}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 32,
                  mass: 0.8,
                }}
                className={`absolute inset-0 -z-10 rounded-lg shadow-sm ${pillClassName}`}
                style={{
                  background: 'var(--card, #ffffff)',
                  border: '1px solid var(--line, rgba(0, 0, 0, 0.08))',
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

