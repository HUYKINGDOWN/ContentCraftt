import { useEffect, useState } from 'react'
import { ShieldAlert, X } from 'lucide-react'
import {
  Brand,
  Product,
  ContentItem,
  Audience,
  ContentRule,
  ProductAsset,
  AnalyticsSummary,
  AnalyticsEvent,
  User
} from './types'
import {
  brandApi,
  productApi,
  contentApi,
  audienceApi,
  ruleApi,
  assetApi,
  analyticsApi,
  userApi,
  publishingApi,
  feedbackApi
} from './services'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider, useI18n } from './context/I18nContext'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { Toast } from './components/layout/Toast'
import {
  BrandModal,
  ProductModal,
  AudienceModal,
  RuleModal,
  AssetModal,
  FeedbackModal,
  PublishModal
} from './components/modals'
import {
  ContentStudioPage,
  ContentLibraryPage,
  BrandsPage,
  ProductsPage,
  AudiencesPage,
  RulesPage,
  AssetsPage,
  AnalyticsPage,
  SettingsPage
} from './pages'

function AppContent() {
  const { language } = useI18n()
  const [tab, setTab] = useState('studio')

  // Data states
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [contents, setContents] = useState<ContentItem[]>([])
  const [audiences, setAudiences] = useState<Audience[]>([])
  const [rules, setRules] = useState<ContentRule[]>([])
  const [assets, setAssets] = useState<ProductAsset[]>([])
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [perfLogs, setPerfLogs] = useState<AnalyticsEvent[]>([])
  const [users, setUsers] = useState<User[]>([])

  // Global Context & UI
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [feedbackContentId, setFeedbackContentId] = useState<number | null>(null)
  const [publishingItem, setPublishingItem] = useState<ContentItem | null>(null)

  // Studio preset parameters when navigating from other tabs
  const [studioPreset, setStudioPreset] = useState<{
    productId?: number | ''
    topic?: string
    audienceId?: number | ''
  }>({})

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  async function loadAllData() {
    setRefreshing(true)
    try {
      const [b, p, c, a, r, ass, s, ev, u] = await Promise.all([
        brandApi.list().catch(() => []),
        productApi.list().catch(() => []),
        contentApi.list().catch(() => []),
        audienceApi.list().catch(() => []),
        ruleApi.list().catch(() => []),
        assetApi.list().catch(() => []),
        analyticsApi.getSummary().catch(() => ({
          total_brands: 0,
          total_products: 0,
          total_contents: 0,
          total_reach: 0,
          total_engagement: 0,
          total_clicks: 0
        })),
        analyticsApi.getEvents().catch(() => []),
        userApi.list().catch(() => [])
      ])

      setBrands(b)
      setProducts(p)
      setContents(c)
      setAudiences(a)
      setRules(r)
      setAssets(ass)
      setSummary(s)
      setPerfLogs(ev)
      setUsers(u)

      if (b.length > 0 && !activeBrandId) {
        setActiveBrandId(b[0].id)
      }
      setError('')
    } catch (err) {
      setError(
        language === 'en'
          ? `Could not connect to Backend. Please make sure Backend is running at http://127.0.0.1:8000: ${String(err)}`
          : `Không kết nối được Backend. Hãy chắc chắn Backend đang chạy tại http://127.0.0.1:8000: ${String(err)}`
      )
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    void loadAllData()
  }, [])

  // Handlers for Content
  async function handleSaveContent(contentData: {
    title: string
    body: string
    platform: string
    product_id: number | null
    target_customer_id: number | null
    rule_id: number | null
    status: string
  }) {
    try {
      await contentApi.create({
        ...contentData,
        brand_id: activeBrandId || 1,
        content_type: 'Caption'
      })
      await loadAllData()
      showToast(
        contentData.status === 'Approved'
          ? (language === 'en' ? 'Saved & Approved content (Approved)!' : 'Đã lưu & duyệt bài viết (Approved)!')
          : (language === 'en' ? 'Saved draft to library!' : 'Đã lưu bản nháp vào thư viện!')
      )
      setTab('library')
    } catch (err) {
      setError(language === 'en' ? `Error saving content: ${String(err)}` : `Lỗi lưu nội dung: ${String(err)}`)
    }
  }

  async function handleApproveContent(contentId: number) {
    try {
      await contentApi.approve(contentId)
      showToast(
        language === 'en'
          ? `Approved post #${contentId} successfully (Approved)!`
          : `Đã duyệt bài viết #${contentId} thành công (Approved)!`
      )
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Error approving post: ${String(err)}` : `Lỗi duyệt bài: ${String(err)}`)
    }
  }

  async function handleUpdateContentStatus(contentId: number, newStatus: string) {
    try {
      await contentApi.updateStatus(contentId, newStatus)
      showToast(
        language === 'en'
          ? `Updated post #${contentId} status to "${newStatus}"!`
          : `Đã đổi trạng thái bài viết #${contentId} sang "${newStatus}"!`
      )
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Error updating status: ${String(err)}` : `Lỗi đổi trạng thái: ${String(err)}`)
    }
  }

  // Publishing
  async function handlePublishContent(contentId: number, targetPlatform: string = 'Facebook') {
    try {
      const res = await publishingApi.publish({ content_id: contentId, platform: targetPlatform })
      if (res && res.live_published) {
        showToast(
          language === 'en'
            ? `Successfully published LIVE to ${targetPlatform} via API!`
            : `Đã xuất bản THẬT thành công lên ${targetPlatform} qua API!`
        )
      } else {
        showToast(
          language === 'en'
            ? 'Saved Published status internally! (Check .env for API config)'
            : 'Đã lưu trạng thái Published nội bộ! (Xem hướng dẫn cấu hình API trong .env)'
        )
      }
      setActiveModal(null)
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Publishing error: ${String(err)}` : `Lỗi xuất bản: ${String(err)}`)
    }
  }

  async function handleOpenAndPublishLive(item: ContentItem, platform: string) {
    try {
      void navigator.clipboard.writeText(`${item.title}\n\n${item.body}`)
      await publishingApi.publish({ content_id: item.id, platform })
      showToast(
        language === 'en'
          ? `Copied content & opened ${platform}! Press Ctrl+V to paste & publish now.`
          : `Đã sao chép nội dung & mở ${platform}! Nhấn Ctrl+V để đăng bài thật ngay.`
      )
      setActiveModal(null)
      await loadAllData()

      let targetUrl = 'https://www.facebook.com'
      if (platform.toLowerCase() === 'tiktok') {
        targetUrl = 'https://www.tiktok.com/creator-center/upload'
      } else if (platform.toLowerCase() === 'linkedin') {
        targetUrl = 'https://www.linkedin.com/feed/'
      } else if (platform.toLowerCase() === 'instagram') {
        targetUrl = 'https://www.instagram.com/'
      }
      window.open(targetUrl, '_blank')
    } catch (err) {
      setError(language === 'en' ? `Publishing error: ${String(err)}` : `Lỗi xuất bản: ${String(err)}`)
    }
  }

  // Feedback
  async function handleSubmitFeedback(contentId: number, rating: number, notes: string) {
    try {
      await feedbackApi.create({
        content_id: contentId,
        rating,
        comment: notes
      })
      showToast(language === 'en' ? 'Saved post feedback successfully!' : 'Đã lưu đánh giá bài viết thành công!')
      setActiveModal(null)
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Error submitting feedback: ${String(err)}` : `Lỗi gửi đánh giá: ${String(err)}`)
    }
  }

  // Modal Submissions
  async function handleCreateBrand(brandData: Partial<Brand>) {
    try {
      await brandApi.create(brandData)
      showToast(
        language === 'en'
          ? `Added brand "${brandData.name}" successfully!`
          : `Đã thêm thương hiệu "${brandData.name}"!`
      )
      setActiveModal(null)
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Error creating brand: ${String(err)}` : `Lỗi tạo thương hiệu: ${String(err)}`)
    }
  }

  async function handleCreateProduct(productData: Partial<Product>) {
    try {
      await productApi.create(productData)
      showToast(
        language === 'en'
          ? `Added product "${productData.name}" successfully!`
          : `Đã thêm sản phẩm "${productData.name}"!`
      )
      setActiveModal(null)
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Error creating product: ${String(err)}` : `Lỗi tạo sản phẩm: ${String(err)}`)
    }
  }

  async function handleCreateAudience(audienceData: Partial<Audience>) {
    try {
      await audienceApi.create(audienceData)
      showToast(
        language === 'en'
          ? `Added audience "${audienceData.name}" successfully!`
          : `Đã thêm phân khúc khách hàng "${audienceData.name}"!`
      )
      setActiveModal(null)
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Error creating audience: ${String(err)}` : `Lỗi tạo phân khúc: ${String(err)}`)
    }
  }

  async function handleCreateRule(ruleData: Partial<ContentRule>) {
    try {
      await ruleApi.create(ruleData)
      showToast(
        language === 'en'
          ? `Added content rule "${ruleData.name}" successfully!`
          : `Đã thêm quy tắc "${ruleData.name}"!`
      )
      setActiveModal(null)
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Error creating rule: ${String(err)}` : `Lỗi tạo quy tắc: ${String(err)}`)
    }
  }

  async function handleCreateAsset(assetData: Partial<ProductAsset>) {
    try {
      await assetApi.create(assetData)
      showToast(
        language === 'en'
          ? 'Added media asset to vault successfully!'
          : 'Đã thêm hình ảnh vào kho tài nguyên!'
      )
      setActiveModal(null)
      await loadAllData()
    } catch (err) {
      setError(language === 'en' ? `Error adding asset: ${String(err)}` : `Lỗi thêm hình ảnh: ${String(err)}`)
    }
  }

  const currentUser = users.length > 0 ? users[0] : { full_name: 'Võ Trung Tài (Brand Owner)', role: 'BrandOwner' }

  return (
    <div className="app-shell">
      <Toast message={toast} />

      <Sidebar
        tab={tab}
        setTab={setTab}
        brands={brands}
        activeBrandId={activeBrandId}
        setActiveBrandId={setActiveBrandId}
        contentsCount={contents.length}
        brandsCount={brands.length}
        productsCount={products.length}
        audiencesCount={audiences.length}
        rulesCount={rules.length}
        assetsCount={assets.length}
        currentUser={currentUser}
      />

      <main className="main">
        <Topbar
          tab={tab}
          refreshing={refreshing}
          onRefresh={() => void loadAllData()}
          onOpenModal={modalName => setActiveModal(modalName)}
          onNavigateSettings={() => setTab('settings')}
        />

        {error && (
          <div className="toast" style={{ background: '#35161a', borderColor: '#ef4444', marginBottom: 20 }}>
            <ShieldAlert size={16} color="#ef4444" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              style={{ background: 'transparent', border: 0, color: '#aaa', cursor: 'pointer', marginLeft: 'auto' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {tab === 'studio' && (
          <ContentStudioPage
            brands={brands}
            products={products}
            contents={contents}
            audiences={audiences}
            rules={rules}
            activeBrandId={activeBrandId}
            initialProductId={studioPreset.productId}
            initialTopic={studioPreset.topic}
            initialAudienceId={studioPreset.audienceId}
            onSaveContent={handleSaveContent}
            onOpenAddAssetModal={() => setActiveModal('asset')}
            onError={msg => setError(msg)}
            onShowToast={showToast}
          />
        )}

        {tab === 'library' && (
          <ContentLibraryPage
            contents={contents}
            brands={brands}
            products={products}
            onApprove={handleApproveContent}
            onUpdateStatus={handleUpdateContentStatus}
            onOpenPublishModal={item => {
              setPublishingItem(item)
              setActiveModal('publish')
            }}
            onOpenFeedbackModal={contentId => {
              setFeedbackContentId(contentId)
              setActiveModal('feedback')
            }}
            onShowToast={showToast}
          />
        )}

        {tab === 'brands' && (
          <BrandsPage
            brands={brands}
            onSelectBrandForStudio={brandId => {
              setActiveBrandId(brandId)
              setTab('studio')
              showToast(language === 'en' ? 'Selected brand for Studio!' : 'Đã chọn thương hiệu cho Studio!')
            }}
          />
        )}

        {tab === 'products' && (
          <ProductsPage
            products={products}
            brands={brands}
            onSelectProductForStudio={product => {
              setStudioPreset(prev => ({
                ...prev,
                productId: product.id,
                topic: language === 'en'
                  ? `Introducing ${product.name} - ${product.usp || ''}`
                  : `Giới thiệu sản phẩm ${product.name} - ${product.usp || ''}`
              }))
              setTab('studio')
              showToast(
                language === 'en'
                  ? `Transferred product "${product.name}" to Studio!`
                  : `Đã chuyển sản phẩm "${product.name}" sang Studio!`
              )
            }}
          />
        )}

        {tab === 'audiences' && (
          <AudiencesPage
            audiences={audiences}
            onSelectAudienceForStudio={audience => {
              setStudioPreset(prev => ({
                ...prev,
                audienceId: audience.id
              }))
              setTab('studio')
              showToast(
                language === 'en'
                  ? `Selected audience "${audience.name}" for Studio!`
                  : `Đã chọn phân khúc "${audience.name}" cho Studio!`
              )
            }}
          />
        )}

        {tab === 'rules' && <RulesPage rules={rules} />}

        {tab === 'assets' && <AssetsPage assets={assets} products={products} />}

        {tab === 'analytics' && (
          <AnalyticsPage summary={summary} contents={contents} perfLogs={perfLogs} />
        )}

        {tab === 'settings' && <SettingsPage />}
      </main>

      {/* MODALS */}
      <BrandModal
        isOpen={activeModal === 'brand'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateBrand}
      />

      <ProductModal
        isOpen={activeModal === 'product'}
        onClose={() => setActiveModal(null)}
        brands={brands}
        defaultBrandId={activeBrandId || 1}
        onSubmit={handleCreateProduct}
      />

      <AudienceModal
        isOpen={activeModal === 'audience'}
        onClose={() => setActiveModal(null)}
        defaultBrandId={activeBrandId || 1}
        onSubmit={handleCreateAudience}
      />

      <RuleModal
        isOpen={activeModal === 'rule'}
        onClose={() => setActiveModal(null)}
        defaultBrandId={activeBrandId || 1}
        onSubmit={handleCreateRule}
      />

      <AssetModal
        isOpen={activeModal === 'asset'}
        onClose={() => setActiveModal(null)}
        products={products}
        onSubmit={handleCreateAsset}
      />

      <FeedbackModal
        isOpen={activeModal === 'feedback'}
        contentId={feedbackContentId}
        onClose={() => setActiveModal(null)}
        onSubmit={handleSubmitFeedback}
      />

      <PublishModal
        item={publishingItem}
        onClose={() => setActiveModal(null)}
        onPublishApi={handlePublishContent}
        onPublishLive={handleOpenAndPublishLive}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </ThemeProvider>
  )
}
