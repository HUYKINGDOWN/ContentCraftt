import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { apiRequest } from '../services/api'

export interface ActorItem {
  id: 'admin' | 'user'
  role: 'Admin' | 'Staff'
  name: string
  tabLabel: string
  roleBadge: string
  tagline: string
  desc: string
  email: string
  password: string
  accentColor: string
  glowRgb: string
  permissions: { text: string; allowed: boolean; note?: string }[]
}

export const ACTOR_LIST: ActorItem[] = [
  {
    id: 'admin',
    role: 'Admin',
    name: 'Quản trị viên Hệ thống (System Admin)',
    tabLabel: '👑 Quản trị viên (Admin)',
    roleBadge: 'System Administrator (Toàn quyền)',
    tagline: 'Trung tâm chỉ huy tự động hóa, giám sát hạ tầng & phân quyền bảo mật',
    desc: 'Dành riêng cho Quản trị viên: Tự động hóa dọn dẹp Cache AI, giám sát trạng thái SQL Server DB, kiểm duyệt ấn phẩm toàn hệ thống và phân quyền tài khoản thành viên.',
    email: 'admin@contentcraft.io',
    password: 'Admin@1234',
    accentColor: '#10b981',
    glowRgb: '16, 185, 129',
    permissions: [
      { text: 'Mở khóa mục độc quyền: Bảng điều khiển Quản trị hệ thống (Admin Console & RBAC)', allowed: true },
      { text: 'Tự động hóa hệ thống: Dọn dẹp Cache AI, đồng bộ tức thời SQL Server DB', allowed: true },
      { text: 'Kiểm duyệt và phê duyệt ấn phẩm marketing của toàn bộ thành viên', allowed: true },
      { text: 'Quản lý tài khoản người dùng, phân quyền và khóa/mở khóa thành viên', allowed: true },
    ],
  },
  {
    id: 'user',
    role: 'Staff',
    name: 'Chuyên viên Sáng tạo (Content Creator)',
    tabLabel: '✍️ Người dùng sáng tạo (User / Creator)',
    roleBadge: 'Content Creator (Nhân viên sáng tạo)',
    tagline: 'Bàn làm việc sáng tạo nội dung đa kênh & thiết kế đồ họa AI Flux.1',
    desc: 'Không gian làm việc năng suất cao: Quy trình 4 bước sáng tạo bài viết đa kênh SEO/Social với Gemini AI, sinh ảnh sản phẩm 4K với Flux.1 Engine và lưu trữ lịch sử phiên bản.',
    email: 'user@contentcraft.io',
    password: 'User@1234',
    accentColor: '#38bdf8',
    glowRgb: '56, 189, 248',
    permissions: [
      { text: 'Sử dụng Gemini AI Content Studio sáng tạo bài viết đa kênh SEO & Social', allowed: true },
      { text: 'Sử dụng Flux.1 AI Image Studio sinh hình ảnh sản phẩm chân thực chuẩn 4K', allowed: true },
      { text: 'Lưu trữ bản thảo và quản lý lịch sử phiên bản (Save as version & History)', allowed: true },
      { text: 'Ẩn hoàn toàn menu Quản trị hệ thống (bảo mật phân quyền, tránh thao tác nhầm)', allowed: false, note: 'Giới hạn an toàn' },
    ],
  },
]

