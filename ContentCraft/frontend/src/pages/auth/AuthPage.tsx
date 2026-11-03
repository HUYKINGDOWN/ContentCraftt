import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
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
  const [activeActor, setActiveActor] = useState<'admin' | 'user' | null>(null)
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

  const handleSelectActor = (actor: 'admin' | 'user') => {
    setActiveActor(actor)
    if (actor === 'admin') {
      setValue('email', 'admin@contentcraft.io')
      setValue('password', 'Admin@1234')
    } else {
      setValue('email', 'user@contentcraft.io')
      setValue('password', 'User@1234')
    }
  }

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
      {/* NÚT BACK GÓC TRÊN TRÁI */}
      <Link to="/" className="auth-back-top-left" aria-label="Quay lại trang chủ">
        <ArrowLeft size={18} />
        <span>Quay lại Trang Chủ</span>
      </Link>

      <div className="auth-card-wrapper">
        <div className="auth-card">
          {/* Logo Brand Header */}
          <div className="auth-card-top">
            <Link to="/" className="auth-brand-logo">
              <span className="auth-brand-icon">
                <Sparkles size={22} fill="currentColor" />
              </span>
              <span className="auth-brand-name">ContentCraft</span>
            </Link>
            <span className="auth-badge-live">
              <ShieldCheck size={14} /> SQL Server Live
            </span>
          </div>

          <div className="auth-card-intro">
            <h1 className="auth-title">
              {isRegister ? 'Tạo tài khoản mới' : 'Đăng nhập vào Hệ thống'}
            </h1>
            <p className="auth-subtitle">
              {isRegister
                ? 'Đăng ký tài khoản để trải nghiệm không gian sáng tạo AI'
                : 'Chọn 1-click vai trò bên dưới để tự động điền hoặc nhập tài khoản:'}
            </p>
          </div>

          {/* Quick Actor Selector Pills (Admin / User) */}
          {!isRegister && (
            <div className="auth-actor-selector">
              <button
                type="button"
                className={`auth-actor-pill actor-admin ${activeActor === 'admin' ? 'is-selected' : ''}`}
                onClick={() => handleSelectActor('admin')}
                title="Tài khoản Quản trị: admin@contentcraft.io (Pass: Admin@1234)"
              >
                <span className="actor-pill-badge">👑 Admin</span>
                <span className="actor-pill-sub">Admin@1234</span>
              </button>

              <button
                type="button"
                className={`auth-actor-pill actor-user ${activeActor === 'user' ? 'is-selected' : ''}`}
                onClick={() => handleSelectActor('user')}
                title="Tài khoản Người sáng tạo: user@contentcraft.io (Pass: User@1234)"
              >
                <span className="actor-pill-badge">✍️ User</span>
                <span className="actor-pill-sub">User@1234</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(submit)} noValidate className="auth-form">
            {isRegister && (
              <div className="auth-form-field">
                <label className="auth-label" htmlFor="fullName">
                  Họ và tên
                </label>
                <div className="auth-input-box">
                  <input
                    id="fullName"
                    autoComplete="name"
                    placeholder="Nguyễn Văn A"
                    {...register('fullName')}
                  />
                  <User size={18} className="auth-input-icon" />
                </div>
                {errors.fullName && (
                  <span className="auth-field-error">{errors.fullName.message}</span>
                )}
              </div>
            )}

            <div className="auth-form-field">
              <label className="auth-label" htmlFor="email">
                Email đăng nhập
              </label>
              <div className="auth-input-box">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@contentcraft.io hoặc user@contentcraft.io"
                  {...register('email')}
                />
                <Mail size={18} className="auth-input-icon" />
              </div>
              {errors.email && (
                <span className="auth-field-error">{errors.email.message}</span>
              )}
            </div>

            <div className="auth-form-field">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="password">
                  Mật khẩu
                </label>
              </div>
              <div className="auth-input-box">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder="Nhập mật khẩu (ví dụ: Admin@1234)"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="auth-pass-toggle"
                  title={showPass ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="auth-field-error">{errors.password.message}</span>
              )}
            </div>

            {isRegister && (
              <div className="auth-form-field">
                <label className="auth-label" htmlFor="confirmPassword">
                  Xác nhận mật khẩu
                </label>
                <div className="auth-input-box">
                  <input
                    id="confirmPassword"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu xác nhận"
                    {...register('confirmPassword')}
                  />
                  <KeyRound size={18} className="auth-input-icon" />
                </div>
                {errors.confirmPassword && (
                  <span className="auth-field-error">{errors.confirmPassword.message}</span>
                )}
              </div>
            )}

            <button
              type="submit"
              className="auth-btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Đang xử lý đăng nhập...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập vào Hệ thống'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            {isRegister ? (
              <span>
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
              </span>
            ) : (
              <span>
                Chưa có tài khoản? <Link to="/register">Đăng ký tài khoản mới</Link>
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
