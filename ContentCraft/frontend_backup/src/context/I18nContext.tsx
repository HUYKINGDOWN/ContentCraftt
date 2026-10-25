import React, { createContext, useContext, useState } from 'react'

export type Language = 'vi' | 'en'

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Nav
    'nav.workspace': 'WORKSPACE',
    'nav.studio': 'Studio Sáng Tạo AI',
    'nav.library': 'Thư viện nội dung',
    'nav.brands': 'Hồ sơ thương hiệu',
    'nav.products': 'Sản phẩm & Dịch vụ',
    'nav.audiences': 'Khách hàng mục tiêu',
    'nav.rules': 'Quy tắc nội dung',
    'nav.assets': 'Kho tài nguyên & Media',
    'nav.analytics': 'Phân tích hiệu suất',
    'nav.settings': 'Cài đặt hệ thống',
    'nav.current_brand': 'Thương hiệu hiện tại',

    // Topbar
    'topbar.sync': 'Đồng bộ lại',
    'topbar.syncing': 'Đang cập nhật...',
    'topbar.add_brand': 'Thêm thương hiệu',
    'topbar.add_product': 'Thêm sản phẩm',
    'topbar.add_audience': 'Thêm đối tượng',
    'topbar.add_rule': 'Thêm quy tắc',
    'topbar.add_asset': 'Thêm hình ảnh',

    // Titles
    'title.studio': 'AI Content & Media Studio',
    'title.library': 'Quản lý & Xuất bản nội dung',
    'title.brands': 'Hồ sơ & Giọng điệu thương hiệu',
    'title.products': 'Sản phẩm & Lợi thế cạnh tranh',
    'title.audiences': 'Đối tượng khách hàng mục tiêu',
    'title.rules': 'Quy tắc từ cấm & Cảnh báo',
    'title.assets': 'Kho hình ảnh & Thị giác AI',
    'title.analytics': 'Phân tích & Thống kê tương tác',
    'title.settings': 'Cài đặt & Tùy chọn giao diện',

    // Subtitles
    'sub.studio': 'Studio Sáng Tạo AI',
    'sub.library': 'Thư viện bài viết',
    'sub.brands': 'Quản lý thương hiệu',
    'sub.products': 'Danh mục sản phẩm',
    'sub.audiences': 'Phân khúc khách hàng',
    'sub.rules': 'Quy chuẩn nội dung',
    'sub.assets': 'Kho tài nguyên media',
    'sub.analytics': 'Báo cáo hiệu suất',
    'sub.settings': 'Cài đặt hệ thống',

    // Studio Page
    'studio.hero.tag': 'TRỢ LÝ ĐA PHƯƠNG TIỆN AI',
    'studio.hero.title': 'Tạo bản nháp truyền thông chuẩn gu thương hiệu chỉ trong tích tắc.',
    'studio.hero.desc': 'Kết hợp dữ liệu sản phẩm, chân dung khách hàng và quy tắc ngôn từ đã đồng bộ từ database để tạo nên những thông điệp sắc bén nhất.',
    'studio.hero.brands': 'Thương hiệu',
    'studio.hero.products': 'Sản phẩm',
    'studio.hero.contents': 'Bài viết',
    'studio.panel.settings': 'Thiết lập sáng tạo',
    'studio.tab.text': 'Tạo văn bản',
    'studio.tab.image': 'Sinh ảnh AI',
    'studio.tab.vision': 'Phân tích thị giác',
    'studio.form.product': 'Sản phẩm liên kết',
    'studio.form.product_none': '-- Không chọn (Bài tổng quan) --',
    'studio.form.audience': 'Khách hàng mục tiêu',
    'studio.form.audience_all': '-- Tất cả đối tượng --',
    'studio.form.rule': 'Quy tắc nội dung kiểm soát',
    'studio.form.rule_auto': '-- Tự động áp dụng quy tắc thương hiệu --',
    'studio.form.topic': 'Chủ đề hoặc ý tưởng bài viết',
    'studio.form.topic_placeholder': 'Ví dụ: Giới thiệu hương vị cà phê muối béo ngậy 24h nhân dịp tuần lễ khai trương...',
    'studio.form.platform': 'Nền tảng đăng tải',
    'studio.form.tone': 'Giọng điệu (Tone of Voice)',
    'studio.form.generate_text': 'Sinh bản nháp nội dung ngay',
    'studio.form.generating_text': 'AI đang sáng tạo nội dung...',
    'studio.image.prompt': 'Mô tả hình ảnh muốn tạo (Prompt)',
    'studio.image.prompt_placeholder': 'Mô tả bối cảnh, ánh sáng, góc chụp...',
    'studio.image.generate': 'Sinh hình ảnh AI',
    'studio.image.generating': 'Đang kết xuất hình ảnh...',
    'studio.vision.url': 'URL Hình ảnh cần phân tích',
    'studio.vision.prompt': 'Yêu cầu phân tích chi tiết',
    'studio.vision.prompt_placeholder': 'Ví dụ: Đánh giá độ tương phản, xác định màu chủ đạo và nhận diện sản phẩm...',
    'studio.vision.analyze': 'Phân tích hình ảnh ngay',
    'studio.vision.analyzing': 'Đang xử lý thị giác máy tính...',
    'studio.preview.title': 'Bản xem trước trực quan',
    'studio.preview.just_now': 'Vừa xong · 🌐',
    'studio.preview.save_approve': 'Lưu & Duyệt ngay',
    'studio.preview.save_draft': 'Lưu bản nháp',
    'studio.preview.save_to_assets': 'Lưu vào Kho tài nguyên Media',
    'studio.preview.vision_result': 'Kết quả phân tích thị giác:',
    'studio.preview.tags': 'Thẻ nhận diện (Tags):',
    'studio.preview.empty_title': 'Nội dung mẫu sẽ hiển thị tại đây',
    'studio.preview.empty_desc': 'Chọn các thông số bên trái và nhấn nút Tạo để xem trước bài đăng tương ứng trên các nền tảng.',

    // Library Page
    'library.filter.all': 'Tất cả',
    'library.filter.draft': 'Bản nháp (Draft)',
    'library.filter.approved': 'Đã duyệt (Approved)',
    'library.filter.published': 'Đã xuất bản',
    'library.platform.all': 'Tất cả nền tảng',
    'library.search_placeholder': 'Tìm kiếm nội dung...',
    'library.brand': 'Thương hiệu:',
    'library.product': 'Sản phẩm:',
    'library.content_type': 'Loại nội dung:',
    'library.btn.approve': 'Duyệt bài',
    'library.btn.publish': 'Xuất bản',
    'library.btn.publish_social': 'Xuất bản MXH',
    'library.btn.revert_draft': 'Về nháp',
    'library.btn.republish': 'Đăng lại',
    'library.empty_title': 'Không tìm thấy nội dung nào',
    'library.empty_desc': 'Hãy chuyển sang tab Studio để tạo bài viết đầu tiên của bạn!',

    // Brands Page
    'brands.voice': 'Giọng điệu (Voice):',
    'brands.values': 'Giá trị cốt lõi:',
    'brands.style': 'Giao tiếp:',
    'brands.no_desc': 'Chưa có thông tin mô tả',
    'brands.use_in_studio': 'Dùng trong Studio',

    // Products Page
    'products.active': 'Đang bán',
    'products.inactive': 'Tạm ẩn',
    'products.no_desc': 'Chưa có mô tả chi tiết.',
    'products.brand': 'Thuộc thương hiệu:',
    'products.usp': 'USP (Điểm khác biệt):',
    'products.features': 'Tính năng:',
    'products.create_post': 'Viết bài cho SP này',

    // Audiences Page
    'audiences.years_old': 'tuổi',
    'audiences.no_notes': 'Chưa có ghi chú chiến lược.',
    'audiences.interests': 'Sở thích:',
    'audiences.behaviors': 'Hành vi tiêu dùng:',
    'audiences.not_updated': 'Chưa cập nhật',
    'audiences.apply': 'Áp dụng đối tượng này',

    // Rules Page
    'rules.priority': 'Ưu tiên:',
    'rules.restricted': 'Từ ngữ cấm kỵ / Hạn chế:',
    'rules.warnings': 'Cảnh báo & Lưu ý:',
    'rules.none': 'Không có',

    // Assets Page
    'assets.image_title': 'Hình ảnh sản phẩm',
    'assets.product': 'Thuộc sản phẩm:',
    'assets.palette': 'Bảng màu (Palette):',
    'assets.tags': 'Thẻ AI (Tags):',

    // Analytics Page
    'analytics.total_contents': 'Tổng nội dung',
    'analytics.active_system': 'Đang hoạt động trên hệ thống',
    'analytics.total_reach': 'Lượt tiếp cận (Reach)',
    'analytics.vs_last_week': '+18.5% so với tuần trước',
    'analytics.total_engagement': 'Tương tác (Engagement)',
    'analytics.engagement_sub': 'Like, Comment, Share',
    'analytics.total_clicks': 'Lượt nhấp (Clicks)',
    'analytics.clicks_sub': 'Traffic chuyển đổi',
    'analytics.table_title': 'Nhật ký hiệu suất bài đăng (dbo.PostPerformanceLogs)',
    'analytics.th_content': 'Nội dung',
    'analytics.th_url': 'URL Bài viết',
    'analytics.th_reach': 'Lượt tiếp cận',
    'analytics.th_engagement': 'Lượt tương tác',
    'analytics.th_clicks': 'Lượt nhấp',
    'analytics.th_rate': 'Tỷ lệ tương tác',

    // Modals
    'modal.brand.title': 'Thêm hồ sơ thương hiệu mới',
    'modal.brand.name': 'Tên thương hiệu *',
    'modal.brand.industry': 'Ngành nghề (Industry)',
    'modal.brand.voice': 'Giọng điệu (Brand Voice)',
    'modal.brand.style': 'Phong cách giao tiếp',
    'modal.brand.values': 'Giá trị cốt lõi',
    'modal.brand.marketing': 'Định hướng marketing',
    'modal.brand.submit': 'Tạo thương hiệu',

    'modal.product.title': 'Thêm sản phẩm mới',
    'modal.product.name': 'Tên sản phẩm *',
    'modal.product.brand': 'Thương hiệu trực thuộc',
    'modal.product.category': 'Danh mục sản phẩm',
    'modal.product.usp': 'USP (Lợi thế bán hàng độc nhất)',
    'modal.product.features': 'Tính năng nổi bật',
    'modal.product.desc': 'Mô tả sản phẩm',
    'modal.product.submit': 'Tạo sản phẩm',

    'modal.audience.title': 'Thêm khách hàng mục tiêu',
    'modal.audience.name': 'Tên phân khúc *',
    'modal.audience.age_min': 'Độ tuổi từ',
    'modal.audience.age_max': 'Đến độ tuổi',
    'modal.audience.gender': 'Giới tính',
    'modal.audience.gender_all': 'Tất cả (All)',
    'modal.audience.gender_male': 'Nam',
    'modal.audience.gender_female': 'Nữ',
    'modal.audience.interests': 'Sở thích',
    'modal.audience.behaviors': 'Hành vi tiêu dùng',
    'modal.audience.submit': 'Tạo đối tượng',

    'modal.rule.title': 'Thêm quy tắc nội dung mới',
    'modal.rule.name': 'Tên danh mục quy tắc *',
    'modal.rule.restricted': 'Từ ngữ hạn chế / Cấm kỵ (cách nhau bởi dấu phẩy)',
    'modal.rule.warnings': 'Cảnh báo bắt buộc khi viết bài',
    'modal.rule.submit': 'Lưu quy tắc',

    'modal.asset.title': 'Thêm tài nguyên hình ảnh',
    'modal.asset.url': 'URL Hình ảnh *',
    'modal.asset.name': 'Tên hình ảnh',
    'modal.asset.product': 'Sản phẩm liên kết',
    'modal.asset.palette': 'Bảng màu (Mã HEX cách nhau bởi dấu phẩy)',
    'modal.asset.tags': 'Thẻ nhận diện AI (Tags)',
    'modal.asset.submit': 'Lưu vào kho',

    'modal.feedback.title': 'Đánh giá bài viết',
    'modal.feedback.rating': 'Chấm điểm chất lượng (Rating)',
    'modal.feedback.notes': 'Nhận xét chi tiết',
    'modal.feedback.submit': 'Gửi đánh giá',

    'modal.publish.title': 'Xuất bản bài viết lên MXH',
    'modal.publish.article': 'BÀI VIẾT',
    'modal.publish.platform_label': 'Chọn kênh Mạng Xã Hội xuất bản',
    'modal.publish.notice_title': 'Tùy chọn xuất bản nội dung lên',
    'modal.publish.notice_m1': 'Cách 1 (Nhanh nhất - Không cần Token): Bấm nút "Mở & Đăng thật ngay" — Hệ thống tự động sao chép bài viết và mở tab mạng xã hội để bạn dán và đăng lên trang cá nhân/Fanpage ngay lập tức.',
    'modal.publish.notice_m2': 'Cách 2 (API tự động): Bấm nút "Đăng qua API Backend" — Hệ thống sẽ gọi API đẩy bài tự động nếu bạn đã cấu hình Token Meta/Webhook trong file backend/.env.',
    'modal.publish.btn_api': 'Đăng qua API Backend',
    'modal.publish.btn_live': '🚀 Mở & Đăng thật ngay trên',

    // Settings
    'settings.title': 'Cài đặt hệ thống',
    'settings.subtitle': 'Tùy chỉnh giao diện hiển thị, ngôn ngữ và các tham số môi trường làm việc',
    'settings.theme.title': 'Giao diện hiển thị (Theme)',
    'settings.theme.desc': 'Chọn chế độ màu sắc phù hợp với không gian làm việc của bạn',
    'settings.theme.dark': 'Chế độ Tối (Dark Mode)',
    'settings.theme.light': 'Chế độ Sáng (Light Mode)',
    'settings.lang.title': 'Ngôn ngữ hiển thị (Language)',
    'settings.lang.desc': 'Chọn ngôn ngữ giao diện của hệ thống ContentCraft',
    'settings.lang.vi': 'Tiếng Việt (Vietnamese)',
    'settings.lang.en': 'English (Tiếng Anh)',
    'settings.info.title': 'Thông tin hệ thống',
    'settings.info.version': 'Phiên bản',
    'settings.info.backend': 'Địa chỉ máy chủ Backend',
    'settings.info.status': 'Trạng thái kết nối',
    'settings.info.connected': 'Đã kết nối',

    // Common
    'common.cancel': 'Hủy',
    'common.save': 'Lưu',
    'common.create': 'Tạo mới',
    'common.copied': 'Đã chép',
    'common.copy': 'Sao chép',
    'common.id': 'Mã ID',
  },
  en: {
    // Nav
    'nav.workspace': 'WORKSPACE',
    'nav.studio': 'AI Content Studio',
    'nav.library': 'Content Library',
    'nav.brands': 'Brand Profiles',
    'nav.products': 'Products & Services',
    'nav.audiences': 'Target Audiences',
    'nav.rules': 'Content Rules',
    'nav.assets': 'Media & Assets',
    'nav.analytics': 'Performance Analytics',
    'nav.settings': 'Settings',
    'nav.current_brand': 'Active Brand',

    // Topbar
    'topbar.sync': 'Sync Data',
    'topbar.syncing': 'Syncing...',
    'topbar.add_brand': 'Add Brand',
    'topbar.add_product': 'Add Product',
    'topbar.add_audience': 'Add Audience',
    'topbar.add_rule': 'Add Rule',
    'topbar.add_asset': 'Add Media',

    // Titles
    'title.studio': 'AI Content & Media Studio',
    'title.library': 'Content Management & Publishing',
    'title.brands': 'Brand Profiles & Voice Tone',
    'title.products': 'Products & Value Propositions',
    'title.audiences': 'Target Customer Personas',
    'title.rules': 'Content Rules & Blacklists',
    'title.assets': 'Media Library & AI Computer Vision',
    'title.analytics': 'Analytics & Engagement Insights',
    'title.settings': 'Settings & Preferences',

    // Subtitles
    'sub.studio': 'AI Creative Studio',
    'sub.library': 'Article Library',
    'sub.brands': 'Brand Management',
    'sub.products': 'Product Catalog',
    'sub.audiences': 'Audience Segments',
    'sub.rules': 'Content Compliance',
    'sub.assets': 'Media Assets',
    'sub.analytics': 'Performance Report',
    'sub.settings': 'System Settings',

    // Studio Page
    'studio.hero.tag': 'AI MULTI-MEDIA ASSISTANT',
    'studio.hero.title': 'Generate brand-aligned content drafts in seconds.',
    'studio.hero.desc': 'Combine product data, customer personas, and vocabulary rules from database to craft compelling messages.',
    'studio.hero.brands': 'Brands',
    'studio.hero.products': 'Products',
    'studio.hero.contents': 'Contents',
    'studio.panel.settings': 'Creative Configuration',
    'studio.tab.text': 'Text Generation',
    'studio.tab.image': 'AI Image',
    'studio.tab.vision': 'Vision Analysis',
    'studio.form.product': 'Linked Product',
    'studio.form.product_none': '-- None (General Post) --',
    'studio.form.audience': 'Target Audience',
    'studio.form.audience_all': '-- All Audiences --',
    'studio.form.rule': 'Compliance Content Rules',
    'studio.form.rule_auto': '-- Auto-apply Brand Rules --',
    'studio.form.topic': 'Topic or Content Idea',
    'studio.form.topic_placeholder': 'E.g., Launching autumn salted cream iced coffee collection with limited discounts...',
    'studio.form.platform': 'Target Platform',
    'studio.form.tone': 'Tone of Voice',
    'studio.form.generate_text': 'Generate Content Draft Now',
    'studio.form.generating_text': 'AI is generating content...',
    'studio.image.prompt': 'Image Description (Prompt)',
    'studio.image.prompt_placeholder': 'Describe scene, lighting, angle, props...',
    'studio.image.generate': 'Generate AI Image',
    'studio.image.generating': 'Rendering Image...',
    'studio.vision.url': 'Image URL to Analyze',
    'studio.vision.prompt': 'Detailed Analysis Instructions',
    'studio.vision.prompt_placeholder': 'E.g., Evaluate contrast, detect primary colors, and identify featured products...',
    'studio.vision.analyze': 'Analyze Image Now',
    'studio.vision.analyzing': 'Processing Computer Vision...',
    'studio.preview.title': 'Visual Live Preview',
    'studio.preview.just_now': 'Just now · 🌐',
    'studio.preview.save_approve': 'Save & Approve',
    'studio.preview.save_draft': 'Save Draft',
    'studio.preview.save_to_assets': 'Save to Media Assets',
    'studio.preview.vision_result': 'Computer Vision Analysis:',
    'studio.preview.tags': 'Detected Tags:',
    'studio.preview.empty_title': 'Sample preview will appear here',
    'studio.preview.empty_desc': 'Select parameters on the left and click Generate to preview posts across different platforms.',

    // Library Page
    'library.filter.all': 'All',
    'library.filter.draft': 'Drafts',
    'library.filter.approved': 'Approved',
    'library.filter.published': 'Published',
    'library.platform.all': 'All Platforms',
    'library.search_placeholder': 'Search content...',
    'library.brand': 'Brand:',
    'library.product': 'Product:',
    'library.content_type': 'Content Type:',
    'library.btn.approve': 'Approve',
    'library.btn.publish': 'Publish',
    'library.btn.publish_social': 'Publish to Social',
    'library.btn.revert_draft': 'Revert to Draft',
    'library.btn.republish': 'Republish',
    'library.empty_title': 'No content found',
    'library.empty_desc': 'Switch to the Studio tab to create your first content draft!',

    // Brands Page
    'brands.voice': 'Brand Voice:',
    'brands.values': 'Core Values:',
    'brands.style': 'Style:',
    'brands.no_desc': 'No description available',
    'brands.use_in_studio': 'Use in Studio',

    // Products Page
    'products.active': 'Active',
    'products.inactive': 'Hidden',
    'products.no_desc': 'No detailed description.',
    'products.brand': 'Brand:',
    'products.usp': 'USP (Unique Selling Point):',
    'products.features': 'Features:',
    'products.create_post': 'Write Post for This',

    // Audiences Page
    'audiences.years_old': 'y/o',
    'audiences.no_notes': 'No strategic notes.',
    'audiences.interests': 'Interests:',
    'audiences.behaviors': 'Behaviors:',
    'audiences.not_updated': 'Not updated',
    'audiences.apply': 'Apply this Persona',

    // Rules Page
    'rules.priority': 'Priority:',
    'rules.restricted': 'Restricted / Prohibited Words:',
    'rules.warnings': 'Warnings & Compliance:',
    'rules.none': 'None',

    // Assets Page
    'assets.image_title': 'Product Asset',
    'assets.product': 'Product:',
    'assets.palette': 'Color Palette:',
    'assets.tags': 'AI Tags:',

    // Analytics Page
    'analytics.total_contents': 'Total Contents',
    'analytics.active_system': 'Active in system',
    'analytics.total_reach': 'Total Reach',
    'analytics.vs_last_week': '+18.5% vs last week',
    'analytics.total_engagement': 'Total Engagement',
    'analytics.engagement_sub': 'Likes, Comments, Shares',
    'analytics.total_clicks': 'Total Clicks',
    'analytics.clicks_sub': 'Conversion Traffic',
    'analytics.table_title': 'Post Performance Logs (dbo.PostPerformanceLogs)',
    'analytics.th_content': 'Content Title',
    'analytics.th_url': 'Post URL',
    'analytics.th_reach': 'Reach',
    'analytics.th_engagement': 'Engagement',
    'analytics.th_clicks': 'Clicks',
    'analytics.th_rate': 'Engagement Rate',

    // Modals
    'modal.brand.title': 'Add New Brand Profile',
    'modal.brand.name': 'Brand Name *',
    'modal.brand.industry': 'Industry',
    'modal.brand.voice': 'Brand Voice',
    'modal.brand.style': 'Communication Style',
    'modal.brand.values': 'Core Values',
    'modal.brand.marketing': 'Marketing Preferences',
    'modal.brand.submit': 'Create Brand',

    'modal.product.title': 'Add New Product',
    'modal.product.name': 'Product Name *',
    'modal.product.brand': 'Parent Brand',
    'modal.product.category': 'Category Name',
    'modal.product.usp': 'USP (Unique Selling Proposition)',
    'modal.product.features': 'Key Features',
    'modal.product.desc': 'Product Description',
    'modal.product.submit': 'Create Product',

    'modal.audience.title': 'Add Target Audience',
    'modal.audience.name': 'Segment Name *',
    'modal.audience.age_min': 'Min Age',
    'modal.audience.age_max': 'Max Age',
    'modal.audience.gender': 'Gender',
    'modal.audience.gender_all': 'All',
    'modal.audience.gender_male': 'Male',
    'modal.audience.gender_female': 'Female',
    'modal.audience.interests': 'Interests',
    'modal.audience.behaviors': 'Behaviors',
    'modal.audience.submit': 'Create Audience',

    'modal.rule.title': 'Add Content Rule',
    'modal.rule.name': 'Rule Name *',
    'modal.rule.restricted': 'Restricted / Prohibited Words (comma separated)',
    'modal.rule.warnings': 'Mandatory Warning & Compliance Notes',
    'modal.rule.submit': 'Save Rule',

    'modal.asset.title': 'Add Media Asset',
    'modal.asset.url': 'Image URL *',
    'modal.asset.name': 'Image Name',
    'modal.asset.product': 'Linked Product',
    'modal.asset.palette': 'Color Palette (HEX codes comma separated)',
    'modal.asset.tags': 'AI Extracted Tags',
    'modal.asset.submit': 'Save to Media Vault',

    'modal.feedback.title': 'Review Post',
    'modal.feedback.rating': 'Quality Rating',
    'modal.feedback.notes': 'Detailed Comments',
    'modal.feedback.submit': 'Submit Feedback',

    'modal.publish.title': 'Publish Post to Social Media',
    'modal.publish.article': 'POST',
    'modal.publish.platform_label': 'Select Social Media Platform',
    'modal.publish.notice_title': 'Publishing options for',
    'modal.publish.notice_m1': 'Method 1 (Fastest - No Token Needed): Click "Open & Publish Live" — The system automatically copies content and opens the social media upload tab for you to paste and publish immediately.',
    'modal.publish.notice_m2': 'Method 2 (Automated API): Click "Publish via Backend API" — System triggers API to push automatically if Meta/Webhook tokens are configured in backend/.env.',
    'modal.publish.btn_api': 'Publish via Backend API',
    'modal.publish.btn_live': '🚀 Open & Publish Live on',

    // Settings
    'settings.title': 'System Settings',
    'settings.subtitle': 'Customize visual appearance, interface language, and workspace configuration',
    'settings.theme.title': 'Interface Theme',
    'settings.theme.desc': 'Select your preferred visual mode for your workspace',
    'settings.theme.dark': 'Dark Mode',
    'settings.theme.light': 'Light Mode',
    'settings.lang.title': 'Display Language',
    'settings.lang.desc': 'Select the application interface language',
    'settings.lang.vi': 'Tiếng Việt (Vietnamese)',
    'settings.lang.en': 'English',
    'settings.info.title': 'System Information',
    'settings.info.version': 'Version',
    'settings.info.backend': 'Backend Server API',
    'settings.info.status': 'Connection Status',
    'settings.info.connected': 'Connected',

    // Common
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.create': 'Create',
    'common.copied': 'Copied',
    'common.copy': 'Copy',
    'common.id': 'ID',
  }
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
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

  const t = (key: string): string => {
    return translations[language][key] || translations['vi'][key] || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within I18nProvider')
  return context
}
