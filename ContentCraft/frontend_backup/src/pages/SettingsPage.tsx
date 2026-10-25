import React from 'react'
import { Moon, Sun, Globe, Check, Server, Sparkles } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useI18n } from '../context/I18nContext'

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <section className="hero-banner" style={{ marginBottom: 24, padding: '24px 28px' }}>
        <div className="hero-content">
          <span className="hero-tag">
            <Sparkles size={13} /> PREFERENCES
          </span>
          <h2 className="hero-title" style={{ fontSize: 22 }}>
            {t('settings.title')}
          </h2>
          <p className="hero-desc" style={{ fontSize: 13, maxWidth: 600 }}>
            {t('settings.subtitle')}
          </p>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* CARD 1: THEME */}
        <div className="panel-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {theme === 'dark' ? <Moon size={18} color="#7c5cff" /> : <Sun size={18} color="#f59e0b" />}
              {t('settings.theme.title')}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {t('settings.theme.desc')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {/* Dark Mode Option */}
            <div
              onClick={() => setTheme('dark')}
              style={{
                cursor: 'pointer',
                padding: '16px 20px',
                borderRadius: 14,
                border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: theme === 'dark' ? 'rgba(124, 92, 255, 0.12)' : 'var(--bg-card-subtle)',
                boxShadow: theme === 'dark' ? '0 0 20px rgba(124, 92, 255, 0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#13141d',
                    border: '1px solid #333',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#7c5cff'
                  }}
                >
                  <Moon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                    {t('settings.theme.dark')}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>#0f1016 Dark Theme</div>
                </div>
              </div>
              {theme === 'dark' && (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <Check size={14} />
                </div>
              )}
            </div>

            {/* Light Mode Option */}
            <div
              onClick={() => setTheme('light')}
              style={{
                cursor: 'pointer',
                padding: '16px 20px',
                borderRadius: 14,
                border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: theme === 'light' ? 'rgba(124, 92, 255, 0.12)' : 'var(--bg-card-subtle)',
                boxShadow: theme === 'light' ? '0 0 20px rgba(124, 92, 255, 0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#ffffff',
                    border: '1px solid #ddd',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#f59e0b'
                  }}
                >
                  <Sun size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                    {t('settings.theme.light')}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>#f5f6fa Light Theme</div>
                </div>
              </div>
              {theme === 'light' && (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <Check size={14} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CARD 2: LANGUAGE */}
        <div className="panel-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe size={18} color="#10b981" />
              {t('settings.lang.title')}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {t('settings.lang.desc')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {/* Vietnamese Option */}
            <div
              onClick={() => setLanguage('vi')}
              style={{
                cursor: 'pointer',
                padding: '16px 20px',
                borderRadius: 14,
                border: language === 'vi' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                background: language === 'vi' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🇻🇳</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                    Tiếng Việt
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Vietnamese (Default)</div>
                </div>
              </div>
              {language === 'vi' && (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#10b981', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <Check size={14} />
                </div>
              )}
            </div>

            {/* English Option */}
            <div
              onClick={() => setLanguage('en')}
              style={{
                cursor: 'pointer',
                padding: '16px 20px',
                borderRadius: 14,
                border: language === 'en' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                background: language === 'en' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🇬🇧</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                    English
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Tiếng Anh quốc tế</div>
                </div>
              </div>
              {language === 'en' && (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#10b981', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <Check size={14} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CARD 3: SYSTEM INFO */}
        <div className="panel-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Server size={18} color="#3b82f6" />
              {t('settings.info.title')}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('settings.info.version')}:</span>
              <b style={{ color: 'var(--text-main)' }}>ContentCraft Suite v0.2.0</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('settings.info.backend')}:</span>
              <code style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{backendUrl}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card-subtle)', borderRadius: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('settings.info.status')}:</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#10b981', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                {t('settings.info.connected')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SettingsPage
