import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'vi' | 'en'

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Navigation
    'nav.dashboard': 'Bảng điều khiển',
    'nav.brands': 'Thương hiệu',
    'nav.products': 'Sản phẩm',
    'nav.audiences': 'Khách hàng mục tiêu',
    'nav.contentStudio': 'AI Content Studio',
    'nav.imageStudio': 'Image Studio',
    'nav.history': 'Lịch sử nội dung',
    'nav.analytics': 'Phân tích & Thống kê',
    'nav.admin': 'Quản trị hệ thống',
    'nav.settings': 'Cài đặt hệ thống',
    'nav.workspace': 'Không gian làm việc',

    // Header & Actions
    'header.demo': 'Không gian làm việc',
    'header.theme.dark': 'Chế độ tối',
    'header.theme.light': 'Chế độ sáng',
    'header.lang': 'Ngôn ngữ',
    'header.notifications': 'Thông báo hoạt động',
    'header.profile': 'Tài khoản',
    'header.logout': 'Đăng xuất',
    'header.activity': 'Hoạt động gần đây',
    'header.accountSummary': 'Tóm tắt tài khoản',

    // Common Buttons & Actions
    'btn.newBrand': 'Thêm thương hiệu',
    'btn.newProduct': 'Thêm sản phẩm',
    'btn.newAudience': 'Thêm đối tượng',
    'btn.generate': 'Sinh nội dung AI',
    'btn.generating': 'Đang sinh nội dung...',
    'btn.saveDraft': 'Lưu bản nháp',
    'btn.approve': 'Duyệt bài viết',
    'btn.publishSocial': 'Đăng bài lên MXH',
    'btn.publishing': 'Đang đăng...',
    'btn.copy': 'Sao chép',
    'btn.copied': 'Đã sao chép!',
    'btn.filter': 'Bộ lọc',
    'btn.search': 'Tìm kiếm...',
    'btn.export': 'Xuất CSV',
    'btn.cancel': 'Hủy bỏ',
    'btn.save': 'Lưu thay đổi',
    'btn.delete': 'Xóa',
    'btn.close': 'Đóng',
    'btn.view': 'Xem chi tiết',
    'btn.edit': 'Chỉnh sửa',
    'btn.reload': 'Tải lại',
    'btn.back': 'Quay lại',
    'btn.startFree': 'Bắt đầu miễn phí',
    'btn.signIn': 'Đăng nhập',
    'btn.createAccount': 'Đăng ký tài khoản',
    'btn.resetDemo': 'Đặt lại dữ liệu mẫu',
    'btn.syncBackend': 'Đồng bộ từ Database',
    'btn.clearCache': 'Xóa bộ nhớ đệm',

    // Statuses
    'status.draft': 'Bản nháp',
    'status.in_review': 'Đang duyệt',
    'status.approved': 'Đã duyệt',
    'status.published': 'Đã xuất bản',
    'status.active': 'Hoạt động',
    'status.all': 'Tất cả trạng thái',

    // Dashboard Overview
    'dash.welcome': 'Chào mừng quay trở lại, ContentCraft Team',
    'dash.subtitle': 'Tổng quan không gian làm việc và hoạt động AI gần nhất của bạn.',
    'dash.quickActions': 'Hành động nhanh',
    'dash.quickDesc': 'Tạo nội dung mới, thêm sản phẩm hoặc quản lý ngữ cảnh thương hiệu.',
    'dash.generateContent': 'Tạo nội dung AI',
    'dash.addProduct': 'Thêm sản phẩm',
    'dash.addBrand': 'Thêm thương hiệu',
    'dash.recentActivity': 'Nội dung gần đây',
    'dash.systemHealth': 'Tình trạng hệ thống',
    'dash.activeDb': 'Cơ sở dữ liệu đang kết nối',
    'dash.aiEngine': 'Công cụ AI sẵn sàng',

    // Content Studio
    'studio.title': 'AI Content Studio',
    'studio.desc': 'Tạo nội dung marketing đa kênh chuẩn phong cách thương hiệu.',
    'studio.selectBrand': 'Chọn thương hiệu',
    'studio.selectProduct': 'Chọn sản phẩm',
    'studio.selectAudience': 'Khách hàng mục tiêu',
    'studio.channel': 'Kênh đăng bài',
    'studio.tone': 'Giọng điệu',
    'studio.brief': 'Yêu cầu thêm / Ý tưởng chiến dịch',
    'studio.language': 'Ngôn ngữ đầu ra',
    'studio.preview': 'Xem trước nội dung',
    'studio.placeholder': 'Nội dung do AI tạo sẽ xuất hiện tại đây...',
    'studio.readyNotice': 'Bản nháp đã sẵn sàng. Bạn có thể chỉnh sửa trực tiếp hoặc lưu lại.',

    // Image Studio
    'imageStudio.title': 'Image Studio',
    'imageStudio.desc': 'Tạo hình ảnh và minh họa trực quan chuyên nghiệp cho chiến dịch.',
    'imageStudio.prompt': 'Mô tả hình ảnh (Prompt)',
    'imageStudio.style': 'Phong cách thị giác',
    'imageStudio.ratio': 'Tỷ lệ khung hình',
    'imageStudio.generate': 'Sinh hình ảnh AI',
    'imageStudio.generating': 'Đang vẽ hình ảnh...',
    'imageStudio.download': 'Tải xuống',
    'imageStudio.fullscreen': 'Xem toàn màn hình',

    // Entity Pages (Brands, Products, Audiences)
    'products.title': 'Danh mục sản phẩm',
    'products.desc': 'Quản lý thông tin sản phẩm và tính năng nổi bật để đưa vào ngữ cảnh AI.',
    'products.new': 'Thêm sản phẩm mới',
    'products.search': 'Tìm kiếm sản phẩm...',
    'products.name': 'Tên sản phẩm',
    'products.category': 'Danh mục',
    'products.usp': 'Điểm bán hàng độc nhất (USP)',
    'products.features': 'Tính năng chính',
    'products.activeConfigured': 'sản phẩm đang hoạt động',
    'products.gridView': 'Lưới thẻ',
    'products.tableView': 'Bảng chi tiết',
    'products.quickGenerate': 'Tạo nội dung AI',
    'products.edit': 'Chỉnh sửa',
    'products.price': 'Giá niêm yết',
    'products.featuresLabel': 'Đặc điểm USP',
    'imageStudio.aspectRatio': 'Tỷ lệ khung hình',
    'imageStudio.stylePresets': 'Bộ phong cách thị giác',
    'imageStudio.enhance': '✨ Tối ưu Prompt (AI Enhancer)',
    'imageStudio.enhanced': 'Đã thêm tham số ánh sáng, góc chụp và chi tiết chuẩn vào prompt!',
    'imageStudio.alreadyEnhanced': 'Prompt đã có đầy đủ tham số tối ưu.',
    'imageStudio.copiedPrompt': 'Đã sao chép prompt vào bộ nhớ tạm!',
    'imageStudio.copyPrompt': 'Sao chép Prompt',
    'imageStudio.resBadge': '4K UHD • Chuẩn Studio',
    'settings.db.sqlTitle': 'Chẩn đoán kết nối Microsoft SQL Server',
    'settings.db.sqlDesc': 'Theo dõi trạng thái kết nối trực tiếp từ FastAPI Backend tới ContentCraftDB.',
    'settings.db.instance': 'Máy chủ / Phân vùng SQL',
    'settings.db.database': 'Cơ sở dữ liệu đích',
    'settings.db.driver': 'Trình điều khiển ODBC',
    'settings.db.latency': 'Độ trễ phản hồi',
    'settings.db.pingBtn': 'Kiểm tra độ trễ (Ping Test)',
    'settings.db.pingSuccess': 'Kết nối SQL Server ổn định! Độ trễ:',
    'admin.desc': 'Quản lý thành viên, vai trò, hạn ngạch sử dụng và nhật ký hệ thống.',

    'brands.title': 'Hồ sơ thương hiệu',
    'brands.desc': 'Định hình giọng điệu, giá trị cốt lõi và phong cách của thương hiệu.',
    'brands.new': 'Thêm thương hiệu mới',
    'brands.search': 'Tìm kiếm thương hiệu...',
    'brands.name': 'Tên thương hiệu',
    'brands.voice': 'Giọng điệu thương hiệu',
    'brands.industry': 'Ngành hàng',
    'brands.audience': 'Khách hàng trọng tâm',

    'audiences.title': 'Chân dung khách hàng',
    'audiences.desc': 'Xác định chân dung và hành vi khách hàng để tối ưu hóa hiệu quả nội dung.',
    'audiences.new': 'Thêm đối tượng mới',
    'audiences.search': 'Tìm kiếm đối tượng...',
    'audiences.name': 'Tên nhóm đối tượng',
    'audiences.age': 'Độ tuổi',
    'audiences.location': 'Khu vực / Nền tảng',
    'audiences.interests': 'Sở thích & Hành vi',

    // Content History
    'history.title': 'Lịch sử nội dung',
    'history.desc': 'Toàn bộ nội dung đã tạo, chỉnh sửa và xuất bản trên các kênh.',
    'history.search': 'Tìm theo tiêu đề hoặc nội dung...',
    'history.table.title': 'Tiêu đề nội dung',
    'history.table.channel': 'Kênh',
    'history.table.status': 'Trạng thái',
    'history.table.created': 'Thời gian tạo',
    'history.table.actions': 'Thao tác',

    // Analytics
    'analytics.title': 'Báo cáo & Phân tích',
    'analytics.desc': 'Theo dõi hiệu suất tiếp cận và tương tác của các chiến dịch nội dung.',
    'analytics.period': 'Khoảng thời gian',
    'analytics.reach': 'Lượt tiếp cận ước tính',
    'analytics.engagement': 'Lượt tương tác',
    'analytics.rating': 'Điểm đánh giá trung bình',
    'analytics.approvedRatio': 'Tỷ lệ bài viết đã duyệt',

    // Settings Page
    'settings.title': 'Cài đặt hệ thống & Tùy chọn',
    'settings.desc': 'Tùy chỉnh giao diện, cấu hình AI Engine, kết nối mạng xã hội và quản lý dữ liệu.',
    'settings.tab.interface': 'Giao diện & Ngôn ngữ',
    'settings.tab.ai': 'Cấu hình Trí tuệ Nhân tạo',
    'settings.tab.publishing': 'Kênh Mạng xã hội',
    'settings.tab.data': 'Quản lý Dữ liệu',
    'settings.tab.account': 'Tài khoản & Phiên làm việc',

    'settings.theme.title': 'Chủ đề hiển thị',
    'settings.theme.desc': 'Lựa chọn giao diện sáng hoặc tối phù hợp với mắt bạn.',
    'settings.theme.light': 'Giao diện Sáng (Light Mode)',
    'settings.theme.dark': 'Giao diện Tối (Dark Mode)',
    'settings.lang.title': 'Ngôn ngữ giao diện',
    'settings.lang.desc': 'Chọn ngôn ngữ hiển thị trên toàn bộ trang web.',
    'settings.ai.provider': 'Nhà cung cấp AI (Provider)',
    'settings.ai.model': 'Mô hình mặc định (Default Model)',
    'settings.ai.status': 'Trạng thái AI Backend',
    'settings.data.title': 'Đồng bộ hóa & Dữ liệu bộ nhớ',
    'settings.data.desc': 'Quản lý kho dữ liệu giữa trình duyệt và FastAPI database.',

    // Publishing
    'publish.dialog.title': 'Đăng bài tự động lên Mạng xã hội',
    'publish.dialog.desc': 'Xuất bản trực tiếp bài viết lên các nền tảng mạng xã hội đã liên kết.',
    'publish.platform': 'Chọn nền tảng xuất bản',
    'publish.btn.live': 'Đăng bài ngay',
    'publish.success.live': 'Đã xuất bản LIVE thành công qua API!',
    'publish.success.manual': 'Đã sao chép nội dung và mở trang đăng bài! Nhấn Ctrl+V để đăng ngay.',

    // Public / Marketing
    'mkt.features': 'Tính năng',
    'mkt.integrations': 'Tích hợp',
    'mkt.builtFor': 'Dành cho ai',
    'mkt.resources': 'Tài nguyên',
    'mkt.pricing': 'Bảng giá',
    'mkt.heroTitle': 'Nền tảng sáng tạo nội dung AI chuẩn phong cách thương hiệu',
    'mkt.heroDesc': 'Tự động hóa quy trình viết bài, tạo hình ảnh và xuất bản đa kênh nhanh chóng với ContentCraft.',

    // Metrics & KPI
    'metrics.brands': 'Thương hiệu quản lý',
    'metrics.managed': 'thương hiệu',
    'metrics.readyCampaign': 'Sẵn sàng chiến dịch',
    'metrics.products': 'Danh mục sản phẩm',
    'metrics.items': 'sản phẩm',
    'metrics.syncedDb': 'Đồng bộ SQL Server',
    'metrics.audiences': 'Chân dung khách hàng',
    'metrics.segments': 'phân khúc',
    'metrics.profiles': 'Hồ sơ mục tiêu',
    'metrics.assets': 'Nội dung đã tạo',
    'metrics.approved': 'đã duyệt',
    'metrics.inReview': 'bản nháp đang duyệt',
    'dash.viewAll': 'Xem tất cả',
    'dash.recentSubtitle': 'Xem lại các bản nháp và phiên bản đã duyệt mới nhất.',
    'dash.proTipTitle': 'Mẹo tối ưu chiến dịch',
    'dash.proTipText': 'Định nghĩa Chân dung khách hàng trước khi sinh nội dung để bản nháp đạt tỷ lệ tương tác cao nhất.',
    'dash.noContentTitle': 'Khởi đầu ý tưởng tuyệt vời tại đây',
    'dash.noContentDesc': 'Tạo bản nháp đầu tiên để theo dõi tiến độ công việc của bạn.',
    'dash.createDraft': 'Tạo bản nháp mới',

    // Studio details
    'studio.label': 'Công cụ sinh nội dung AI',
    'studio.configTitle': 'Cấu hình bản nháp',
    'studio.promptEngine': 'Prompt Engine',
    'studio.contentType': 'Loại nội dung',
    'studio.briefTone': 'Yêu cầu chiến dịch & Giọng điệu',
    'studio.tags': 'Thẻ phân loại',
    'studio.humanReviewNotice': 'Cần kiểm tra kỹ thông tin sản phẩm và quy chuẩn thương hiệu trước khi phê duyệt hoặc xuất bản.',
    'studio.proposedCopy': 'Nội dung đề xuất',
    'studio.words': 'từ',
    'studio.chars': 'ký tự',
    'studio.finishEdit': 'Hoàn tất chỉnh sửa',
    'studio.editDraft': 'Chỉnh sửa bản nháp',

    // Image Studio
    'imageStudio.label': 'Phòng thiết kế hình ảnh',
    'imageStudio.configTitle': 'Cấu hình hình ảnh',
    'imageStudio.reference': 'Ảnh tham chiếu (Tùy chọn)',
    'imageStudio.uploadHint': 'Kéo thả hoặc tải lên ảnh PNG, JPG hoặc WebP (tối đa 10 MB).',
    'imageStudio.preview': 'Xem trước hình ảnh',

  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.brands': 'Brands',
    'nav.products': 'Products',
    'nav.audiences': 'Target Customers',
    'nav.contentStudio': 'AI Content Studio',
    'nav.imageStudio': 'Image Studio',
    'nav.history': 'Content History',
    'nav.analytics': 'Analytics',
    'nav.admin': 'Administration',
    'nav.settings': 'System Settings',
    'nav.workspace': 'Workspace',

    // Header & Actions
    'header.demo': 'Workspace',
    'header.theme.dark': 'Dark Mode',
    'header.theme.light': 'Light Mode',
    'header.lang': 'Language',
    'header.notifications': 'Activity Notifications',
    'header.profile': 'Account',
    'header.logout': 'Sign out',
    'header.activity': 'Recent Activity',
    'header.accountSummary': 'Account Summary',

    // Common Buttons & Actions
    'btn.newBrand': 'New brand',
    'btn.newProduct': 'New product',
    'btn.newAudience': 'New audience',
    'btn.generate': 'Generate with AI',
    'btn.generating': 'Generating...',
    'btn.saveDraft': 'Save draft',
    'btn.approve': 'Approve post',
    'btn.publishSocial': 'Publish to Social',
    'btn.publishing': 'Publishing...',
    'btn.copy': 'Copy',
    'btn.copied': 'Copied!',
    'btn.filter': 'Filter',
    'btn.search': 'Search...',
    'btn.export': 'Export CSV',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save changes',
    'btn.delete': 'Delete',
    'btn.close': 'Close',
    'btn.view': 'View details',
    'btn.edit': 'Edit',
    'btn.reload': 'Reload',
    'btn.back': 'Back',
    'btn.startFree': 'Start free',
    'btn.signIn': 'Sign in',
    'btn.createAccount': 'Create account',
    'btn.resetDemo': 'Reset demo data',
    'btn.syncBackend': 'Sync from Database',
    'btn.clearCache': 'Clear cache',

    // Statuses
    'status.draft': 'Draft',
    'status.in_review': 'In review',
    'status.approved': 'Approved',
    'status.published': 'Published',
    'status.active': 'Active',
    'status.all': 'All statuses',

    // Dashboard Overview
    'dash.welcome': 'Welcome back, ContentCraft Team',
    'dash.subtitle': 'Your workspace overview and recent AI activity.',
    'dash.quickActions': 'Quick actions',
    'dash.quickDesc': 'Create a new draft, upload product images, or update reusable brand context.',
    'dash.generateContent': 'Generate content',
    'dash.addProduct': 'Add product',
    'dash.addBrand': 'Add brand',
    'dash.recentActivity': 'Recent content',
    'dash.systemHealth': 'System status',
    'dash.activeDb': 'Database connected',
    'dash.aiEngine': 'AI Engine operational',

    // Content Studio
    'studio.title': 'AI Content Studio',
    'studio.desc': 'Generate brand-aligned marketing copy across all digital channels.',
    'studio.selectBrand': 'Select Brand',
    'studio.selectProduct': 'Select Product',
    'studio.selectAudience': 'Target Audience',
    'studio.channel': 'Publishing Channel',
    'studio.tone': 'Tone of Voice',
    'studio.brief': 'Brief / Campaign Direction',
    'studio.language': 'Output Language',
    'studio.preview': 'Content Preview',
    'studio.placeholder': 'AI generated content will appear here...',
    'studio.readyNotice': 'Draft is ready. Review, edit directly, or save to your workspace.',

    // Image Studio
    'imageStudio.title': 'Image Studio',
    'imageStudio.desc': 'Generate high-impact visuals and illustrations tailored for your brand.',
    'imageStudio.prompt': 'Image description (Prompt)',
    'imageStudio.style': 'Visual style',
    'imageStudio.ratio': 'Aspect ratio',
    'imageStudio.generate': 'Generate visual',
    'imageStudio.generating': 'Generating image...',
    'imageStudio.download': 'Download',
    'imageStudio.fullscreen': 'Fullscreen',

    // Entity Pages (Brands, Products, Audiences)
    'products.title': 'Products catalog',
    'products.desc': 'Maintain detailed product definitions and key features for AI context.',
    'products.new': 'New product',
    'products.search': 'Search products...',
    'products.name': 'Product name',
    'products.category': 'Category',
    'products.usp': 'Unique Selling Proposition (USP)',
    'products.features': 'Key features',
    'products.activeConfigured': 'active products configured',
    'products.gridView': 'Card Grid',
    'products.tableView': 'Data Table',
    'products.quickGenerate': 'Generate AI Content',
    'products.edit': 'Edit',
    'products.price': 'Price',
    'products.featuresLabel': 'Key USPs',
    'imageStudio.aspectRatio': 'Aspect Ratio',
    'imageStudio.stylePresets': 'Visual Style Presets',
    'imageStudio.enhance': '✨ Enhance Prompt (Pro Tokens)',
    'imageStudio.enhanced': 'Added professional lighting, camera lens, and render parameters to prompt!',
    'imageStudio.alreadyEnhanced': 'Prompt already contains optimized parameters.',
    'imageStudio.copiedPrompt': 'Copied prompt to clipboard!',
    'imageStudio.copyPrompt': 'Copy Prompt',
    'imageStudio.resBadge': '4K UHD • Studio Grade',
    'settings.db.sqlTitle': 'Microsoft SQL Server Connection Diagnostics',
    'settings.db.sqlDesc': 'Live operational telemetry from FastAPI Backend to local ContentCraftDB.',
    'settings.db.instance': 'SQL Server Instance',
    'settings.db.database': 'Target Database',
    'settings.db.driver': 'ODBC Driver',
    'settings.db.latency': 'Round-trip Latency',
    'settings.db.pingBtn': 'Test Ping Latency',
    'settings.db.pingSuccess': 'SQL Server connection active! Latency:',
    'admin.desc': 'Manage users, roles, usage limits and protected operational records.',

    'brands.title': 'Brand profiles',
    'brands.desc': 'Define voice, core values, and communication standards for your brand.',
    'brands.new': 'New brand',
    'brands.search': 'Search brands...',
    'brands.name': 'Brand name',
    'brands.voice': 'Brand voice',
    'brands.industry': 'Industry',
    'brands.audience': 'Target audience',

    'audiences.title': 'Target personas',
    'audiences.desc': 'Define audience demographics and behaviors to tune AI messaging.',
    'audiences.new': 'New audience',
    'audiences.search': 'Search audiences...',
    'audiences.name': 'Persona name',
    'audiences.age': 'Age bracket',
    'audiences.location': 'Platform / Region',
    'audiences.interests': 'Interests & behaviors',

    // Content History
    'history.title': 'Content history',
    'history.desc': 'All content drafts, versions, and published pieces across your workspace.',
    'history.search': 'Search by title or body...',
    'history.table.title': 'Content title',
    'history.table.channel': 'Channel',
    'history.table.status': 'Status',
    'history.table.created': 'Created date',
    'history.table.actions': 'Actions',

    // Analytics
    'analytics.title': 'Analytics & Reports',
    'analytics.desc': 'Monitor campaign reach, engagement rates, and content approval velocity.',
    'analytics.period': 'Time period',
    'analytics.reach': 'Tracked reach',
    'analytics.engagement': 'Engagements',
    'analytics.rating': 'Average rating',
    'analytics.approvedRatio': 'Approved ratio',

    // Settings Page
    'settings.title': 'System Settings & Preferences',
    'settings.desc': 'Customize interface, configure AI engines, social channels, and workspace data.',
    'settings.tab.interface': 'Interface & Language',
    'settings.tab.ai': 'AI Configuration',
    'settings.tab.publishing': 'Social Publishing',
    'settings.tab.data': 'Data Management',
    'settings.tab.account': 'Account & Session',

    'settings.theme.title': 'Appearance theme',
    'settings.theme.desc': 'Select between light or dark interface styling.',
    'settings.theme.light': 'Light Mode',
    'settings.theme.dark': 'Dark Mode',
    'settings.lang.title': 'Interface language',
    'settings.lang.desc': 'Choose the primary language for the application.',
    'settings.ai.provider': 'AI Provider',
    'settings.ai.model': 'Default Model',
    'settings.ai.status': 'Backend AI Status',
    'settings.data.title': 'Synchronization & Local Storage',
    'settings.data.desc': 'Manage synchronization between browser and FastAPI database.',

    // Publishing
    'publish.dialog.title': 'Auto-Publish to Social Media',
    'publish.dialog.desc': 'Publish your approved content directly to connected social platforms.',
    'publish.platform': 'Select publishing platform',
    'publish.btn.live': 'Publish Now',
    'publish.success.live': 'Successfully published LIVE to social media via API!',
    'publish.success.manual': 'Content copied & social portal opened! Press Ctrl+V to publish.',

    // Public / Marketing
    'mkt.features': 'Features',
    'mkt.integrations': 'Integrations',
    'mkt.builtFor': 'Built For',
    'mkt.resources': 'Resources',
    'mkt.pricing': 'Pricing',
    'mkt.heroTitle': 'Brand-aligned AI content creation platform',
    'mkt.heroDesc': 'Automate copy generation, visual asset production, and multi-channel publishing with ContentCraft.',

    // Metrics & KPI
    'metrics.brands': 'Active Brands',
    'metrics.managed': 'managed',
    'metrics.readyCampaign': 'Ready for campaign',
    'metrics.products': 'Product Catalog',
    'metrics.items': 'items',
    'metrics.syncedDb': 'Synced with DB',
    'metrics.audiences': 'Target Personas',
    'metrics.segments': 'segments',
    'metrics.profiles': 'Audience profiles',
    'metrics.assets': 'Generated Assets',
    'metrics.approved': 'approved',
    'metrics.inReview': 'drafts in review',
    'dash.viewAll': 'View all',
    'dash.recentSubtitle': 'Review latest drafts and approved versions.',
    'dash.proTipTitle': 'Pro-tip for your next campaign',
    'dash.proTipText': 'Define Target Personas under Target Customers before generating to make every draft more relevant.',
    'dash.noContentTitle': 'Your first great idea starts here',
    'dash.noContentDesc': 'Generate a draft to see your recent work.',
    'dash.createDraft': 'Create a draft',

    // Studio details
    'studio.label': 'Generative Copy Engine',
    'studio.configTitle': 'Draft Configuration',
    'studio.promptEngine': 'AI Prompt Engine',
    'studio.contentType': 'Content type',
    'studio.briefTone': 'Campaign brief & tone',
    'studio.tags': 'Tags',
    'studio.humanReviewNotice': 'Human review required before approval or publishing. Verify product claims against your brand guidelines.',
    'studio.proposedCopy': 'Proposed copy',
    'studio.words': 'words',
    'studio.chars': 'chars',
    'studio.finishEdit': 'Finish editing',
    'studio.editDraft': 'Edit draft',

    // Image Studio
    'imageStudio.label': 'Visual Asset Studio',
    'imageStudio.configTitle': 'Image Configuration',
    'imageStudio.reference': 'Reference Image (Optional)',
    'imageStudio.uploadHint': 'Drop or upload a PNG, JPG or WebP image (max 10 MB).',
    'imageStudio.preview': 'Visual Preview',

  },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('contentcraft_lang') as Language
    return saved === 'en' || saved === 'vi' ? saved : 'vi'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('contentcraft_lang', lang)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi')
  }

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || fallback || key
  }

  useEffect(() => {
    document.documentElement.setAttribute('lang', language)
  }, [language])

  return (
    <I18nContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
