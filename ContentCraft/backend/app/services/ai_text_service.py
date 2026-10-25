import re
from typing import Optional, Dict, Any
from app.services.prompt_builder_service import PromptBuilderService
from app.adapters.ai.text_generation_adapter import get_text_generation_provider


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

        raw_output = self.adapter.generate_text(prompt)

        title, body = self._parse_output(raw_output, fallback_title=topic)

        return {
            "title": title,
            "body": body,
            "platform": platform,
            "prompt_preview": prompt,
        }

    def _parse_output(self, text: str, fallback_title: str) -> tuple[str, str]:
        if not text:
            return fallback_title, ""

        lines = [line.strip() for line in text.split("\n") if line.strip()]

        if not lines:
            return fallback_title, text

        first_line = lines[0]
        # Xóa các tiền tố markdown hoặc nhãn tiêu đề thường gặp
        clean_title = re.sub(r"^(#+\s*|\*+\s*|tiêu đề:\s*|title:\s*)", "", first_line, flags=re.IGNORECASE).strip()
        clean_title = clean_title.strip("\"'“”«»*")

        if not clean_title:
            clean_title = fallback_title

        if len(lines) > 1:
            body = "\n\n".join(lines[1:])
        else:
            body = text

        return clean_title, body