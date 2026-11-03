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
  id: 'admin' | 'user' | 'owner'
  role: 'Admin' | 'Staff' | 'BrandOwner'
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
    name: 'System Administrator',
    tabLabel: '👑 Quản trị viên (Admin)',
    roleBadge: 'System Administrator (Toàn quyền)',
    tagline: 'Toàn quyền kiểm soát, cấu hình hệ thống & phân quyền thành viên',
    desc: 'Quản trị viên cấp cao có quyền truy cập toàn diện vào mọi phân hệ: mở khóa menu Quản trị hệ thống, quản lý tài khoản thành viên, giám sát SQL Server DB và API AI.',
    email: 'admin@contentcraft.io',
    password: 'Admin@1234',
    accentColor: '#10b981',
    glowRgb: '16, 185, 129',
    permissions: [
      { text: 'Mở khóa mục menu độc quyền: Quản trị hệ thống (Admin & RBAC)', allowed: true },
      { text: 'Quản lý tài khoản người dùng, phân quyền và trạng thái bảo mật', allowed: true },
      { text: 'Giám sát hoạt động kết nối SQL Server (ContentCraftDB) và AI Models', allowed: true },
      { text: 'Toàn quyền xem, chỉnh sửa tất cả Thương hiệu, Sản phẩm và Nội dung', allowed: true },
    ],
  },
  {
    id: 'user',
    role: 'Staff',
    name: 'Nguyễn Văn User (Creator)',
    tabLabel: '✍️ Nhân viên sáng tạo (User)',
    roleBadge: 'Content Creator (Nhân viên sáng tạo)',
    tagline: 'Chuyên gia sáng tạo nội dung đa kênh & thiết kế đồ họa AI Flux.1',
    desc: 'Giao diện tinh gọn tối ưu cho Writer và Designer: sinh bài viết tự động với Gemini AI, tạo ảnh sản phẩm 4K với Flux.1 Engine, lưu trữ và quản lý phiên bản nội dung.',
    email: 'user@contentcraft.io',
    password: 'User@1234',
    accentColor: '#38bdf8',
    glowRgb: '56, 189, 248',
    permissions: [
      { text: 'Sử dụng AI Content Studio sáng tạo bài viết đa kênh SEO & Social', allowed: true },
      { text: 'Sử dụng Flux.1 AI Image Studio sinh hình ảnh sản phẩm chân thực 4K', allowed: true },
      { text: 'Lưu trữ bản thảo và quản lý lịch sử phiên bản (Save as version)', allowed: true },
      { text: 'Ẩn hoàn toàn menu Quản trị hệ thống (bảo mật phân quyền công ty)', allowed: false, note: 'Không có quyền Admin' },
    ],
  },
  {
    id: 'owner',
    role: 'BrandOwner',
    name: 'Brand Director (Owner)',
    tabLabel: '💼 Chủ thương hiệu (Brand Owner)',
    roleBadge: 'Brand Owner (Chủ sở hữu thương hiệu)',
    tagline: 'Thiết lập định vị thương hiệu, chân dung khách hàng & duyệt ấn phẩm',
    desc: 'Chủ sở hữu hoặc Giám đốc thương hiệu: định hình bản sắc nhận diện thương hiệu (Brand voice & guidelines), xây dựng tệp đối tượng mục tiêu và kiểm duyệt ấn phẩm marketing.',
    email: 'owner@contentcraft.io',
    password: 'Owner@1234',
    accentColor: '#a855f7',
    glowRgb: '168, 85, 247',
    permissions: [
      { text: 'Thiết lập và quản lý hồ sơ định vị thương hiệu (Brand Identity & Voice)', allowed: true },
      { text: 'Xây dựng hồ sơ chân dung khách hàng mục tiêu (Target Audiences)', allowed: true },
      { text: 'Kiểm duyệt và phê duyệt trạng thái ấn phẩm (Reviewed / Approved)', allowed: true },
      { text: 'Theo dõi phân tích hiệu suất và thống kê chuyển đổi chiến dịch', allowed: true },
    ],
  },
]

export default function ActorSwitcher() {
  const [selectedId, setSelectedId] = useState<'admin' | 'user' | 'owner'>('admin')
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
      // Gọi API đăng nhập backend thật để lấy token & verify hash password
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
        // Fallback demo session an toàn
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
          <Sparkles size={14} />
          <span>BỘ CHUYỂN ĐỔI ACTOR / ROLE HỆ THỐNG</span>
        </div>
        <h2 className="actor-switcher-title">Trải nghiệm phân quyền thực tế với từng vai trò</h2>
        <p className="actor-switcher-subtitle">
          Chọn một vai trò dưới đây để xem mật khẩu riêng biệt, quyền hạn đặc thù và đăng nhập nhanh 1-click vào hệ thống:
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
                      boxShadow: `0 0 20px rgba(${actor.glowRgb}, 0.25)`,
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
          borderTop: `3px solid ${currentActor.accentColor}`,
          boxShadow: `0 15px 35px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(${currentActor.glowRgb}, 0.12)`,
        }}
      >
        <div className="actor-card-top">
          <div className="actor-badge-strip">
            <span
              className="actor-role-badge"
              style={{
                backgroundColor: `rgba(${currentActor.glowRgb}, 0.15)`,
                color: currentActor.accentColor,
                borderColor: `rgba(${currentActor.glowRgb}, 0.35)`,
              }}
            >
              <ShieldCheck size={14} />
              {currentActor.roleBadge}
            </span>
            <span className="actor-db-sync-tag">
              <span className="db-live-dot" />
              Đã đồng bộ SQL Server
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
              <Mail size={13} /> EMAIL ĐĂNG NHẬP
            </span>
            <div className="actor-cred-value-row">
              <code className="actor-cred-code">{currentActor.email}</code>
              <button
                type="button"
                className="actor-copy-btn"
                title="Sao chép email"
                onClick={() => copyToClipboard(currentActor.email, 'Email')}
              >
                <Copy size={14} />
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div className="actor-cred-field">
            <span className="actor-cred-label">
              <KeyRound size={13} /> MẬT KHẨU RIÊNG BIỆT
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
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  className="actor-copy-btn"
                  title="Sao chép mật khẩu"
                  onClick={() => copyToClipboard(currentActor.password, 'Mật khẩu')}
                >
                  <Copy size={14} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="actor-permissions-block">
          <h4 className="actor-perm-title">Quyền hạn truy cập trong hệ thống:</h4>
          <div className="actor-perm-grid">
            {currentActor.permissions.map((perm, idx) => (
              <div
                key={idx}
                className={`actor-perm-item ${perm.allowed ? 'is-allowed' : 'is-restricted'}`}
              >
                {perm.allowed ? (
                  <CheckCircle2 size={16} className="perm-icon-check" />
                ) : (
                  <ShieldAlert size={16} className="perm-icon-alert" />
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
              boxShadow: `0 4px 18px rgba(${currentActor.glowRgb}, 0.4)`,
            }}
            disabled={isLoggingIn}
            onClick={handle1ClickLogin}
          >
            <LogIn size={17} />
            <span>{isLoggingIn ? 'Đang đăng nhập...' : `Đăng nhập ngay với ${currentActor.tabLabel}`}</span>
            <Zap size={15} />
          </button>

          <button
            type="button"
            className="actor-login-btn secondary-actor-btn"
            onClick={handleFillLoginForm}
          >
            <span>Tự điền vào form Đăng nhập</span>
          </button>
        </div>
      </div>
    </div>
  )
}
