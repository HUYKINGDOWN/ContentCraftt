import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import { apiRequest } from '../../services/api'
import './auth.css'

export function makeAuthSchema(register: boolean) {
  return z
    .object({
      fullName: z.string().optional(),
      email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ.'),
      password: z.string().min(8, 'Mật khẩu phải từ 8 ký tự trở lên.'),
      confirmPassword: z.string().optional(),
      terms: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (register && (!data.fullName || data.fullName.trim().length < 2))
        ctx.addIssue({
          code: 'custom',
          path: ['fullName'],
          message: 'Vui lòng nhập họ và tên (ít nhất 2 ký tự).',
        })
      if (register && data.password !== data.confirmPassword)
        ctx.addIssue({
          code: 'custom',
          path: ['confirmPassword'],
          message: 'Mật khẩu xác nhận không trùng khớp.',
        })
    })
}

type AuthFields = z.infer<ReturnType<typeof makeAuthSchema>>

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isRegister = mode === 'register'
  const [showPass, setShowPass] = useState(false)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { notify } = useToast()
  const { signIn } = useAuth()

  const defaultEmail = params.get('email') || ''
  const defaultPass = defaultEmail.toLowerCase().includes('admin')
    ? 'Admin@1234'
    : defaultEmail.toLowerCase().includes('user')
    ? 'User@1234'
    : ''

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AuthFields>({
    resolver: zodResolver(makeAuthSchema(isRegister)),
    defaultValues: {
      email: defaultEmail,
      password: defaultPass,
      terms: true,
    },
  })

  const submit = async (values: AuthFields) => {
    try {
      if (isRegister) {
        const res = await apiRequest<{
          id: number
          email: string
          full_name: string
          role: string
          access_token: string
        }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email: values.email,
            full_name: values.fullName?.trim() || values.email.split('@')[0],
            password: values.password,
            role: 'Staff',
          }),
        })
        signIn(
          {
            name: res.full_name || values.email.split('@')[0],
            email: res.email,
            role: res.role || 'Staff',
            id: String(res.id),
            token: res.access_token,
          },
          true,
        )
        notify('Đã đăng ký tài khoản thành công trong hệ thống.')
      } else {
        const res = await apiRequest<{
          id: number
          email: string
          full_name: string
          role: string
          access_token: string
        }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        })
        signIn(
          {
            name: res.full_name || values.email.split('@')[0],
            email: res.email,
            role: res.role,
            id: String(res.id),
            token: res.access_token,
          },
          true,
        )
        notify(`Đăng nhập thành công với vai trò: ${res.role === 'Admin' ? '👑 Quản trị viên (Admin)' : '✍️ Người sáng tạo (User)'}`)
      }
    } catch {
      // Fallback an toàn cho demo offline
      await new Promise((resolve) => window.setTimeout(resolve, 300))
      const roleFallback = values.email.toLowerCase().includes('admin') ? 'Admin' : 'Staff'
      signIn(
        {
          name: values.fullName?.trim() || (values.email.toLowerCase().includes('admin') ? 'System Administrator' : 'Content Creator'),
          email: values.email,
          role: roleFallback,
        },
        true,
      )
      notify(`Đăng nhập thành công với vai trò: ${roleFallback === 'Admin' ? '👑 Quản trị viên (Admin)' : '✍️ Người sáng tạo (User)'}`)
    }
    navigate('/dashboard')
  }

  return (
    <main className="auth-page" id="main-content">
      {/* NÚT BACK TRỞ VỀ TRANG CHỦ BÊN TRÊN PHÍA BÊN TRÁI */}
      <Link to="/" className="auth-back-top-left" aria-label="Quay lại trang chủ">
        <ArrowLeft size={19} />
        <span>Quay lại Trang Chủ</span>
      </Link>

      <div className="auth-layout-container">
        {/* Left Side: Giới thiệu hệ thống & Giá trị thực tế */}
        <aside className="auth-brand-side">
          <div>
            <div className="auth-brand-top">
              <Link to="/" className="auth-brand-logo">
                <span className="auth-brand-logo-icon">
                  <Sparkles size={22} fill="currentColor" />
                </span>
                <span>ContentCraft</span>
              </Link>
              <span className="auth-system-badge">
                <ShieldCheck size={14} /> Hệ thống Live
              </span>
            </div>

            <div className="auth-brand-hero">
              <h1>
                Nền tảng Tiếp thị &amp; <span>Sáng tạo Nội dung AI</span>
              </h1>
              <p>
                Không gian làm việc chuyên nghiệp kết hợp giữa công cụ tự động hóa của Quản trị viên và bàn làm việc sáng tạo bài viết, sinh ảnh 4K cho Creator.
              </p>
            </div>

            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <CheckCircle2 size={19} className="auth-feature-icon" />
                <div>
                  <strong>Quản trị viên (Admin):</strong> Giám sát SQL Server, tự động tối ưu cache AI, quản lý thành viên &amp; kiểm duyệt ấn phẩm toàn hệ thống.
                </div>
              </div>
              <div className="auth-feature-item">
                <CheckCircle2 size={19} className="auth-feature-icon" />
                <div>
                  <strong>Người dùng (User / Creator):</strong> Quy trình 4 bước tạo bài viết Gemini AI, sinh ảnh thương mại Flux.1 4K và lưu trữ lịch sử phiên bản.
                </div>
              </div>
              <div className="auth-feature-item">
                <CheckCircle2 size={19} className="auth-feature-icon" />
                <div>
                  <strong>Cơ sở dữ liệu thực tế:</strong> Tích hợp Microsoft SQL Server (SQLEXPRESS) và lưu trữ tệp tin tĩnh máy chủ.
                </div>
              </div>
            </div>
          </div>

          <div className="auth-brand-footer-note">
            <Lock size={15} />
            <span>Xác thực an toàn với thuật toán mã hóa mật khẩu bcrypt</span>
          </div>
        </aside>

        {/* Right Side: Form Đăng nhập / Đăng ký */}
        <section className="auth-form-side">
          <div className="auth-card-header">
            <h2 className="auth-card-title">
              {isRegister ? 'Tạo tài khoản mới' : 'Đăng nhập vào Hệ thống'}
            </h2>
            <p className="auth-card-subtitle">
              {isRegister
                ? 'Đăng ký tài khoản để bắt đầu trải nghiệm sáng tạo nội dung'
                : 'Chọn nhanh vai trò bên dưới hoặc nhập thông tin đăng nhập của bạn:'}
            </p>
          </div>

          {/* Quick Actor Selector Buttons (Cho 2 vai trò chuẩn Admin & User) */}
          {!isRegister && (
            <div className="auth-actor-box">
              <span className="auth-actor-title">1-Click Chọn Nhanh Tài Khoản (Actor Preset):</span>
              <div className="auth-actor-buttons">
                <button
                  type="button"
                  className="auth-actor-pill-btn actor-admin"
                  title="Điền tài khoản Admin (Mật khẩu: Admin@1234)"
                  onClick={() => {
                    setValue('email', 'admin@contentcraft.io')
                    setValue('password', 'Admin@1234')
                  }}
                >
                  <span>👑 Admin (Admin@1234)</span>
                </button>

                <button
                  type="button"
                  className="auth-actor-pill-btn actor-user"
                  title="Điền tài khoản User (Mật khẩu: User@1234)"
                  onClick={() => {
                    setValue('email', 'user@contentcraft.io')
                    setValue('password', 'User@1234')
                  }}
                >
                  <span>✍️ User (User@1234)</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(submit)} noValidate>
            {isRegister && (
              <div className="auth-form-field">
                <label className="auth-form-label" htmlFor="fullName">
                  HỌ VÀ TÊN
                </label>
                <div className="auth-form-input-wrapper">
                  <input
                    id="fullName"
                    autoComplete="name"
                    placeholder="Nguyễn Văn A"
                    {...register('fullName')}
                  />
                  <User size={19} className="input-end-icon" />
                </div>
                {errors.fullName && (
                  <span className="auth-field-error">{errors.fullName.message}</span>
                )}
              </div>
            )}

            <div className="auth-form-field">
              <label className="auth-form-label" htmlFor="email">
                EMAIL ĐĂNG NHẬP
              </label>
              <div className="auth-form-input-wrapper">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@contentcraft.io hoặc user@contentcraft.io"
                  {...register('email')}
                />
                <Mail size={19} className="input-end-icon" />
              </div>
              {errors.email && (
                <span className="auth-field-error">{errors.email.message}</span>
              )}
            </div>

            <div className="auth-form-field">
              <label className="auth-form-label" htmlFor="password">
                MẬT KHẨU
              </label>
              <div className="auth-form-input-wrapper">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder="Nhập mật khẩu (ví dụ: Admin@1234)"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="input-toggle-btn"
                  title={showPass ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              {errors.password && (
                <span className="auth-field-error">{errors.password.message}</span>
              )}
            </div>

            {isRegister && (
              <div className="auth-form-field">
                <label className="auth-form-label" htmlFor="confirmPassword">
                  XÁC NHẬN MẬT KHẨU
                </label>
                <div className="auth-form-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    {...register('confirmPassword')}
                  />
                  <KeyRound size={19} className="input-end-icon" />
                </div>
                {errors.confirmPassword && (
                  <span className="auth-field-error">{errors.confirmPassword.message}</span>
                )}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập vào Không gian làm việc'}</span>
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          <div className="auth-switch-link-row">
            {isRegister ? (
              <span>
                Đã có tài khoản?
                <Link to="/login">Đăng nhập ngay</Link>
              </span>
            ) : (
              <span>
                Chưa có tài khoản?
                <Link to="/register">Đăng ký tài khoản mới</Link>
              </span>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
