import React, { useState, useEffect } from 'react'
import {
  Globe,
  Moon,
  Sun,
  Sparkles,
  Share2,
  Database,
  User,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Download,
  ShieldCheck,
  Zap,
  Sliders,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { Badge, Button, Input, Modal } from '../../components/ui'
import { useTheme } from '../../contexts/ThemeContext'
import { useI18n, type Language } from '../../contexts/I18nContext'
import { useAuth } from '../../contexts/AuthContext'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useToast } from '../../contexts/ToastContext'
import { apiRequest } from '../../services/api'
import { publishingService } from '../../services/publishing'

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const { session, signOut } = useAuth()
  const { brands, products, audiences, contents } = useWorkspace()
  const { notify } = useToast()

  const [activeTab, setActiveTab] = useState<'interface' | 'ai' | 'publishing' | 'data' | 'account'>('interface')
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai'>('gemini')
  const [aiModel, setAiModel] = useState('gemini-3.5-flash')
  const [testingAi, setTestingAi] = useState(false)
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'offline'>('checking')
  const [dbStatus, setDbStatus] = useState<'connected' | 'checking' | 'error'>('checking')
  const [confirmReset, setConfirmReset] = useState(false)

  // Kiểm tra kết nối backend
  useEffect(() => {
    async function checkBackend() {
      try {
        await apiRequest('/health')
        setDbStatus('connected')
        setAiStatus('connected')
      } catch {
        setDbStatus('error')
        setAiStatus('offline')
      }
    }
    checkBackend()
  }, [])

  const handleTestAi = async () => {
    setTestingAi(true)
    try {
      const res = await apiRequest<{ title: string; body: string }>('/ai/text', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Kiểm tra kết nối hệ thống AI ContentCraft',
          platform: 'Facebook',
          tone: 'friendly',
          audience: 'general',
        }),
      })
      if (res && res.body) {
        setAiStatus('connected')
        notify(language === 'vi' ? 'Kết nối AI Engine thành công!' : 'AI Engine connected successfully!', 'success')
      } else {
        throw new Error('No body')
      }
    } catch {
      setAiStatus('offline')
      notify(
        language === 'vi'
          ? 'Không thể kết nối trực tiếp đến backend AI, đang dùng demo mode fallback.'
          : 'Could not connect directly to backend AI, running in demo fallback mode.',
        'error',
      )
    } finally {
      setTestingAi(false)
    }
  }

  const handleExportData = () => {
    const data = {
      brands,
      products,
      audiences,
      contents,
      exportedAt: new Date().toISOString(),
      version: '2.4.0',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contentcraft-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    notify(language === 'vi' ? 'Đã xuất dữ liệu workspace thành công.' : 'Workspace data exported successfully.', 'success')
  }

  const handleResetData = () => {
    localStorage.removeItem('contentcraft-workspace-v1')
    sessionStorage.clear()
    setConfirmReset(false)
    notify(language === 'vi' ? 'Đã đặt lại dữ liệu mẫu. Đang tải lại...' : 'Demo data reset. Reloading...', 'success')
    setTimeout(() => {
      window.location.reload()
    }, 600)
  }

  return (
    <div className="entity-page studio-page" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Page Heading */}
      <div className="studio-heading" style={{ marginBottom: '25px' }}>
        <div>
          <span className="studio-eyebrow">
            <Sliders size={13} />
            {t('nav.settings')}
          </span>
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.desc')}</p>
        </div>
        <div className="studio-heading-actions">
          <Badge tone={dbStatus === 'connected' ? 'green' : 'amber'}>
            {dbStatus === 'connected' ? (language === 'vi' ? 'Backend Live' : 'Backend Live') : 'Demo Mode'}
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '12px',
          marginBottom: '28px',
          overflowX: 'auto',
        }}
      >
        {[
          { key: 'interface', label: t('settings.tab.interface'), icon: Globe },
          { key: 'ai', label: t('settings.tab.ai'), icon: Sparkles },
          { key: 'publishing', label: t('settings.tab.publishing'), icon: Share2 },
          { key: 'data', label: t('settings.tab.data'), icon: Database },
          { key: 'account', label: t('settings.tab.account'), icon: User },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '12px',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                background: isActive ? 'var(--card)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--muted)',
                border: isActive ? '1px solid var(--line)' : '1px solid transparent',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* TAB 1: Giao diện & Ngôn ngữ */}
      {activeTab === 'interface' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card Ngôn ngữ */}
          <section className="studio-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                  {t('settings.lang.title')}
                </h2>
                <p className="studio-muted" style={{ fontSize: '13px' }}>
                  {t('settings.lang.desc')}
                </p>
              </div>
              <Badge tone="green">{language.toUpperCase()}</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div
                onClick={() => setLanguage('vi')}
                style={{
                  border: language === 'vi' ? '2px solid var(--primary)' : '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  background: language === 'vi' ? 'rgba(166, 230, 151, 0.08)' : 'var(--card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>🇻🇳</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Tiếng Việt</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Toàn bộ giao diện tiếng Việt</span>
                  </div>
                </div>
                {language === 'vi' && <Check size={20} color="#317638" />}
              </div>

              <div
                onClick={() => setLanguage('en')}
                style={{
                  border: language === 'en' ? '2px solid var(--primary)' : '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  background: language === 'en' ? 'rgba(166, 230, 151, 0.08)' : 'var(--card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px' }}>🇬🇧</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>English</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Complete English interface</span>
                  </div>
                </div>
                {language === 'en' && <Check size={20} color="#317638" />}
              </div>
            </div>
          </section>

          {/* Card Chế độ Sáng / Tối */}
          <section className="studio-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                  {t('settings.theme.title')}
                </h2>
                <p className="studio-muted" style={{ fontSize: '13px' }}>
                  {t('settings.theme.desc')}
                </p>
              </div>
              <Badge tone={theme === 'dark' ? 'blue' : 'amber'}>
                {theme === 'dark' ? t('header.theme.dark') : t('header.theme.light')}
              </Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {/* Light Mode Card */}
              <div
                onClick={() => setTheme('light')}
                style={{
                  border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  background: '#fbfcfa',
                  color: '#23322f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#fff',
                      border: '1px solid #e2e7e3',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#eab308',
                    }}
                  >
                    <Sun size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#23322f' }}>
                      {t('settings.theme.light')}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#71807a' }}>Màu sắc tươi sáng, dễ nhìn</span>
                  </div>
                </div>
                {theme === 'light' && <Check size={20} color="#317638" />}
              </div>

              {/* Dark Mode Card */}
              <div
                onClick={() => setTheme('dark')}
                style={{
                  border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  background: '#0d1514',
                  color: '#e6edf3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#15221e',
                      border: '1px solid #1e2e29',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#a6e697',
                    }}
                  >
                    <Moon size={20} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#f0fdf4' }}>
                      {t('settings.theme.dark')}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Dịu mắt ban đêm, tiết kiệm năng lượng</span>
                  </div>
                </div>
                {theme === 'dark' && <Check size={20} color="#a6e697" />}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: Cấu hình AI Engine */}
      {activeTab === 'ai' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="studio-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                  {t('settings.tab.ai')}
                </h2>
                <p className="studio-muted" style={{ fontSize: '13px' }}>
                  {language === 'vi'
                    ? 'Quản lý mô hình trí tuệ nhân tạo sinh nội dung văn bản và hình ảnh đa kênh.'
                    : 'Configure multimodal AI models for generating content and visuals.'}
                </p>
              </div>
              <Badge tone={aiStatus === 'connected' ? 'green' : 'amber'}>
                {aiStatus === 'connected'
                  ? (language === 'vi' ? 'AI Sẵn sàng' : 'AI Operational')
                  : (language === 'vi' ? 'Demo Fallback' : 'Demo Fallback')}
              </Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '22px' }}>
              <div>
                <label className="cc-label" style={{ display: 'block', marginBottom: '8px' }}>
                  {t('settings.ai.provider')}
                </label>
                <select
                  className="cc-input cc-select"
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value as any)}
                  style={{ width: '100%' }}
                >
                  <option value="gemini">Google Gemini (Recommended)</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                </select>
              </div>

              <div>
                <label className="cc-label" style={{ display: 'block', marginBottom: '8px' }}>
                  {t('settings.ai.model')}
                </label>
                <select
                  className="cc-input cc-select"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {aiProvider === 'gemini' ? (
                    <>
                      <option value="gemini-3.5-flash">gemini-3.5-flash (Fast & Creative)</option>
                      <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Cost-effective)</option>
                      <option value="gemini-3.8-flash">gemini-3.8-flash (High Reasoning)</option>
                    </>
                  ) : (
                    <>
                      <option value="gpt-4o-mini">gpt-4o-mini (Optimized)</option>
                      <option value="gpt-4o">gpt-4o (Omni multimodal)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                {language === 'vi'
                  ? 'API Keys được nạp tự động an toàn từ file môi trường (.env).'
                  : 'API Keys are securely loaded from server environment (.env).'}
              </span>
              <Button onClick={handleTestAi} disabled={testingAi}>
                <Zap size={16} />
                {testingAi
                  ? (language === 'vi' ? 'Đang kiểm tra...' : 'Testing connection...')
                  : (language === 'vi' ? 'Kiểm tra kết nối AI' : 'Test AI Connection')}
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: Kênh Mạng Xã hội */}
      {activeTab === 'publishing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="studio-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
              {t('settings.tab.publishing')}
            </h2>
            <p className="studio-muted" style={{ fontSize: '13px', marginBottom: '20px' }}>
              {language === 'vi'
                ? 'Trạng thái tích hợp các nền tảng mạng xã hội và kênh phân phối nội dung.'
                : 'Connected digital marketing platforms and social publishing gateways.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Facebook', type: 'Meta Business Suite', status: 'Active (Direct / Portal)', url: publishingService.getPlatformUrl('Facebook') },
                { name: 'Instagram', type: 'Meta Creator Hub', status: 'Active (Direct / Portal)', url: publishingService.getPlatformUrl('Instagram') },
                { name: 'TikTok', type: 'TikTok Creator Studio', status: 'Active (Portal Handoff)', url: publishingService.getPlatformUrl('TikTok') },
                { name: 'LinkedIn', type: 'Company Pages & Feed', status: 'Active (Portal Handoff)', url: publishingService.getPlatformUrl('LinkedIn') },
                { name: 'X (Twitter)', type: 'Twitter Post Composer', status: 'Active (Direct / Portal)', url: publishingService.getPlatformUrl('Twitter') },
              ].map((channel) => (
                <div
                  key={channel.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1px solid var(--line)',
                    background: 'var(--card)',
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>{channel.name}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{channel.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Badge tone="green">{channel.status}</Badge>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noreferrer"
                      className="icon-button"
                      title={`Open ${channel.name} Creator Portal`}
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: Quản lý Dữ liệu */}
      {activeTab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="studio-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
              {t('settings.data.title')}
            </h2>
            <p className="studio-muted" style={{ fontSize: '13px', marginBottom: '22px' }}>
              {t('settings.data.desc')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--card)' }}>
                <span className="studio-muted" style={{ fontSize: '12px' }}>{t('nav.brands')}</span>
                <h3 style={{ fontSize: '24px', margin: '6px 0 0', color: 'var(--ink)' }}>{brands.length}</h3>
              </div>
              <div style={{ padding: '16px', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--card)' }}>
                <span className="studio-muted" style={{ fontSize: '12px' }}>{t('nav.products')}</span>
                <h3 style={{ fontSize: '24px', margin: '6px 0 0', color: 'var(--ink)' }}>{products.length}</h3>
              </div>
              <div style={{ padding: '16px', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--card)' }}>
                <span className="studio-muted" style={{ fontSize: '12px' }}>{t('nav.audiences')}</span>
                <h3 style={{ fontSize: '24px', margin: '6px 0 0', color: 'var(--ink)' }}>{audiences.length}</h3>
              </div>
              <div style={{ padding: '16px', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--card)' }}>
                <span className="studio-muted" style={{ fontSize: '12px' }}>{t('nav.history')}</span>
                <h3 style={{ fontSize: '24px', margin: '6px 0 0', color: 'var(--ink)' }}>{contents.length}</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '18px' }}>
              <Button variant="secondary" onClick={handleExportData}>
                <Download size={16} />
                {language === 'vi' ? 'Sao lưu dữ liệu JSON' : 'Export JSON Backup'}
              </Button>
              <Button
                variant="danger"
                onClick={() => setConfirmReset(true)}
              >
                <Trash2 size={16} />
                {t('btn.resetDemo')}
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* TAB 5: Tài khoản & Phiên */}
      {activeTab === 'account' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section className="studio-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
              {t('settings.tab.account')}
            </h2>
            <p className="studio-muted" style={{ fontSize: '13px', marginBottom: '22px' }}>
              {language === 'vi'
                ? 'Thông tin người dùng đang hoạt động trong phiên làm việc hiện tại.'
                : 'Active user credentials and current session permissions.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span className="avatar avatar-green" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                {session ? session.name.slice(0, 2).toUpperCase() : 'CC'}
              </span>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: 'var(--ink)' }}>
                  {session?.name || 'ContentCraft Creator'}
                </h3>
                <p className="studio-muted" style={{ margin: 0, fontSize: '13px' }}>
                  {session?.email || 'creator@contentcraft.demo'}
                </p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Badge tone="green">
                  {language === 'vi' ? 'Quyền Quản trị viên' : 'Administrator'}
                </Badge>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="ghost"
                onClick={() => {
                  signOut()
                  notify(language === 'vi' ? 'Đã đăng xuất khỏi workspace.' : 'Signed out from workspace.')
                  window.location.assign('/')
                }}
              >
                <Trash2 size={16} />
                {t('header.logout')}
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* Modal Xác nhận Reset */}
      <Modal open={confirmReset} title={t('btn.resetDemo')} onClose={() => setConfirmReset(false)}>
        <p className="muted">
          {language === 'vi'
            ? 'Bạn có chắc chắn muốn xóa toàn bộ bản nháp và đặt lại kho dữ liệu về trạng thái mẫu ban đầu không?'
            : 'Are you sure you want to restore default seed data and clear custom browser changes?'}
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setConfirmReset(false)}>
            {t('btn.cancel')}
          </Button>
          <Button variant="danger" onClick={handleResetData}>
            {t('btn.resetDemo')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
export default SettingsPage
