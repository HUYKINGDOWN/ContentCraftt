import React from 'react'
import { RefreshCw, Plus, Moon, Sun, Settings } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { useTheme } from '../../context/ThemeContext'

interface TopbarProps {
  tab: string
  refreshing: boolean
  onRefresh: () => void
  onOpenModal: (modal: string) => void
  onNavigateSettings?: () => void
}

export const Topbar: React.FC<TopbarProps> = ({
  tab,
  refreshing,
  onRefresh,
  onOpenModal,
  onNavigateSettings
}) => {
  const { t, language, setLanguage } = useI18n()
  const { theme, toggleTheme } = useTheme()

  const getBreadcrumbTitle = () => {
    switch (tab) {
      case 'studio':
        return t('sub.studio')
      case 'library':
        return t('sub.library')
      case 'brands':
        return t('sub.brands')
      case 'products':
        return t('sub.products')
      case 'audiences':
        return t('sub.audiences')
      case 'rules':
        return t('sub.rules')
      case 'assets':
        return t('sub.assets')
      case 'analytics':
        return t('sub.analytics')
      case 'settings':
        return t('sub.settings')
      default:
        return ''
    }
  }

  const getMainTitle = () => {
    switch (tab) {
      case 'studio':
        return t('title.studio')
      case 'library':
        return t('title.library')
      case 'brands':
        return t('title.brands')
      case 'products':
        return t('title.products')
      case 'audiences':
        return t('title.audiences')
      case 'rules':
        return t('title.rules')
      case 'assets':
        return t('title.assets')
      case 'analytics':
        return t('title.analytics')
      case 'settings':
        return t('title.settings')
      default:
        return ''
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-info">
        <div className="breadcrumbs">
          <span>ContentCraft</span>
          <span>/</span>
          <span>{getBreadcrumbTitle()}</span>
        </div>
        <h1>{getMainTitle()}</h1>
      </div>

      <div className="topbar-actions">
        {/* Quick Language Toggle */}
        <button
          className="btn btn-secondary"
          style={{ padding: '6px 10px', fontSize: 12, fontWeight: 700 }}
          title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
        >
          <span>{language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
        </button>

        {/* Quick Theme Toggle */}
        <button
          className="btn btn-secondary btn-icon"
          title={theme === 'dark' ? 'Chuyển sang giao diện Sáng (Light Mode)' : 'Chuyển sang giao diện Tối (Dark Mode)'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#7c5cff" />}
        </button>

        {/* Quick Settings Button */}
        {onNavigateSettings && tab !== 'settings' && (
          <button
            className="btn btn-secondary btn-icon"
            title={t('nav.settings')}
            onClick={onNavigateSettings}
          >
            <Settings size={16} />
          </button>
        )}

        {/* Refresh Sync Button */}
        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={14} className={refreshing ? 'spin-anim' : ''} />
          <span>{refreshing ? t('topbar.syncing') : t('topbar.sync')}</span>
        </button>

        {/* Contextual Create Buttons */}
        {tab === 'brands' && (
          <button className="btn btn-primary" onClick={() => onOpenModal('brand')}>
            <Plus size={15} /> {t('topbar.add_brand')}
          </button>
        )}
        {tab === 'products' && (
          <button className="btn btn-primary" onClick={() => onOpenModal('product')}>
            <Plus size={15} /> {t('topbar.add_product')}
          </button>
        )}
        {tab === 'audiences' && (
          <button className="btn btn-primary" onClick={() => onOpenModal('audience')}>
            <Plus size={15} /> {t('topbar.add_audience')}
          </button>
        )}
        {tab === 'rules' && (
          <button className="btn btn-primary" onClick={() => onOpenModal('rule')}>
            <Plus size={15} /> {t('topbar.add_rule')}
          </button>
        )}
        {tab === 'assets' && (
          <button className="btn btn-primary" onClick={() => onOpenModal('asset')}>
            <Plus size={15} /> {t('topbar.add_asset')}
          </button>
        )}
      </div>
    </header>
  )
}
