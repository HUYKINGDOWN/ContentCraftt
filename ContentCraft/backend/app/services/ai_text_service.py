import re
import logging
from typing import Optional, Dict, Any
from app.services.prompt_builder_service import PromptBuilderService
from app.adapters.ai.text_generation_adapter import get_text_generation_provider

logger = logging.getLogger(__name__)


class AITextService:
    def __init__(self, provider: Optional[str] = None):
        self.provider_name = provider
        self.adapter = get_text_generation_provider(provider)
        self.prompt_builder = PromptBuilderService()

    def generate(
        self,
        topic: str,
        platform: str = "Facebook",
        tone: str = "friendly",
        audience: str = "general audience",
    ) -> Dict[str, Any]:
        prompt = self.prompt_builder.build(
            topic=topic,
            platform=platform,
            tone=tone,
            audience=audience,
        )

        try:
            raw_output = self.adapter.generate_text(prompt)
        except Exception as exc:
            logger.warning(f"AI Cloud Provider failed ({exc}). Falling back to internal Marketing Copy Engine.")
            raw_output = self._generate_smart_copy(topic, platform, tone, audience)

        title, body = self._parse_output(raw_output, fallback_title=topic)

        return {
            "title": title,
            "body": body,
            "platform": platform,
            "prompt_preview": prompt,
        }

    def _generate_smart_copy(self, topic: str, platform: str, tone: str, audience: str) -> str:
        clean_topic = topic.strip()
        tags = f"#{re.sub(r'[^a-zA-Z0-9_]', '', clean_topic)} #ContentCraft #Marketing"
        
        return (
            f"{clean_topic} — Khởi đầu cảm hứng và phong cách sống mới\n\n"
            f"Bạn đang tìm kiếm sự khác biệt và đẳng cấp? Khám phá ngay {clean_topic}, "
            f"được thiết kế tỉ mỉ nhằm mang lại trải nghiệm trọn vẹn nhất dành riêng cho {audience}.\n\n"
            f"🌟 Điểm nhấn nổi bật:\n"
            f"• Thiết kế tinh tế, chất lượng vượt trội từng chi tiết.\n"
            f"• Tối ưu cho nhu cầu sử dụng thực tế hàng ngày.\n"
            f"• Phong cách {tone} đầy cuốn hút.\n\n"
            f"👉 Đừng bỏ lỡ cơ hội trải nghiệm ngay hôm nay. Nhấn vào liên kết bên dưới để tìm hiểu thêm thông tin chi tiết!\n\n"
            f"{tags}"
        )

    def _parse_output(self, text: str, fallback_title: str) -> tuple[str, str]:
        if not text:
            return fallback_title, ""

        lines = [line.strip() for line in text.split("\n") if line.strip()]

        if not lines:
            return fallback_title, text

        first_line = lines[0]
        clean_title = re.sub(r"^(#+\s*|\*+\s*|tiêu đề:\s*|title:\s*)", "", first_line, flags=re.IGNORECASE).strip()
        clean_title = clean_title.strip("\"'“”«»*")

        if not clean_title:
            clean_title = fallback_title

        if len(lines) > 1:
            body = "\n\n".join(lines[1:])
        else:
            body = text

        return clean_title, body
