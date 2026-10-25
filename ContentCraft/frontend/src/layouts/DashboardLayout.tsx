import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Home,
  Image,
  LogOut,
  Menu,
  Moon,
  Package,
  Settings2,
  ShieldCheck,
  Sliders,
  Sparkles,
  Sun,
  Users,
  X,
  ExternalLink,
} from 'lucide-react'
import { Badge, BrandMark, Button, Modal } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'
import { useWorkspace } from '../contexts/WorkspaceContext'
import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'
import { ROUTES } from '../routes/paths'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [panel, setPanel] = useState<'notifications' | 'profile' | 'plan' | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { session, signOut } = useAuth()
  const { contents } = useWorkspace()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useI18n()

  const navigation = [
    [ROUTES.dashboard, t('nav.dashboard'), Home],
    [ROUTES.brands, t('nav.brands'), Building2],
    [ROUTES.products, t('nav.products'), Package],
    [ROUTES.audiences, t('nav.audiences'), Users],
    [ROUTES.contentStudio, t('nav.contentStudio'), Sparkles],
    [ROUTES.imageStudio, t('nav.imageStudio'), Image],
    [ROUTES.history, t('nav.history'), Clock3],
    [ROUTES.analytics, t('nav.analytics'), BarChart3],
    [ROUTES.admin, t('nav.admin'), ShieldCheck],
    [ROUTES.settings, t('nav.settings'), Sliders],
  ] as const

  const title = navigation.find(([path]) => location.pathname === path)?.[1] || t('nav.workspace')
  return (
    <div className="workspace-shell">
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`dashboard-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <Link className="sidebar-brand" to={ROUTES.home} aria-label="ContentCraft home">
          <BrandMark />
        </Link>
        <button
          className="icon-button sidebar-close"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        >
          <X size={21} />
        </button>
        <nav aria-label="Workspace navigation">
          {navigation.map(([path, label, Icon], i) => (
            <NavLink
              key={path}
              to={path}
              end={path === ROUTES.dashboard}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${i === 6 ? 'sidebar-divider' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="workspace-plan" onClick={() => setPanel('plan')}>
          <span className="avatar avatar-sage">
            CC
            <span className="online-dot" />
          </span>
          <span>
            <strong>ContentCraft</strong>
            <small>Database Live</small>
          </span>
          <ChevronDown size={15} />
        </button>
      </aside>
      <div className="workspace-body">
        <header className="dashboard-header">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <span>Workspace</span>
            <span className="crumb-separator">/</span>
            <strong>{title}</strong>
          </div>
          <div className="header-actions">
            <button
              className="icon-button"
              title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              onClick={toggleLanguage}
              style={{ fontWeight: 700, fontSize: '0.85rem', width: 'auto', padding: '0 8px', borderRadius: '8px' }}
            >
              {language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
            </button>

            <button
              className="icon-button"
              title={theme === 'dark' ? t('header.theme.light') : t('header.theme.dark')}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="icon-button notification-button"
              aria-label="Open notifications"
              onClick={() => setPanel('notifications')}
            >
              <Bell size={18} />
            </button>
            <button
              className="profile-button"
              onClick={() => setPanel('profile')}
              aria-label="Open account menu"
            >
              <span className="avatar avatar-green">
                {session ? session.name.slice(0, 2).toUpperCase() : 'CC'}
              </span>
              <span>{session?.name || 'ContentCraft'}</span>
              <span className="status-dot" />
            </button>
          </div>
        </header>
        <main className="workspace-main" id="main-content">
          <Outlet />
        </main>
        <footer className="workspace-footer">
          <span>
            <span className="status-dot" /> ContentCraft demo · Browser storage
          </span>
          <Link to={ROUTES.resources}>
            Help & resources <ExternalLink size={11} />
          </Link>
          <span>v1.0.0</span>
        </footer>
      </div>
      <Modal
        open={panel === 'notifications'}
        title="Workspace activity"
        onClose={() => setPanel(null)}
      >
        <p className="muted">Recent demo content activity in this browser.</p>
        <div className="notification-list">
          {contents.slice(0, 5).map((item) => (
            <Link key={item.id} to={ROUTES.history} onClick={() => setPanel(null)}>
              <CheckCircle2 size={18} />
              <span>
                {item.title}
                <small>{item.status}</small>
              </span>
            </Link>
          ))}
        </div>
        {contents.length === 0 && <p>No content activity yet.</p>}
      </Modal>
      <Modal open={panel === 'profile'} title="Your demo workspace" onClose={() => setPanel(null)}>
        <div className="account-summary">
          <span className="avatar avatar-green">C1</span>
          <div>
            <h3>{session?.name || 'C1SE.95 Team'}</h3>
            <p>{session?.email || 'Exploring the demo workspace'}</p>
          </div>
          <Badge>Demo</Badge>
        </div>
        <p className="muted">
          Products, content, and team records are examples stored on this device. No live account or
          backend session is created.
        </p>
        <div className="modal-actions">
          <Button
            variant="secondary"
            onClick={() => {
              setPanel(null)
              navigate(ROUTES.settings)
            }}
          >
            <Sliders size={16} /> {t('nav.settings')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              signOut()
              setPanel(null)
              navigate(ROUTES.home)
            }}
          >
            <LogOut size={16} /> {t('header.logout')}
          </Button>
        </div>
      </Modal>
      <Modal open={panel === 'plan'} title="Demo plan" onClose={() => setPanel(null)}>
        <Badge>Frontend demonstration</Badge>
        <p className="muted">
          Explore the complete ContentCraft interface with sample data. Billing, subscriptions, and
          enterprise permissions require a backend and are not enabled in this demo.
        </p>
        <Button
          onClick={() => {
            setPanel(null)
            navigate(ROUTES.contentStudio)
          }}
        >
          <Sparkles size={17} /> Explore the content studio
        </Button>
      </Modal>
    </div>
  )
}
