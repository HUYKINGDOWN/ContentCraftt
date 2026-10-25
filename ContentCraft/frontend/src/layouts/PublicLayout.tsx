import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, Check, Menu, Moon, ShieldCheck, Sparkles, Sun, X } from 'lucide-react'
import { Modal } from '../components/ui'
import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'
import '../pages/public/marketing.css'

const links = [
  ['Features', '/features'],
  ['Integrations', '/integrations'],
  ['Built For', '/built-for'],
  ['Resources', '/resources'],
]

export default function PublicLayout() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialog, setDialog] = useState<string | null>(null)
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useI18n()

  const links = [
    [t('mkt.features'), '/features'],
    [t('mkt.integrations'), '/integrations'],
    [t('mkt.builtFor'), '/built-for'],
    [t('mkt.resources'), '/resources'],
  ]

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])
  const show = (name: string) => {
    setMenuOpen(false)
    setDialog(name)
  }

  return (
    <div className="marketing-shell">
      <header className="mkt-header">
        <Link className="mkt-logo" to="/" aria-label="ContentCraft home">
          <span>
            <Sparkles size={19} fill="currentColor" />
          </span>
          ContentCraft
        </Link>
        <nav className={`mkt-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive || (to === '/features' && location.pathname === '/') ? 'is-active' : ''
              }
            >
              {label}
            </NavLink>
          ))}
          <button onClick={() => show('Pricing')}>{t('mkt.pricing')}</button>
          <Link className="mkt-mobile-signin" to="/login">
            {t('btn.signIn')}
          </Link>
        </nav>
        <div className="mkt-header-actions">
          <button
            className="icon-button"
            title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            onClick={toggleLanguage}
            style={{ fontWeight: 700, fontSize: '0.85rem', width: 'auto', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--line)' }}
          >
            {language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
          </button>
          <button
            className="icon-button"
            title={theme === 'dark' ? t('header.theme.light') : t('header.theme.dark')}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{ border: '1px solid var(--line)', borderRadius: '8px', padding: '6px' }}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link className="mkt-signin" to="/login">
            {t('btn.signIn')}
          </Link>
          <Link className="mkt-button mkt-button-small" to="/get-started">
            {t('btn.startFree')} <ArrowRight size={15} />
          </Link>
          <button
            className="mkt-menu-button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
      <footer className="mkt-footer">
        <div className="mkt-footer-brand">
          <Link to="/" className="mkt-logo">
            ContentCraft
          </Link>
          <span>© 2025 ContentCraft Technologies Inc. All rights reserved.</span>
        </div>
        <nav aria-label="Footer navigation">
          {links.map(([label, to]) => (
            <Link to={to} key={to}>
              {label}
            </Link>
          ))}
          {['Pricing', 'Privacy Policy', 'Terms of Service', 'Security'].map((label) => (
            <button key={label} onClick={() => show(label)}>
              {label === 'Security' && <span className="mkt-status-dot" />}
              {label}
            </button>
          ))}
        </nav>
      </footer>
      <Modal open={!!dialog} title={dialog || ''} onClose={() => setDialog(null)}>
        {dialog === 'Pricing' ? (
          <div className="mkt-dialog-content">
            <span className="mkt-pill">Interactive demo</span>
            <h3>Explore your content workspace.</h3>
            <p>
              This Capstone preview includes the ContentCraft interface and local demo workflows.
              There is no paid subscription, billing, or live AI service connected.
            </p>
            <ul>
              {[
                'Content and image studio previews',
                'Brand, product, and audience management',
                'Team workflows and analytics demo',
              ].map((item) => (
                <li key={item}>
                  <Check size={16} />
                  {item}
                </li>
              ))}
            </ul>
            <Link className="mkt-button" to="/register" onClick={() => setDialog(null)}>
              Try the demo workspace <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="mkt-dialog-content">
            <ShieldCheck className="mkt-dialog-icon" />
            <h3>
              {dialog === 'Security'
                ? 'Your demo, under your control.'
                : `${dialog} — demo information`}
            </h3>
            <p>
              ContentCraft is a Capstone demonstration. Demo workspace changes are stored in this
              browser. Do not enter confidential information, credentials, or real customer data.
            </p>
            <p>
              {dialog === 'Privacy Policy'
                ? 'No live email subscription or third-party integration is activated through these marketing pages.'
                : dialog === 'Terms of Service'
                  ? 'The workspace is provided for evaluating the interface. Generated examples and analytics are demonstration data.'
                  : 'Connecting an integration or making a marketing request displays a preview and does not authorize access to an external account.'}
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
