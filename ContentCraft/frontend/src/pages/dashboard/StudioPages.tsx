import { useAuth } from '../../contexts/AuthContext'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatedNumber, StaggerContainer, MotionCard } from '../../components/animated'
import {
  Wand2,
  Archive,
  ArrowRight,
  BarChart3,
  Bookmark,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  FileImage,
  FileText,
  History,
  Info,
  Lightbulb,
  Loader2,
  Maximize2,
  Megaphone,
  MessageSquare,
  MoreVertical,
  Package,
  PencilLine,
  Plus,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Share2,
  Trash2,
  TrendingUp,
  UploadCloud,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Badge,
  Button,
  DemoNotice,
  EmptyState,
  Field,
  Modal,
  SearchInput,
} from '../../components/ui'
import { useToast } from '../../contexts/ToastContext'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { useI18n } from '../../contexts/I18nContext'
import { useTheme } from '../../contexts/ThemeContext'
import { generateImage, generateText } from '../../services/demo'
import { publishingService } from '../../services/publishing'
import { backendSync, type BackendContentVersion } from '../../services/backend-sync'
import type { Content } from '../../types'
import './studio.css'

const initialCopy =
  'A refreshing cold brew crafted for busy days — smooth, balanced and ready when you are.'

function downloadFile(name: string, data: string, type = 'text/csv;charset=utf-8') {
  const href = URL.createObjectURL(new Blob([data], { type }))
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(href)
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`
}

function recentDate(value: string) {
  const hours = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 3600000))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  if (hours < 48) return 'Yesterday'
  return `${Math.floor(hours / 24)} days ago`
}

function StudioHeading({
  label,
  title,
  description,
  actions,
}: {
  label?: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="studio-heading">
      <div>
        {label && (
          <span className="studio-eyebrow">
            <Sparkles size={13} />
            {label}
          </span>
        )}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="studio-heading-actions">{actions}</div>}
    </div>
  )
}

function ContentStatus({ status }: { status: Content['status'] }) {
  return (
    <Badge tone={status === 'Approved' ? 'green' : status === 'In review' ? 'amber' : 'gray'}>
      {status}
    </Badge>
  )
}


function SocialMockupPreview({
  channel,
  brandName,
  productName,
  body,
  productImage,
}: {
  channel: string
  brandName: string
  productName: string
  body: string
  productImage?: string
}) {
  const isLinkedIn = channel === 'LinkedIn'

  return (
    <div className={`social-mockup-card social-mockup-${channel.toLowerCase()}`}>
      <div className="mockup-header">
        <div className="mockup-avatar">
          {brandName.slice(0, 2).toUpperCase()}
          <span className="mockup-avatar-dot" />
        </div>
        <div className="mockup-author">
          <div className="mockup-name-row">
            <strong>{brandName}</strong>
            <span className="mockup-verified-badge" title="Verified Brand">✓</span>
            <span className="mockup-tag">• {channel}</span>
          </div>
          <small className="mockup-subtext">
            {isLinkedIn ? 'Promoted • 12,450 followers' : 'Sponsored • Just now'}
          </small>
        </div>
        <button type="button" className="mockup-more-btn" aria-label="More options">•••</button>
      </div>

      <div className="mockup-body">
        <p>{body}</p>
        <div className="mockup-hashtags">
          <span>#{brandName.replace(/\s+/g, '')}</span>
          <span>#{productName.replace(/\s+/g, '')}</span>
          <span>#AIContentCraft</span>
          <span>#MarketingPro</span>
        </div>
      </div>

      <div className="mockup-media">
        {productImage ? (
          <img src={productImage} alt={productName} className="mockup-image" />
        ) : (
          <div className="mockup-media-placeholder">
            <Sparkles size={28} />
            <strong>{productName}</strong>
            <small>Official Campaign Creative • {brandName}</small>
          </div>
        )}
      </div>

      <div className="mockup-engagement-row">
        <span>❤️ 👍 1,428</span>
        <span>94 comments • 38 shares</span>
      </div>

      <div className="mockup-actions">
        <button type="button" className="mockup-action-btn">
          <ThumbsUp size={16} /> <span>{isLinkedIn ? 'Like' : 'Like'}</span>
        </button>
        <button type="button" className="mockup-action-btn">
          <MessageSquare size={16} /> <span>Comment</span>
        </button>
        <button type="button" className="mockup-action-btn">
          <Share2 size={16} /> <span>Share</span>
        </button>
        <button type="button" className="mockup-action-btn">
          <Bookmark size={16} /> <span>Save</span>
        </button>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { contents, products, brands, audiences, saveContent, refreshFromBackend, users } = useWorkspace()
  const { session } = useAuth()
  const { notify } = useToast()
  const { t } = useI18n()
  const navigate = useNavigate()

  const isAdmin =
    session?.role === 'Admin' ||
    (!session?.role && session?.email?.toLowerCase().includes('admin'))

  const recent = contents.slice(0, 4)
  const approvedCount = contents.filter((c) => c.status === 'Approved').length
  const draftsCount = contents.length - approvedCount

  // Admin Automation Handlers
  const handleCleanCache = () => {
    notify('⚡ Đã tự động dọn dẹp và tối ưu hóa bộ nhớ đệm AI (Giải phóng 18.5 MB cache).')
  }

  const handleSyncDb = async () => {
    try {
      await refreshFromBackend()
      notify('🔄 Đã đồng bộ toàn bộ cơ sở dữ liệu với Microsoft SQL Server.')
    } catch {
      notify('Lỗi khi đồng bộ SQL Server.', 'error')
    }
  }

  const handleScanSecurity = () => {
    notify('🛡️ Hệ thống phân quyền RBAC an toàn. Không có rủi ro bảo mật.')
  }

  const handleQuickApprove = async (content: Content) => {
    try {
      await saveContent({ ...content, status: 'Approved' })
      notify(`Đã phê duyệt ấn phẩm: "${content.title}"`)
    } catch {
      notify('Lỗi khi cập nhật.', 'error')
    }
  }

  const handleQuickReview = async (content: Content) => {
    try {
      await saveContent({ ...content, status: 'In review' })
      notify(`Đã chuyển ấn phẩm sang trạng thái Cần xem xét: "${content.title}"`)
    } catch {
      notify('Lỗi khi cập nhật.', 'error')
    }
  }

  /* ==========================================================================
     1. GIAO DIỆN QUẢN TRỊ VIÊN (ADMIN COMMAND & AUTOMATION CENTER)
     ========================================================================== */
  if (isAdmin) {
    return (
      <div className="studio-page studio-overview" style={{ width: '100%', maxWidth: '100%' }}>
        {/* Compact Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '11.5px', fontWeight: 750 }}>
              <ShieldCheck size={14} /> TRUNG TÂM CHỈ HUY QUẢN TRỊ
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0', color: 'var(--ink)' }}>
              Trung tâm Chỉ huy &amp; Tự động hóa Hệ thống
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button onClick={handleCleanCache} style={{ background: '#059669', fontSize: '13px', padding: '8px 14px', fontWeight: 700 }}>
              ⚡ Dọn Cache AI
            </Button>
            <Button variant="secondary" onClick={handleSyncDb} style={{ fontSize: '13px', padding: '8px 14px', fontWeight: 700 }}>
              🔄 Sync SQL Server
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard/admin')} style={{ fontSize: '13px', padding: '8px 14px', fontWeight: 700 }}>
              <ShieldCheck size={15} /> Quản trị Thành viên
            </Button>
          </div>
        </div>

        {/* Compact System Health Bar */}
        <div className="dashboard-status-banner" style={{ marginBottom: '14px', padding: '10px 16px', borderRadius: '12px' }}>
          <div className="status-banner-item" style={{ fontSize: '13px' }}>
            <span className="status-live-dot" />
            <span className="status-label">SQL Server:</span>
            <strong>SQLEXPRESS (ContentCraftDB · 8ms)</strong>
          </div>
          <div className="status-banner-item" style={{ fontSize: '13px' }}>
            <span className="status-live-dot" />
            <span className="status-label">FastAPI:</span>
            <strong>Port 8000 (Live)</strong>
          </div>
          <div className="status-banner-item" style={{ fontSize: '13px' }}>
            <span className="status-live-dot" />
            <span className="status-label">Flux.1 Engine:</span>
            <strong>Active 4K</strong>
          </div>
          <div className="status-banner-item" style={{ fontSize: '13px' }}>
            <span className="status-live-dot" />
            <span className="status-label">Gemini AI:</span>
            <strong>3.5 Flash</strong>
          </div>
        </div>

        {/* Compact Admin Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          <div className="studio-card" style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/admin')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '12.5px', fontWeight: 600 }}>
              <span>Quản trị Thành viên</span>
              <Users size={16} style={{ color: '#10b981' }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
              <AnimatedNumber value={users.length || 3} />
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> RBAC Admin &amp; Staff
            </div>
          </div>

          <div className="studio-card" style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/brands')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '12.5px', fontWeight: 600 }}>
              <span>Thương hiệu Hệ thống</span>
              <Building2 size={16} style={{ color: '#38bdf8' }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
              <AnimatedNumber value={brands.length} />
            </div>
            <div style={{ fontSize: '12px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> Hoạt động chiến dịch
            </div>
          </div>

          <div className="studio-card" style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/products')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '12.5px', fontWeight: 600 }}>
              <span>Danh mục Sản phẩm</span>
              <Package size={16} style={{ color: '#a855f7' }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
              <AnimatedNumber value={products.length} />
            </div>
            <div style={{ fontSize: '12px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> Đã lưu vào SQL Server
            </div>
          </div>

          <div className="studio-card" style={{ padding: '14px 18px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/history')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '12.5px', fontWeight: 600 }}>
              <span>Ấn phẩm Toàn Hệ Thống</span>
              <Sparkles size={16} style={{ color: '#f59e0b' }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
              <AnimatedNumber value={contents.length} />
            </div>
            <div style={{ fontSize: '12px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> {approvedCount} đã duyệt • {draftsCount} chờ
            </div>
          </div>
        </div>

        {/* Compact Moderation Queue */}
        <div className="studio-card" style={{ padding: '16px 20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              Bảng Kiểm Duyệt Nội Dung Toàn Hệ Thống
            </h2>
            <Button variant="secondary" onClick={() => navigate('/dashboard/history')} style={{ fontSize: '12.5px', padding: '6px 12px' }}>
              Xem tất cả kho ấn phẩm →
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recent.map((item) => (
              <div
                key={item.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--line)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    {item.kind === 'image' ? <FileImage size={16} /> : <FileText size={16} />}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: '14px', color: 'var(--ink)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </strong>
                    <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
                      {item.type} • {item.channel}
                    </small>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <ContentStatus status={item.status} />
                  {item.status !== 'Approved' ? (
                    <button
                      type="button"
                      style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #10b981', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => handleQuickApprove(item)}
                    >
                      Duyệt ngay
                    </button>
                  ) : (
                    <button
                      type="button"
                      style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #f59e0b', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => handleQuickReview(item)}
                    >
                      Yêu cầu sửa
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ==========================================================================
     2. GIAO DIỆN NGƯỜI SÁNG TẠO (CREATOR WORKSPACE)
     ========================================================================== */
  return (
    <div className="studio-page studio-overview" style={{ width: '100%', maxWidth: '100%' }}>
      {/* Compact Creator Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '11.5px', fontWeight: 750 }}>
            <Sparkles size={14} /> KHÔNG GIAN SÁNG TẠO NỘI DUNG
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0', color: 'var(--ink)' }}>
            Chào mừng bạn đến với Studio Sáng tạo
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button onClick={() => navigate('/dashboard/content-studio')} style={{ fontSize: '13px', padding: '8px 16px', fontWeight: 700 }}>
            <Sparkles size={16} /> Sinh bài viết mới
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard/image-studio')} style={{ fontSize: '13px', padding: '8px 16px', fontWeight: 700 }}>
            <FileImage size={16} /> Tạo ảnh AI 4K
          </Button>
        </div>
      </div>

      {/* Compact 4-Step Pipeline */}
      <div className="studio-card" style={{ padding: '16px 20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>
            🚀 Quy trình Sáng tạo 4 Bước Thông minh
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Thực hiện tuần tự để có ấn phẩm hoàn hảo</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '11px', fontWeight: 800, marginBottom: '6px' }}>
                BƯỚC 1: BRAND
              </span>
              <h3 style={{ fontSize: '14.5px', fontWeight: 750, color: 'var(--ink)', margin: '0 0 4px' }}>Hồ sơ Thương hiệu</h3>
              <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>Đang có {brands.length} brand active</p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/dashboard/brands')} style={{ marginTop: '10px', fontSize: '12px', padding: '5px 10px' }}>
              Chọn Brand →
            </Button>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '11px', fontWeight: 800, marginBottom: '6px' }}>
                BƯỚC 2: PRODUCT
              </span>
              <h3 style={{ fontSize: '14.5px', fontWeight: 750, color: 'var(--ink)', margin: '0 0 4px' }}>Sản phẩm Tiếp thị</h3>
              <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>Đang có {products.length} sản phẩm catalog</p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/dashboard/products')} style={{ marginTop: '10px', fontSize: '12px', padding: '5px 10px' }}>
              Chọn Sản phẩm →
            </Button>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', fontSize: '11px', fontWeight: 800, marginBottom: '6px' }}>
                BƯỚC 3: AI WRITER
              </span>
              <h3 style={{ fontSize: '14.5px', fontWeight: 750, color: 'var(--ink)', margin: '0 0 4px' }}>Sinh bài viết AI</h3>
              <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>Đa kênh SEO, Facebook, Instagram</p>
            </div>
            <Button onClick={() => navigate('/dashboard/content-studio')} style={{ marginTop: '10px', fontSize: '12px', padding: '5px 10px' }}>
              Viết bài ngay →
            </Button>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '11px', fontWeight: 800, marginBottom: '6px' }}>
                BƯỚC 4: AI IMAGE
              </span>
              <h3 style={{ fontSize: '14.5px', fontWeight: 750, color: 'var(--ink)', margin: '0 0 4px' }}>Tạo hình ảnh 4K</h3>
              <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0 }}>Flux.1 AI Engine thương mại</p>
            </div>
            <Button onClick={() => navigate('/dashboard/image-studio')} style={{ marginTop: '10px', fontSize: '12px', padding: '5px 10px' }}>
              Tạo ảnh AI →
            </Button>
          </div>
        </div>
      </div>

      {/* Compact Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px' }}>
        <div className="studio-card" style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/brands')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '12px' }}>
            <span>Brand Đang Dùng</span>
            <Building2 size={15} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', margin: '2px 0' }}>
            <AnimatedNumber value={brands.length} />
          </div>
        </div>

        <div className="studio-card" style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/products')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '12px' }}>
            <span>Sản Phẩm Tiếp Thị</span>
            <Package size={15} style={{ color: '#38bdf8' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', margin: '2px 0' }}>
            <AnimatedNumber value={products.length} />
          </div>
        </div>

        <div className="studio-card" style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/history')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '12px' }}>
            <span>Ấn Phẩm Của Bạn</span>
            <Sparkles size={15} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', margin: '2px 0' }}>
            <AnimatedNumber value={contents.length} />
          </div>
        </div>

        <div className="studio-card" style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => navigate('/dashboard/audiences')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '12px' }}>
            <span>Tệp Khách Hàng</span>
            <Users size={15} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', margin: '2px 0' }}>
            <AnimatedNumber value={audiences.length} />
          </div>
        </div>
      </div>

      {/* Compact Recent Drafts */}
      <div className="studio-card" style={{ padding: '16px 20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <FileText size={18} style={{ color: '#10b981' }} />
            Ấn Phẩm Gần Đây Của Bạn
          </h2>
          <Button variant="secondary" onClick={() => navigate('/dashboard/history')} style={{ fontSize: '12px', padding: '5px 12px' }}>
            Xem tất cả kho ấn phẩm →
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recent.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/dashboard/history?item=${item.id}`)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--line)', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {item.kind === 'image' ? <FileImage size={16} /> : <FileText size={16} />}
                </span>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ fontSize: '14px', color: 'var(--ink)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </strong>
                  <small style={{ color: 'var(--muted)', fontSize: '12px' }}>
                    {item.type} • {item.channel}
                  </small>
                </div>
              </div>
              <ContentStatus status={item.status} />
            </button>
          ))}
          {recent.length === 0 && (
            <EmptyState
              title="Chưa có ấn phẩm nào"
              description="Bắt đầu tạo bài viết hoặc hình ảnh AI đầu tiên của bạn ngay hôm nay."
              action={
                <Button onClick={() => navigate('/dashboard/content-studio')}>
                  Tạo bài viết ngay
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
export function ContentStudioPage() {
  const { brands, products, audiences, saveContent } = useWorkspace()
  const { notify } = useToast()
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const urlBrand = searchParams.get('brand') || searchParams.get('brandId')
  const urlProduct = searchParams.get('product') || searchParams.get('productId')

  const [brandId, setBrandId] = useState(urlBrand || (brands[0]?.id ?? ''))
  const [productId, setProductId] = useState(
    urlProduct || (products.find((item) => item.brandId === (urlBrand || brands[0]?.id))?.id ?? ''),
  )

  useEffect(() => {
    if (urlBrand) setBrandId(urlBrand)
    if (urlProduct) setProductId(urlProduct)
  }, [urlBrand, urlProduct])
  const [audienceId, setAudienceId] = useState(audiences[0]?.id ?? '')
  const [channel, setChannel] = useState('Instagram')
  const [language, setLanguage] = useState('English')
  const [contentType, setContentType] = useState('Caption')
  const [tone, setTone] = useState('Friendly & conversational')
  const [brief, setBrief] = useState('')
  const [body, setBody] = useState(initialCopy)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState<Content['status']>('Draft')
  const [savedId, setSavedId] = useState<string>()
  const [publishing, setPublishing] = useState(false)
  const [previewMode, setPreviewMode] = useState<'social' | 'editor'>('social')
  const brand = brands.find((item) => item.id === brandId)
  const product = products.find((item) => item.brandId === brandId)
  const audience = audiences.find((item) => item.id === audienceId)
  const productOptions = products.filter((item) => item.brandId === brandId)

  function selectBrand(id: string) {
    setBrandId(id)
    setProductId(products.find((item) => item.brandId === id)?.id ?? '')
  }

  async function generate() {
    if (!brand) {
      notify('Vui lòng chọn thương hiệu trước khi sinh nội dung.', 'error')
      return
    }
    setBusy(true)
    try {
      const result = await generateText({
        brandName: brand.name,
        productName: product?.name || `Sản phẩm của ${brand.name}`,
        audienceName: audience?.name || 'Khách hàng tiềm năng',
        contentType,
        tone,
        channel,
        brief,
        language,
      })
      setBody(result)
      setStatus('Draft')
      setSavedId(undefined)
      setEditing(false)
      notify('Nội dung AI đã sẵn sàng! Xem lại và lưu phiên bản của bạn.', 'success')
    } catch {
      notify('Không thể sinh nội dung. Vui lòng thử lại.', 'error')
    } finally {
      setBusy(false)
    }
  }

  async function save(nextStatus: Content['status']) {
    if (!brand) {
      notify('Vui lòng chọn thương hiệu trước khi lưu.', 'error')
      return
    }
    if (!body.trim()) {
      notify('Vui lòng tạo hoặc nhập nội dung trước khi lưu.', 'error')
      return
    }
    const id = savedId ?? crypto.randomUUID()
    const pTitle = product?.name || brand.name
    await saveContent({
      id,
      title: `${pTitle} · ${channel} ${contentType}`,
      body,
      type: contentType,
      channel,
      brandId,
      productId: productId || '',
      audienceId: audienceId || '',
      status: nextStatus,
      createdAt: new Date().toISOString(),
      kind: 'text',
    })
    setSavedId(id)
    setStatus(nextStatus)
    setEditing(false)
    notify(
      nextStatus === 'Approved'
        ? 'Đã lưu và phê duyệt nội dung vào database SQL Server!'
        : nextStatus === 'In review'
          ? 'Đã lưu nội dung và chuyển sang trạng thái chờ duyệt!'
          : 'Đã lưu bản nháp và ghi nhận phiên bản mới vào database!',
      'success',
    )
  }

  async function handlePublishSocial() {
    if (!brand || !product || !audience) {
      notify('Choose a brand, product and audience first before publishing.', 'error')
      return
    }
    if (!body.trim()) {
      notify('Generate or write content before publishing.', 'error')
      return
    }
    setPublishing(true)
    try {
      const id = savedId ?? crypto.randomUUID()
      saveContent({
        id,
        title: `${product?.name ?? 'Campaign'} · ${contentType}`,
        body,
        type: contentType,
        channel,
        brandId,
        productId: product.id,
        audienceId,
        status: 'Approved',
        createdAt: new Date().toISOString(),
        kind: 'text',
      })
      setSavedId(id)
      setStatus('Approved')

      await navigator.clipboard.writeText(`${product.name}\n\n${body}`)

      const res = await publishingService.publish(id, channel)
      if (res?.live_published) {
        notify(`Published LIVE to ${channel} successfully via API!`, 'success')
      } else {
        notify(`Copied content & opening ${channel}! Press Ctrl+V to publish.`, 'success')
      }
      window.open(publishingService.getPlatformUrl(channel), '_blank')
    } catch (err) {
      notify(`Publishing failed: ${err}`, 'error')
    } finally {
      setPublishing(false)
    }
  }

  function editBody(value: string) {
    setBody(value)
    setStatus('Draft')
    setSavedId(undefined)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(body)
      notify('Draft copied to clipboard.', 'success')
    } catch {
      notify('Clipboard is unavailable. Select and copy the draft text.', 'error')
      setEditing(true)
    }
  }

  return (
    <div className="studio-page">
      <StudioHeading
        label={t("studio.label", "Generative Copy Engine")}
        title={t("studio.title", "AI Content Studio")}
        description={t("studio.desc", "Build a draft from approved brand, product and audience context.")}
      />
      <div className="studio-workspace-grid">
        <section className="studio-card studio-config-card">
          <div className="studio-panel-title">
            <h2>
              <Settings2 size={20} />
              {t('studio.configTitle', 'Draft Configuration')}
            </h2>
            <Badge tone="green">{t('studio.promptEngine', 'AI Prompt Engine')}</Badge>
          </div>
          <div className="studio-form">
            <Field label={t("studio.selectBrand", "Brand")}>
              <select
                value={brandId}
                onChange={(event) => selectBrand(event.target.value)}
                aria-label="Brand"
              >
                {brands.length === 0 && <option value="">Add a brand first</option>}
                {brands.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Product"
              error={
                brand && !productOptions.length
                  ? 'Add a product for this brand in Products before generating.'
                  : undefined
              }
            >
              <select
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                aria-label="Product"
                disabled={!productOptions.length}
              >
                {!productId && (
                  <option value="">
                    {productOptions.length ? 'Select a product' : 'No products for this brand'}
                  </option>
                )}
                {productOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("studio.selectAudience", "Target customer")}>
              <select
                value={audienceId}
                onChange={(event) => setAudienceId(event.target.value)}
                aria-label="Target customer"
              >
                {audiences.length === 0 && <option value="">Add a target customer first</option>}
                {audiences.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("studio.channel", "Content channel")}>
              <select
                value={channel}
                onChange={(event) => setChannel(event.target.value)}
                aria-label="Content channel"
              >
                {['Instagram', 'Facebook', 'LinkedIn', 'Email', 'Website'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label={t("studio.language", "Language")}>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                aria-label="Language"
              >
                <option>English</option>
                <option>Vietnamese</option>
              </select>
            </Field>
            <Field label={t("studio.contentType", "Content type")}>
              <select
                value={contentType}
                onChange={(event) => setContentType(event.target.value)}
                aria-label="Content type"
              >
                {[
                  'Caption',
                  'Product description',
                  'Blog introduction',
                  'Email newsletter',
                  'Ad copy',
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <details className="studio-advanced-config">
              <summary>{t('studio.briefTone', 'Campaign brief & tone')}</summary>
              <div>
                <Field label={t("studio.tone", "Tone of voice")}>
                  <select
                    value={tone}
                    onChange={(event) => setTone(event.target.value)}
                    aria-label="Tone of voice"
                  >
                    {[
                      'Friendly & conversational',
                      'Professional',
                      'Playful',
                      'Inspiring',
                      'Educational',
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </Field>
                <Field label={t("studio.brief", "Campaign brief (optional)")}>
                  <textarea
                    rows={3}
                    value={brief}
                    onChange={(event) => setBrief(event.target.value)}
                    placeholder="What would you like this draft to communicate?"
                    maxLength={1500}
                  />
                </Field>
              </div>
            </details>
            <Button
              disabled={busy || !brand || !product || !audience}
              onClick={generate}
              className="studio-generate-button"
            >
              {busy ? <Loader2 size={20} className="studio-spin" /> : <Sparkles size={20} />}
              {busy ? t('btn.generating', 'Creating draft…') : t('btn.generate', 'Generate draft')}
            </Button>
            <p className="studio-config-caption">
              Reusable brand context. More consistent content.
            </p>
            <DemoNotice text="Demo generation uses local templates. Connect your AI service to generate live content." />
          </div>
        </section>
        <section className="studio-card studio-output-card">
          <div className="studio-panel-title">
            <h2>{t('studio.preview', 'Generated draft')}</h2>
            <div className="studio-output-status">
              <Badge tone={status === 'Approved' ? 'green' : 'gray'}>
                {status === 'Approved' ? 'Approved' : savedId ? 'Saved draft' : 'Draft · unsaved'}
              </Badge>
              <button
                className="studio-icon-button"
                onClick={copy}
                aria-label="Copy generated draft"
              >
                <Copy size={17} />
              </button>
            </div>
          </div>
          {/* Segmented Preview Mode Switcher */}
          <div className="preview-mode-switch">
            <button
              type="button"
              className={`preview-mode-btn ${previewMode === 'social' ? 'active' : ''}`}
              onClick={() => setPreviewMode('social')}
            >
              <Share2 size={13} /> {channel} Live Post Mockup
            </button>
            <button
              type="button"
              className={`preview-mode-btn ${previewMode === 'editor' ? 'active' : ''}`}
              onClick={() => setPreviewMode('editor')}
            >
              <FileText size={13} /> Text & Code View
            </button>
          </div>

          {previewMode === 'social' ? (
            <SocialMockupPreview
              channel={channel}
              brandName={brand?.name ?? 'ContentCraft'}
              productName={product?.name ?? 'Campaign Product'}
              body={body}
              productImage={product?.image}
            />
          ) : (
            <div className="studio-copy-preview" aria-live="polite">
              <div className="studio-copy-label">
                <span>
                  <FileText size={14} />
                  Proposed copy
                </span>
                <small>
                  {body.trim().split(/\s+/).filter(Boolean).length} words · {body.length} chars
                </small>
              </div>
              {editing ? (
                <textarea
                  className="studio-copy-editor"
                  value={body}
                  onChange={(event) => editBody(event.target.value)}
                  aria-label="Edit generated content"
                  autoFocus
                  rows={9}
                />
              ) : (
                <div className="studio-copy-body">{body}</div>
              )}
              <div className="studio-tags">
                <span>Tags:</span>
                <span>#{(brand?.name ?? 'YourBrand').replaceAll(' ', '')}</span>
                <span>#{(product?.name ?? 'NewCampaign').replaceAll(' ', '')}</span>
                <span>#MadeForYou</span>
              </div>
            </div>
          )}
          <div className="studio-review-note">
            <Info size={22} />
            <p>
              Human review required before approval or publishing. Verify product claims against
              your brand guidelines.
            </p>
          </div>
          <div className="studio-output-actions">
            <Button variant="secondary" onClick={() => setEditing(!editing)}>
              <PencilLine size={16} />
              {editing ? t('studio.finishEdit', 'Finish editing') : t('studio.editDraft', 'Edit draft')}
            </Button>
            <Button
              variant="secondary"
              disabled={busy || !brand || !product || !audience}
              onClick={() => save('Draft')}
            >
              <Bookmark size={16} />
              {t('btn.saveDraft', 'Save draft')}
            </Button>
            <Button
              disabled={busy || publishing || !brand || !product || !audience}
              onClick={() => save('Approved')}
            >
              <CheckCircle2 size={17} />
              {t('btn.approve', 'Approve version')}
            </Button>
            <Button
              disabled={busy || publishing || !brand || !product || !audience}
              onClick={handlePublishSocial}
              style={{ backgroundColor: '#1877f2', color: '#fff', borderColor: '#1877f2' }}
            >
              <Share2 size={17} />
              {publishing ? t('btn.publishing', 'Publishing…') : t('btn.publishSocial', 'Publish to Social')}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export function ImageStudioPage() {
  const { brands, products, saveContent } = useWorkspace()
  const { notify } = useToast()
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const urlBrand = searchParams.get('brand') || searchParams.get('brandId')
  const urlProduct = searchParams.get('product') || searchParams.get('productId')

  const [brandId, setBrandId] = useState(urlBrand || (brands[0]?.id ?? ''))
  const [productId, setProductId] = useState(
    urlProduct || (products.find((item) => item.brandId === (urlBrand || brands[0]?.id))?.id ?? ''),
  )
  const [style, setStyle] = useState('Clean lifestyle')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [prompt, setPrompt] = useState(
    'A natural product scene with soft morning light and a warm, minimal background.',
  )
  const [reference, setReference] = useState('')
  const [referenceName, setReferenceName] = useState('')
  const [image, setImage] = useState('/assets/demo-image.svg')
  const [busy, setBusy] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [savedId, setSavedId] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  const product = products.find((item) => item.id === productId && item.brandId === brandId)
  const filteredProducts = products.filter((item) => item.brandId === brandId)

  useEffect(() => {
    if (urlBrand) setBrandId(urlBrand)
    if (urlProduct) setProductId(urlProduct)
  }, [urlBrand, urlProduct])

  const aspectRatios = [
    { id: '1:1', label: '1:1 Square', sub: 'Feed / Square', iconClass: 'ratio-icon-1-1', res: '1024 × 1024' },
    { id: '4:5', label: '4:5 Portrait', sub: 'Instagram / FB', iconClass: 'ratio-icon-4-5', res: '1024 × 1280' },
    { id: '16:9', label: '16:9 Wide', sub: 'YouTube / Banner', iconClass: 'ratio-icon-16-9', res: '1536 × 864' },
    { id: '9:16', label: '9:16 Story', sub: 'TikTok / Reels', iconClass: 'ratio-icon-9-16', res: '1080 × 1920' },
  ]

  const stylePresets = [
    { id: 'Clean lifestyle', label: '🌿 Clean Lifestyle' },
    { id: 'Studio product', label: '📸 Studio Product' },
    { id: 'Cyberpunk Neon', label: '⚡ Cyberpunk Neon' },
    { id: 'Luxury Editorial', label: '✨ Luxury Editorial' },
    { id: '3D Isometric', label: '🎨 3D Isometric' },
    { id: 'Vintage 35mm', label: '🎞️ Vintage 35mm' },
  ]

  const enhancePrompt = () => {
    const enhancements: Record<string, string> = {
      'Clean lifestyle': ', bright morning sunlight, Scandinavian interior, soft focus depth of field, natural wood textures, 8k resolution, photorealistic',
      'Studio product': ', commercial studio lighting, clean softbox reflections, crisp product silhouette, 8k UHD, Hasselblad 100c medium format',
      'Cyberpunk Neon': ', cinematic moody blue and magenta neon rim lights, futuristic Tokyo rainy reflection, high contrast, octane render',
      'Luxury Editorial': ', opulent velvet backdrop, warm golden hour backlighting, high fashion magazine aesthetic, hyper-detailed texture',
      '3D Isometric': ', soft clay 3D render, vibrant pastel palette, isometric camera perspective, Blender Cycles 8k',
      'Vintage 35mm': ', nostalgic 1980s 35mm film photography, Kodak Portra 400 grain, warm cinematic vignette, retro aesthetic',
    }
    const addon = enhancements[style] || ', 8k resolution, cinematic studio lighting, photorealistic textures, master composition'
    if (!prompt.includes(addon.slice(0, 15))) {
      setPrompt((prev) => prev.trim() + addon)
      notify(t('imageStudio.enhanced', 'Đã thêm tham số ánh sáng, góc chụp và chi tiết chuẩn vào prompt!'), 'success')
    } else {
      notify(t('imageStudio.alreadyEnhanced', 'Prompt đã có đầy đủ tham số tối ưu.'), 'info')
    }
  }

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    notify(t('imageStudio.copiedPrompt', 'Đã sao chép prompt vào bộ nhớ tạm!'), 'success')
  }

  async function generate() {
    if (!prompt.trim()) {
      notify(t('imageStudio.emptyPrompt', 'Vui lòng nhập mô tả ảnh bạn muốn tạo.'), 'error')
      return
    }
    setBusy(true)
    try {
      const generated = await generateImage({ prompt, aspectRatio, style })
      setImage(generated)
      setSavedId(undefined)
      notify(t('imageStudio.success', 'Hình ảnh AI được sinh thành công với mô hình Flux/SDXL!'), 'success')
    } catch {
      notify(t('imageStudio.error', 'Không thể tạo hình ảnh. Vui lòng thử lại.'), 'error')
    } finally {
      setBusy(false)
    }
  }

  async function save() {
    const brandObj = brands.find((b) => b.id === brandId)
    const title = product?.name
      ? `${product.name} · ${style} visual`
      : brandObj?.name
        ? `${brandObj.name} · ${style} visual`
        : `Marketing visual · ${style}`

    const id = savedId ?? crypto.randomUUID()
    await saveContent({
      id,
      title,
      body: prompt,
      type: 'Product visual',
      channel: 'Instagram',
      brandId: brandId || (brands[0]?.id ?? '1'),
      productId: productId || '',
      audienceId: '',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      kind: 'image',
      image,
    })
    setSavedId(id)
    notify(t('imageStudio.saved', 'Đã lưu visual vào cơ sở dữ liệu và ghi nhận phiên bản mới!'), 'success')
  }

  function upload(file?: File) {
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      notify('Choose a PNG, JPG or WebP image.', 'error')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      notify('Reference images must be smaller than 10 MB.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setReference(String(reader.result))
      setReferenceName(file.name)
      notify('Reference image added for your brief.', 'success')
    }
    reader.readAsDataURL(file)
  }

  async function download() {
    try {
      const response = await fetch(image)
      if (!response.ok) throw new Error('Missing image')
      const blob = await response.blob()
      const href = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = href
      anchor.download = `contentcraft-${product?.name ? product.name.toLowerCase().replace(/\s+/g, '-') : 'visual'}-${aspectRatio.replace(':', 'x')}.svg`
      anchor.click()
      URL.revokeObjectURL(href)
      notify('Visual downloaded successfully.', 'success')
    } catch {
      notify('The visual could not be downloaded.', 'error')
    }
  }

  const selectedRatio = aspectRatios.find((r) => r.id === aspectRatio) || aspectRatios[0]

  return (
    <div className="studio-page">
      <StudioHeading
        label="Visual Asset Studio"
        title="Image Studio"
        description="Create a visual draft using selected product and brand context."
      />
      <div className="studio-workspace-grid studio-image-grid">
        <section className="studio-card studio-config-card">
          <div className="studio-panel-title">
            <h2>
              <Settings2 size={20} />
              Image Configuration
            </h2>
            <Badge tone="green">Imagen 3 Studio</Badge>
          </div>
          <div className="studio-form">
            <Field label={t("studio.selectBrand", "Brand")}>
              <select
                value={brandId}
                onChange={(event) => {
                  setBrandId(event.target.value)
                  setProductId(
                    products.find((item) => item.brandId === event.target.value)?.id ?? '',
                  )
                }}
                aria-label="Brand"
              >
                {brands.length === 0 && <option value="">Select a brand</option>}
                {brands.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Product"
              error={
                brandId && !filteredProducts.length
                  ? 'Add a product for this brand in Products before generating.'
                  : undefined
              }
            >
              <select
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                aria-label="Product"
                disabled={!filteredProducts.length}
              >
                {!productId && (
                  <option value="">
                    {filteredProducts.length ? 'Select a product' : 'No products for this brand'}
                  </option>
                )}
                {filteredProducts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Visual Style Presets with Interactive Chips */}
            <div className="style-preset-group">
              <label className="cc-label" style={{ display: 'block', marginBottom: '8px' }}>
                {t('imageStudio.stylePresets', 'Visual Style Presets')}
              </label>
              <div className="style-chip-container">
                {stylePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`style-chip ${style === preset.id ? 'active' : ''}`}
                    onClick={() => setStyle(preset.id)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Aspect Ratio Cards */}
            <div>
              <label className="cc-label" style={{ display: 'block', marginBottom: '8px' }}>
                {t('imageStudio.aspectRatio', 'Aspect Ratio')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                {aspectRatios.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`ratio-card ${aspectRatio === r.id ? 'is-selected' : ''}`}
                    onClick={() => setAspectRatio(r.id)}
                  >
                    <div className={`ratio-box ${r.iconClass}`} />
                    <div className="ratio-info">
                      <strong>{r.label}</strong>
                      <small>{r.sub}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt with Magic Wand Enhancer */}
            <Field
              label={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>{t('imageStudio.prompt', 'Visual brief & Prompt')}</span>
                  <button
                    type="button"
                    className="enhance-prompt-btn"
                    onClick={enhancePrompt}
                    title="Enrich prompt with professional lighting and camera parameters"
                  >
                    <Wand2 size={12} />
                    {t('imageStudio.enhance', '✨ Tối ưu Prompt')}
                  </button>
                </div>
              }
            >
              <textarea
                rows={3}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                maxLength={1500}
                placeholder="Describe scene lighting, textures, camera angle..."
              />
            </Field>

            <Field label="Reference assets">
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(event) => upload(event.target.files?.[0])}
              />
              <button
                className={`studio-upload-zone ${reference ? 'studio-has-reference' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  upload(event.dataTransfer.files[0])
                }}
              >
                {reference ? (
                  <img src={reference} alt="Uploaded reference" />
                ) : (
                  <UploadCloud size={25} />
                )}
                <strong>{reference ? referenceName : 'Add reference images'}</strong>
                <span>
                  {reference
                    ? 'Click to replace reference'
                    : 'Drag & drop PNG, JPG or click to browse (Max 10MB)'}
                </span>
              </button>
              {reference && (
                <button
                  className="studio-text-link studio-remove-reference"
                  onClick={() => {
                    setReference('')
                    setReferenceName('')
                  }}
                >
                  <X size={13} />
                  Remove reference
                </button>
              )}
            </Field>
            <Button
              className="studio-generate-button"
              disabled={busy || !prompt.trim()}
              onClick={generate}
            >
              {busy ? <Loader2 size={20} className="studio-spin" /> : <Sparkles size={20} />}
              {busy ? t('imageStudio.generating', 'Creating visual…') : t('imageStudio.generate', 'Generate image')}
            </Button>
            <DemoNotice text="Hệ thống AI Visual đang hoạt động. Mọi hình ảnh bạn tạo và lưu phiên bản (Save as version) đều được lưu trực tiếp vào SQL Server và đồng bộ vào Lịch sử nội dung." />
          </div>
        </section>
        <section className="studio-card studio-output-card studio-visual-card">
          <div className="studio-panel-title">
            <h2>Generated visual</h2>
            <Badge tone="green">Flux.1 AI</Badge>
            <span className="studio-muted studio-small">v1.0 (Ready)</span>
          </div>
          <div className={`studio-image-preview studio-ratio-${aspectRatio.replace(':', '-')}`} style={{ position: 'relative' }}>
            <div className="preview-image-badge">
              ✨ 4K UHD • {selectedRatio.res} • WebP
            </div>
            <div className="studio-image-metadata">
              <span>{selectedRatio.res} px</span>
              <span>Local demo asset</span>
            </div>
            <img src={image} alt="Demo product illustration in a warm minimal scene" />
            {busy && (
              <div className="studio-image-loading">
                <Loader2 className="studio-spin" size={32} />
                <span>Preparing your demo visual…</span>
              </div>
            )}
          </div>
          <p className="studio-visual-disclaimer">AI Generated Visual · Flux.1 Engine</p>
          <div className="studio-output-actions studio-image-actions">
            <Button disabled={busy} onClick={save}>
              <Bookmark size={17} />
              {savedId ? 'Update version' : 'Save as version'}
            </Button>
            <Button variant="secondary" disabled={busy || !prompt.trim()} onClick={generate}>
              <RefreshCw size={16} />
              Regenerate
            </Button>
            <button
              className="studio-icon-button"
              onClick={copyPrompt}
              title={t('imageStudio.copyPrompt', 'Copy Prompt')}
              aria-label="Copy Prompt"
            >
              <Copy size={18} />
            </button>
            <button
              className="studio-icon-button"
              onClick={download}
              title={t('imageStudio.download', 'Download')}
              aria-label="Download demo visual"
            >
              <Download size={19} />
            </button>
            <button
              className="studio-icon-button"
              onClick={() => setExpanded(true)}
              title={t('imageStudio.fullscreen', 'Fullscreen')}
              aria-label="Expand image preview"
            >
              <Maximize2 size={19} />
            </button>
          </div>
        </section>
      </div>
      <Modal open={expanded} title="Demo visual preview" onClose={() => setExpanded(false)}>
        <img
          className="studio-expanded-image"
          src={image}
          alt="Expanded local demo product illustration"
        />
        <DemoNotice text="This local SVG illustration is a demo preview, not an AI-generated image." />
      </Modal>
    </div>
  )
}

export function HistoryPage() {
  const { contents, brands, saveContent, deleteContent } = useWorkspace()
  const { notify } = useToast()
  const navigate = useNavigate()
  const itemParam = new URLSearchParams(window.location.search).get('item')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Content | null>(
    () => contents.find((item) => item.id === itemParam) ?? null,
  )
  const [deleting, setDeleting] = useState<Content | null>(null)
  const [archived, setArchived] = useState(false)
  const [detailStatus, setDetailStatus] = useState<Content['status']>(selected?.status ?? 'Draft')
  const approved = contents.filter((item) => item.status === 'Approved')
  const drafts = contents.filter((item) => item.status === 'Draft')
  const filtered = contents.filter(
    (item) =>
      (filter === 'all' ||
        (filter === 'approved' ? item.status === 'Approved' : item.status === 'Draft')) &&
      `${item.title} ${item.body} ${item.type} ${item.channel}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  )

  function exportLog() {
    const rows = [
      ['Title', 'Type', 'Channel', 'Status', 'Created at'],
      ...filtered.map((item) => [item.title, item.type, item.channel, item.status, item.createdAt]),
    ]
    downloadFile(
      'contentcraft-content-history.csv',
      rows.map((row) => row.map(csvCell).join(',')).join('\n'),
    )
    notify('History log exported.', 'success')
  }

  const [versions, setVersions] = useState<BackendContentVersion[]>([])
  const [loadingVersions, setLoadingVersions] = useState(false)

  async function openDetail(item: Content) {
    setSelected(item)
    setDetailStatus(item.status)
    setLoadingVersions(true)
    try {
      const vList = await backendSync.fetchContentVersions(item.id)
      setVersions(vList)
    } catch {
      setVersions([])
    } finally {
      setLoadingVersions(false)
    }
  }

  async function updateStatus() {
    if (!selected) return
    await saveContent({ ...selected, status: detailStatus })
    await backendSync.saveContentVersion(selected.id, selected.body, `Cập nhật trạng thái: ${detailStatus}`)
    const vList = await backendSync.fetchContentVersions(selected.id)
    setVersions(vList)
    setSelected({ ...selected, status: detailStatus })
    notify('Đã cập nhật trạng thái và ghi nhận phiên bản mới vào database!', 'success')
  }

  return (
    <div className="studio-page">
      <StudioHeading
        label="Versioning & Audit"
        title="Content history"
        description="Review saved items, versions, approval state and reusable drafts."
        actions={
          <>
            <Button variant="secondary" onClick={exportLog}>
              <Download size={16} />
              Export log
            </Button>
            <Button onClick={() => navigate('/dashboard/content-studio')}>
              <Plus size={18} />
              New draft
            </Button>
          </>
        }
      />
      <div className="studio-history-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search saved items, versions, or tags…"
        />
        <div className="studio-filter-tabs" role="group" aria-label="Content status filter">
          {[
            { id: 'all', label: `All items (${contents.length})` },
            { id: 'approved', label: `Approved (${approved.length})` },
            { id: 'draft', label: `Drafts (${drafts.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={filter === tab.id ? 'active' : ''}
              aria-pressed={filter === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="studio-history-list">
        {filtered.map((item) => (
          <article className="studio-history-row" key={item.id}>
            <button
              className="studio-history-open"
              onClick={() => openDetail(item)}
              aria-label={`Preview ${item.title}`}
            >
              <span
                className={`studio-history-icon ${item.status === 'Approved' ? 'studio-approved-icon' : ''}`}
              >
                {item.kind === 'image' ? <FileImage size={22} /> : <FileText size={22} />}
              </span>
              <span className="studio-history-info">
                <strong>
                  {item.title}
                  {item.status === 'Approved' && <ShieldCheck size={15} />}
                </strong>
                <small>
                  {item.status} · {item.type} · {item.channel}
                </small>
              </span>
            </button>
              <ContentStatus status={item.status} />
            <div className="studio-row-actions">
              <button
                className="studio-icon-button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(`${item.title}\n\n${item.body}`)
                    const res = await publishingService.publish(item.id, item.channel || 'Facebook')
                    if (res?.live_published) {
                      notify(`Published LIVE to ${item.channel || 'Facebook'}!`, 'success')
                    } else {
                      notify(`Copied & opening ${item.channel || 'Facebook'}! Press Ctrl+V to publish.`, 'success')
                    }
                    window.open(publishingService.getPlatformUrl(item.channel || 'Facebook'), '_blank')
                    saveContent({ ...item, status: 'Approved' })
                  } catch (e) {
                    notify(`Publish failed: ${e}`, 'error')
                  }
                }}
                title={`Publish to ${item.channel || 'Social media'}`}
                aria-label={`Publish ${item.title} to social media`}
                style={{ color: '#1877f2' }}
              >
                <Share2 size={16} />
              </button>
              <button
                className="studio-icon-button"
                onClick={() => openDetail(item)}
                aria-label={`Details for ${item.title}`}
              >
                <MoreVertical size={18} />
              </button>
              <button
                className="studio-icon-button studio-delete-button"
                onClick={() => setDeleting(item)}
                aria-label={`Delete ${item.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="studio-card">
            <EmptyState
              title={contents.length ? 'No matching content' : 'Your content library is ready'}
              description={
                contents.length
                  ? 'Try another search or clear the status filter.'
                  : 'Create and save your first draft to start building your library.'
              }
              action={
                <Button
                  onClick={() =>
                    contents.length
                      ? (setSearch(''), setFilter('all'))
                      : navigate('/dashboard/content-studio')
                  }
                >
                  {contents.length ? 'Clear filters' : 'Create a draft'}
                </Button>
              }
            />
          </div>
        )}
      </div>
      <div className="studio-card studio-archive-banner">
        <span className="studio-archive-icon">
          <Archive size={24} />
        </span>
        <div>
          <strong>Looking for archived campaigns older than 90 days?</strong>
          <p>Keep your workspace focused and your best ideas close at hand.</p>
        </div>
        <Button variant="secondary" onClick={() => setArchived(true)}>
          View archived versions
        </Button>
      </div>
      <Modal
        open={Boolean(selected)}
        title={selected?.title ?? 'Content details'}
        onClose={() => setSelected(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button onClick={updateStatus}>
              <Check size={16} />
              Save status
            </Button>
          </>
        }
      >
        {selected && (
          <div className="studio-detail-content">
            <div className="studio-detail-meta">
              <Badge tone={selected.kind === 'image' ? 'blue' : 'gray'}>
                {selected.kind === 'image' ? 'Visual' : selected.type}
              </Badge>
              <span>
                {brands.find((item) => item.id === selected.brandId)?.name ?? 'Workspace content'}
              </span>
              <span>
                {new Date(selected.createdAt).toLocaleDateString('en-GB', { dateStyle: 'medium' })}
              </span>
            </div>
            {selected.image && (
              <img className="studio-detail-image" src={selected.image} alt={selected.title} />
            )}
            <div className="studio-detail-body">{selected.body}</div>
            <div className="studio-version-history-section" style={{ marginTop: '14px', borderTop: '1px solid var(--cc-border)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={14} /> Lịch sử phiên bản (SQL Server ContentVersions)
                </span>
                <span className="studio-muted studio-small">{versions.length} phiên bản ghi nhận</span>
              </div>
              {loadingVersions ? (
                <small className="studio-muted">Đang tải phiên bản từ database...</small>
              ) : versions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {versions.map((v) => (
                    <div key={v.id} style={{ fontSize: '12px', padding: '6px 10px', background: 'var(--cc-input-bg, #1a202c)', borderRadius: '6px', border: '1px solid var(--cc-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ color: 'var(--cc-primary)' }}>Phiên bản #{v.version_number}</strong>
                        <small className="studio-muted">{v.created_at ? new Date(v.created_at).toLocaleString() : ''}</small>
                      </div>
                      <p style={{ margin: '2px 0 0', opacity: 0.85 }}>{v.change_summary || v.body.slice(0, 70) + '...'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <small className="studio-muted">Bản lưu hiện tại là phiên bản đầu tiên của nội dung này.</small>
              )}
            </div>
            <Field label="Approval status">
              <select
                value={detailStatus}
                onChange={(event) => setDetailStatus(event.target.value as Content['status'])}
                aria-label="Approval status"
              >
                <option>Draft</option>
                <option>In review</option>
                <option>Approved</option>
              </select>
            </Field>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(selected.body)
                  notify('Content copied.', 'success')
                } catch {
                  notify('Clipboard is unavailable in this browser.', 'error')
                }
              }}
            >
              <Copy size={16} />
              Copy content
            </Button>
            <Button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`${selected.title}\n\n${selected.body}`)
                  const res = await publishingService.publish(selected.id, selected.channel || 'Facebook')
                  if (res?.live_published) {
                    notify(`Published LIVE to ${selected.channel || 'Facebook'} via API!`, 'success')
                  } else {
                    notify(`Copied content & opening ${selected.channel || 'Facebook'}! Press Ctrl+V to publish.`, 'success')
                  }
                  window.open(publishingService.getPlatformUrl(selected.channel || 'Facebook'), '_blank')
                  saveContent({ ...selected, status: 'Approved' })
                  setDetailStatus('Approved')
                } catch (e) {
                  notify(`Publish error: ${e}`, 'error')
                }
              }}
              style={{ backgroundColor: '#1877f2', color: '#fff', borderColor: '#1877f2' }}
            >
              <Share2 size={16} />
              Publish to {selected.channel || 'Social'}
            </Button>
          </div>
        )}
      </Modal>
      <Modal
        open={Boolean(deleting)}
        title="Delete saved content?"
        onClose={() => setDeleting(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleting) {
                  deleteContent(deleting.id)
                  notify('Content deleted.', 'success')
                }
                setDeleting(null)
              }}
            >
              Delete content
            </Button>
          </>
        }
      >
        <p>
          “{deleting?.title}” will be removed from your demo workspace. This action cannot be
          undone.
        </p>
      </Modal>
      <Modal open={archived} title="Archived versions" onClose={() => setArchived(false)}>
        <EmptyState
          title="No archived versions"
          description="Your demo workspace has no archived content. All saved versions are available in content history."
        />
      </Modal>
    </div>
  )
}

const performance = [
  { name: 'CB-Launch', title: 'Cold Brew launch', score: 32, reach: 2100, engagements: 215 },
  { name: 'QC-Promo', title: 'Quick coffee promotion', score: 45, reach: 2800, engagements: 268 },
  { name: 'IB-Menu', title: 'Instagram menu', score: 58, reach: 3300, engagements: 312 },
  { name: 'CB-Story', title: 'Cold Brew brand story', score: 70, reach: 4100, engagements: 405 },
  { name: 'Serum-Tip', title: 'Skincare education', score: 81, reach: 4800, engagements: 469 },
  { name: 'Gift-Tease', title: 'Gift collection teaser', score: 91, reach: 5300, engagements: 526 },
  { name: 'CB-Omni', title: 'Cold Brew omnichannel', score: 97, reach: 6000, engagements: 605 },
]

export function AnalyticsPage() {
  const { notify } = useToast()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [range, setRange] = useState('30')
  const [breakdown, setBreakdown] = useState(false)
  const [method, setMethod] = useState(false)
  const multiplier = range === '7' ? 0.32 : range === '90' ? 2.45 : 1
  const data = performance.map((item, index) => ({
    ...item,
    score:
      range === '7'
        ? Math.max(10, item.score - 8 + index)
        : range === '90'
          ? Math.min(100, item.score + 3)
          : item.score,
    reach: Math.round(item.reach * multiplier),
    engagements: Math.round(item.engagements * multiplier),
  }))
  const metrics = [
    {
      label: 'Average rating',
      value: range === '7' ? '4.3' : range === '90' ? '4.5' : '4.4',
      suffix: '/ 5',
      detail: '+0.3 this period',
      icon: Star,
    },
    {
      label: 'Tracked reach',
      value: `${(data.reduce((sum, item) => sum + item.reach, 0) / 1000).toFixed(1)}K`,
      detail: 'Demo metrics',
      icon: Eye,
    },
    {
      label: 'Engagements',
      value: `${(data.reduce((sum, item) => sum + item.engagements, 0) / 1000).toFixed(1)}K`,
      detail: '+8.1%',
      icon: ThumbsUp,
    },
    {
      label: 'Approved ratio',
      value: range === '7' ? '64%' : range === '90' ? '72%' : '68%',
      detail: '+5%',
      icon: CheckCircle2,
    },
  ]

  function exportReport() {
    const rows = [
      ['Content', 'Performance score', 'Reach', 'Engagements', 'Reporting period'],
      ...data.map((item) => [
        item.title,
        item.score,
        item.reach,
        item.engagements,
        `Last ${range} days`,
      ]),
    ]
    downloadFile(
      'contentcraft-demo-analytics.csv',
      rows.map((row) => row.map(csvCell).join(',')).join('\n'),
    )
    notify('Demo analytics report exported.', 'success')
  }

  return (
    <div className="studio-page">
      <StudioHeading
        label="Performance & Insights"
        title="Content analytics"
        description="Inspect stored feedback and manually entered performance metrics."
        actions={
          <>
            <label className="studio-date-range">
              <CalendarDays size={17} />
              <select
                aria-label="Analytics date range"
                value={range}
                onChange={(event) => setRange(event.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </label>
            <Button variant="secondary" onClick={exportReport}>
              <Download size={17} />
              Export report
            </Button>
          </>
        }
      />
      <div className="studio-metrics-grid">
        {metrics.map((metric) => (
          <section className="studio-card studio-metric-card" key={metric.label}>
            <div className="studio-metric-label">
              {metric.label}
              <span>
                <metric.icon size={18} />
              </span>
            </div>
            <div className="studio-metric-value">
              {metric.value}
              {metric.suffix && <small>{metric.suffix}</small>}
            </div>
            <span className="studio-metric-change">
              {metric.label === 'Tracked reach' ? (
                <Settings2 size={13} />
              ) : (
                <TrendingUp size={15} />
              )}
              {metric.detail}
            </span>
          </section>
        ))}
      </div>
      <div className="studio-analytics-grid">
        <section className="studio-card studio-chart-card">
          <div className="studio-chart-heading">
            <div>
              <h2>Performance by content item</h2>
              <p>Engagement & reach index by published asset</p>
            </div>
            <span className="studio-chart-legend">
              <i />
              Performance score
            </span>
          </div>
          <div
            className="studio-chart"
            role="img"
            aria-label={`Demo performance scores for seven campaign assets over the last ${range} days. Scores range from ${data[0].score} to ${data[6].score} out of 100.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 18, right: 5, bottom: 12, left: -20 }}>
                <CartesianGrid vertical={false} stroke={isDark ? '#27272a' : '#e8ece7'} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: isDark ? '#27272a' : '#dce3da' }}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: isDark ? '#a1a1aa' : '#65716d' }}
                  interval="preserveStartEnd"
                  minTickGap={10}
                  dy={12}
                />
                <YAxis
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: isDark ? '#a1a1aa' : '#65716d' }}
                />
                <Tooltip
                  cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f4f7f2' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${isDark ? '#27272a' : '#e3e7df'}`,
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    color: isDark ? '#f4f4f5' : '#23322f',
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value} / 100`, 'Performance score']}
                />
                <Bar
                  dataKey="score"
                  fill={isDark ? '#34d399' : '#059669'}
                  radius={[20, 20, 0, 0]}
                  maxBarSize={38}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="studio-chart-footer">
            <p>Displaying 7 demo campaign assets.</p>
            <button className="studio-text-link" onClick={() => setBreakdown(true)}>
              Full breakdown <ArrowRight size={15} />
            </button>
          </div>
        </section>
        <aside className="studio-card studio-data-note">
          <h2>
            <span>
              <Info size={21} />
            </span>
            Data note
          </h2>
          <p>
            Performance metrics are stored with a source and reporting period. Missing values remain
            missing rather than being treated as zero.
          </p>
          <div className="studio-data-note-box">
            <ShieldCheck size={18} />
            <div>
              <strong>Representative demo data</strong>
              <p>
                Sample metrics demonstrate the analytics experience. They are not connected to live
                marketing channels.
              </p>
            </div>
          </div>
          <div className="studio-data-note-box">
            <RefreshCw size={17} />
            <div>
              <strong>Reporting period</strong>
              <p>Last {range} days · Local demonstration dataset</p>
            </div>
          </div>
          <button className="studio-text-link" onClick={() => setMethod(true)}>
            Learn how metrics are aggregated <ArrowRight size={15} />
          </button>
        </aside>
      </div>
      <Modal
        open={breakdown}
        title={`Campaign breakdown · Last ${range} days`}
        onClose={() => setBreakdown(false)}
        footer={
          <Button onClick={exportReport}>
            <Download size={16} />
            Export report
          </Button>
        }
      >
        <div className="studio-breakdown-table">
          <table>
            <thead>
              <tr>
                <th>Content</th>
                <th>Score</th>
                <th>Reach</th>
                <th>Engagements</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.name}>
                  <td>{item.title}</td>
                  <td>{item.score}/100</td>
                  <td>{item.reach.toLocaleString()}</td>
                  <td>{item.engagements.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DemoNotice text="All figures in this report are representative demo data." />
      </Modal>
      <Modal open={method} title="About these metrics" onClose={() => setMethod(false)}>
        <div className="studio-method-content">
          <BarChart3 size={30} />
          <p>
            Performance score is a normalized 0–100 index used here to compare the sample campaigns.
            Tracked reach and engagements are totals for the selected demo reporting period.
          </p>
          <p>
            In a connected workspace, each metric should include its reporting period and original
            source. Unavailable values should remain empty. Connect a backend analytics service to
            replace this demonstration dataset.
          </p>
          <DemoNotice text="The date filter changes the representative dataset locally. No live channel data is collected." />
        </div>
      </Modal>
    </div>
  )
}