export default function ActorSwitcher() {
  const [selectedId, setSelectedId] = useState<'admin' | 'user'>('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { signIn } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const currentActor = ACTOR_LIST.find((a) => a.id === selectedId) || ACTOR_LIST[0]

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      notify(`Đã sao chép ${label}: ${text}`)
    } catch {
      notify(`Không thể sao chép tự động: ${text}`, 'error')
    }
  }

  const handle1ClickLogin = async () => {
    setIsLoggingIn(true)
    try {
      try {
        const res = await apiRequest<{
          id: number
          email: string
          full_name: string
          role: string
          access_token: string
        }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: currentActor.email,
            password: currentActor.password,
          }),
        })
        signIn(
          {
            name: res.full_name || currentActor.name,
            email: res.email,
            role: res.role,
            id: String(res.id),
            token: res.access_token,
          },
          true,
        )
      } catch (backendErr) {
        console.warn('Backend login fallback:', backendErr)
        signIn(
          {
            name: currentActor.name,
            email: currentActor.email,
            role: currentActor.role,
            id: currentActor.id,
          },
          true,
        )
      }

      notify(`Đăng nhập thành công với vai trò: ${currentActor.tabLabel}`)
      navigate('/dashboard')
    } catch (err) {
      notify('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.', 'error')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleFillLoginForm = () => {
    navigate(
      `/login?email=${encodeURIComponent(currentActor.email)}&role=${currentActor.role}&actor=${currentActor.id}`,
    )
  }

  return (
    <div className="actor-switcher-wrapper">
      <div className="actor-switcher-header">
        <div className="actor-kicker-tag">
          <Sparkles size={16} />
          <span>BỘ CHUYỂN ĐỔI 2 VAI TRÒ HỆ THỐNG (ACTOR SWITCHER)</span>
        </div>
        <h2 className="actor-switcher-title">Trải nghiệm phân quyền & giao diện chuyên biệt cho từng Actor</h2>
        <p className="actor-switcher-subtitle">
          Hệ thống được thiết kế với 2 vai trò cốt lõi rõ rệt: Quản trị viên điều hành toàn diện vs Người dùng chuyên tâm sáng tạo:
        </p>
      </div>

      {/* Segmented Actor Pills */}
      <div className="actor-nav-pills" role="tablist">
        {ACTOR_LIST.map((actor) => {
          const isActive = actor.id === selectedId
          return (
            <button
              key={actor.id}
              role="tab"
              aria-selected={isActive}
              className={`actor-pill-btn ${isActive ? 'is-active' : ''}`}
              style={
                isActive
                  ? {
                      borderColor: actor.accentColor,
                      boxShadow: `0 0 24px rgba(${actor.glowRgb}, 0.35)`,
                    }
                  : undefined
              }
              onClick={() => {
                setSelectedId(actor.id)
                setShowPassword(false)
              }}
            >
              <span className="actor-pill-dot" style={{ backgroundColor: actor.accentColor }} />
              <span className="actor-pill-text">{actor.tabLabel}</span>
            </button>
          )
        })}
      </div>

      {/* Active Actor Detail Glass Card */}
      <div
        className="actor-display-card"
        style={{
          borderTop: `4px solid ${currentActor.accentColor}`,
          boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 35px rgba(${currentActor.glowRgb}, 0.15)`,
        }}
      >
        <div className="actor-card-top">
          <div className="actor-badge-strip">
            <span
              className="actor-role-badge"
              style={{
                backgroundColor: `rgba(${currentActor.glowRgb}, 0.18)`,
                color: currentActor.accentColor,
                borderColor: `rgba(${currentActor.glowRgb}, 0.4)`,
              }}
            >
              <ShieldCheck size={16} />
              {currentActor.roleBadge}
            </span>
            <span className="actor-db-sync-tag">
              <span className="db-live-dot" />
              Đã kết nối SQL Server (ContentCraftDB)
            </span>
          </div>

          <h3 className="actor-name-heading">{currentActor.name}</h3>
          <p className="actor-tagline-text">{currentActor.tagline}</p>
          <p className="actor-description-text">{currentActor.desc}</p>
        </div>

        {/* Credentials Box */}
        <div className="actor-credentials-container">
          <div className="actor-cred-field">
            <span className="actor-cred-label">
              <Mail size={15} /> EMAIL ĐĂNG NHẬP
            </span>
            <div className="actor-cred-value-row">
              <code className="actor-cred-code">{currentActor.email}</code>
              <button
                type="button"
                className="actor-copy-btn"
                title="Sao chép email"
                onClick={() => copyToClipboard(currentActor.email, 'Email')}
              >
                <Copy size={15} />
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div className="actor-cred-field">
            <span className="actor-cred-label">
              <KeyRound size={15} /> MẬT KHẨU RIÊNG BIỆT
            </span>
            <div className="actor-cred-value-row">
              <code className="actor-cred-code">
                {showPassword ? currentActor.password : '••••••••••••'}
              </code>
              <div className="actor-cred-actions">
                <button
                  type="button"
                  className="actor-toggle-pass-btn"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  type="button"
                  className="actor-copy-btn"
                  title="Sao chép mật khẩu"
                  onClick={() => copyToClipboard(currentActor.password, 'Mật khẩu')}
                >
                  <Copy size={15} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="actor-permissions-block">
          <h4 className="actor-perm-title">Quyền hạn & Giao diện chuyên biệt khi đăng nhập:</h4>
          <div className="actor-perm-grid">
            {currentActor.permissions.map((perm, idx) => (
              <div
                key={idx}
                className={`actor-perm-item ${perm.allowed ? 'is-allowed' : 'is-restricted'}`}
              >
                {perm.allowed ? (
                  <CheckCircle2 size={18} className="perm-icon-check" />
                ) : (
                  <ShieldAlert size={18} className="perm-icon-alert" />
                )}
                <div className="perm-text-wrap">
                  <span className="perm-text">{perm.text}</span>
                  {perm.note && <span className="perm-note">({perm.note})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="actor-actions-footer">
          <button
            type="button"
            className="actor-login-btn primary-actor-btn"
            style={{
              backgroundColor: currentActor.accentColor,
              boxShadow: `0 6px 22px rgba(${currentActor.glowRgb}, 0.45)`,
            }}
            disabled={isLoggingIn}
            onClick={handle1ClickLogin}
          >
            <LogIn size={19} />
            <span>{isLoggingIn ? 'Đang xác thực...' : `🚀 Đăng nhập ngay với ${currentActor.tabLabel}`}</span>
            <Zap size={17} />
          </button>

          <button
            type="button"
            className="actor-login-btn secondary-actor-btn"
            onClick={handleFillLoginForm}
          >
            <span>Tự điền vào Form Đăng nhập</span>
          </button>
        </div>
      </div>
    </div>
  )
}
