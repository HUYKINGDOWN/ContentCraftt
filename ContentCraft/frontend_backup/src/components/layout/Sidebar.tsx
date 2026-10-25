import React from 'react'
import {
  Sparkles,
  Layers3,
  Package,
  Users,
  FileText,
  Activity,
  Image as ImageIcon,
  ShieldAlert,
  Settings
} from 'lucide-react'
import { Brand } from '../../types'
import { useI18n } from '../../context/I18nContext'

interface SidebarProps {
  tab: string
  setTab: (tab: string) => void
  brands: Brand[]
  activeBrandId: number | null
  setActiveBrandId: (id: number) => void
  contentsCount: number
  brandsCount: number
  productsCount: number
  audiencesCount: number
  rulesCount: number
  assetsCount: number
  currentUser: { full_name?: string; role?: string }
}

export const Sidebar: React.FC<SidebarProps> = ({
  tab,
  setTab,
  brands,
  activeBrandId,
  setActiveBrandId,
  contentsCount,
  brandsCount,
  productsCount,
  audiencesCount,
  rulesCount,
  assetsCount,
  currentUser
}) => {
  const { t } = useI18n()

  return (
    <aside className="sidebar">
      <div className="brandmark">
        <div className="logo-badge">
          <Sparkles size={22} />
        </div>
        <div className="brandmark-info">
          <h2>ContentCraft</h2>
          <span>AI Content Suite v0.2.0</span>
        </div>
      </div>

      {/* Active Brand Switcher */}
      <div className="sidebar-brand-context">
        <div className="context-label">
          <span>{t('nav.current_brand')}</span>
          <Layers3 size={12} />
        </div>
        <select
          className="context-select"
          value={activeBrandId || ''}
          onChange={e => setActiveBrandId(Number(e.target.value))}
        >
          {brands.map(b => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="nav-section-title">{t('nav.workspace')}</div>
      <button
        className={`nav-item ${tab === 'studio' ? 'active' : ''}`}
        onClick={() => setTab('studio')}
      >
        <Sparkles size={18} />
        <span>{t('nav.studio')}</span>
      </button>

      <button
        className={`nav-item ${tab === 'library' ? 'active' : ''}`}
        onClick={() => setTab('library')}
      >
        <FileText size={18} />
        <span>{t('nav.library')}</span>
        <span className="nav-count">{contentsCount}</span>
      </button>

      <button
        className={`nav-item ${tab === 'brands' ? 'active' : ''}`}
        onClick={() => setTab('brands')}
      >
        <Layers3 size={18} />
        <span>{t('nav.brands')}</span>
        <span className="nav-count">{brandsCount}</span>
      </button>

      <button
        className={`nav-item ${tab === 'products' ? 'active' : ''}`}
        onClick={() => setTab('products')}
      >
        <Package size={18} />
        <span>{t('nav.products')}</span>
        <span className="nav-count">{productsCount}</span>
      </button>

      <button
        className={`nav-item ${tab === 'audiences' ? 'active' : ''}`}
        onClick={() => setTab('audiences')}
      >
        <Users size={18} />
        <span>{t('nav.audiences')}</span>
        <span className="nav-count">{audiencesCount}</span>
      </button>

      <button
        className={`nav-item ${tab === 'rules' ? 'active' : ''}`}
        onClick={() => setTab('rules')}
      >
        <ShieldAlert size={18} />
        <span>{t('nav.rules')}</span>
        <span className="nav-count">{rulesCount}</span>
      </button>

      <button
        className={`nav-item ${tab === 'assets' ? 'active' : ''}`}
        onClick={() => setTab('assets')}
      >
        <ImageIcon size={18} />
        <span>{t('nav.assets')}</span>
        <span className="nav-count">{assetsCount}</span>
      </button>

      <button
        className={`nav-item ${tab === 'analytics' ? 'active' : ''}`}
        onClick={() => setTab('analytics')}
      >
        <Activity size={18} />
        <span>{t('nav.analytics')}</span>
      </button>

      <div style={{ margin: '14px 0 6px', borderTop: '1px solid var(--border-subtle)' }} />

      <button
        className={`nav-item ${tab === 'settings' ? 'active' : ''}`}
        onClick={() => setTab('settings')}
      >
        <Settings size={18} />
        <span>{t('nav.settings')}</span>
      </button>

      {/* Sidebar Footer User Info */}
      <div className="sidebar-footer">
        <div className="user-avatar">
          {currentUser.full_name?.charAt(0) || 'U'}
        </div>
        <div className="user-meta">
          <div className="user-name">{currentUser.full_name}</div>
          <div className="user-role">
            <span className="dot-online" />
            <span>{currentUser.role || 'BrandOwner'}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
