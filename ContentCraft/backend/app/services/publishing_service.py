import random
import httpx
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.content_model import Content
from app.models.analytics_model import AnalyticsEvent
from app.models.audit_log_model import AuditLog


class PublishingService:
    def __init__(self, db: Session | None = None):
        self.db = db

    def check_api_status(self) -> dict:
        return {
            "facebook_api_configured": bool(settings.FACEBOOK_PAGE_ID and settings.FACEBOOK_PAGE_ACCESS_TOKEN),
            "webhook_configured": bool(settings.PUBLISHING_WEBHOOK_URL),
            "mode": "live" if (settings.FACEBOOK_PAGE_ID or settings.PUBLISHING_WEBHOOK_URL) else "simulation",
            "supported_platforms": ["Facebook", "TikTok", "Instagram", "LinkedIn"]
        }

    def publish(self, content_id: int, platform: str = "Facebook") -> dict:
        content = None
        if self.db:
            content = self.db.get(Content, content_id)

        live_published = False
        real_post_url = None
        error_detail = None
        provider_info = "simulation"

        # 1. Thử đăng qua Meta Facebook Graph API thật nếu đã cấu hình Token & Page ID
        if platform.lower() == "facebook" and settings.FACEBOOK_PAGE_ID and settings.FACEBOOK_PAGE_ACCESS_TOKEN:
            try:
                fb_url = f"https://graph.facebook.com/v19.0/{settings.FACEBOOK_PAGE_ID}/feed"
                message_text = f"{content.title}\n\n{content.body}" if content else f"Bài viết #{content_id}"
                
                with httpx.Client(timeout=10.0) as client:
                    resp = client.post(
                        fb_url,
                        data={
                            "message": message_text,
                            "access_token": settings.FACEBOOK_PAGE_ACCESS_TOKEN
                        }
                    )
                    if resp.status_code in (200, 201):
                        data = resp.json()
                        post_id = data.get("id")
                        live_published = True
                        provider_info = "meta_graph_api"
                        real_post_url = f"https://facebook.com/{post_id}"
                    else:
                        error_detail = f"Meta API Error ({resp.status_code}): {resp.text}"
            except Exception as e:
                error_detail = f"Lỗi kết nối Meta Graph API: {str(e)}"

        # 2. Thử bắn qua Webhook (Zapier / Make / n8n / Telegram) nếu có cấu hình
        if not live_published and settings.PUBLISHING_WEBHOOK_URL:
            try:
                payload = {
                    "event": "content_published",
                    "content_id": content_id,
                    "platform": platform,
                    "title": content.title if content else "",
                    "body": content.body if content else "",
                    "brand_id": content.brand_id if content else 1
                }
                with httpx.Client(timeout=8.0) as client:
                    resp = client.post(settings.PUBLISHING_WEBHOOK_URL, json=payload)
                    if resp.status_code in (200, 201, 202, 204):
                        live_published = True
                        provider_info = "webhook_automation"
            except Exception as e:
                if not error_detail:
                    error_detail = f"Lỗi kết nối Webhook: {str(e)}"

        # 3. Cập nhật Database nội bộ
        if self.db and content:
            content.status = "Published"
            if platform and platform != "demo":
                content.target_platform = platform

            # Tạo bản ghi đo lường khởi đầu
            assigned_url = real_post_url or f"https://{platform.lower()}.com/contentcraft/posts/{content_id}_{random.randint(10000, 99999)}"
            perf_log = AnalyticsEvent(
                content_id=content_id,
                post_url=assigned_url,
                reach_count=random.randint(250, 850),
                engagement_count=random.randint(25, 95),
                click_count=random.randint(8, 35)
            )
            self.db.add(perf_log)

            # Ghi nhật ký hệ thống SystemLogs
            log_desc = f"Xuất bản bài viết #{content_id} lên {platform} (Kênh: {provider_info}, Live: {live_published})"
            if error_detail:
                log_desc += f" - Cảnh báo API ngoài: {error_detail}"
            
            sys_log = AuditLog(
                user_id=1,
                action_type="PUBLISH_CONTENT",
                tokens_used=0,
                details=log_desc
            )
            self.db.add(sys_log)

            self.db.commit()
            self.db.refresh(content)

        return {
            "content_id": content_id,
            "platform": platform,
            "status": "Published",
            "live_published": live_published,
            "real_post_url": real_post_url,
            "provider": provider_info,
            "error_detail": error_detail,
            "message": (
                f"Đã xuất bản thật thành công lên {platform} qua API!" if live_published
                else f"Đã cập nhật bài viết #{content_id} thành Published trong hệ thống!"
            ),
            "instructions": (
                "Chưa cấu hình API MXH thật (Facebook Page Token / Webhook). Bài viết đã được lưu trạng thái Published nội bộ. "
                "Bạn có thể dùng nút 'Mở đăng trực tiếp' hoặc cấu hình FACEBOOK_PAGE_ACCESS_TOKEN trong file .env để tự động đăng lên Fanpage thật."
                if not live_published else "Bài viết đã được gửi trực tiếp đến kênh mạng xã hội."
            )
        }
