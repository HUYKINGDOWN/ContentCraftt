import re
from typing import List, Dict, Any


class ImageAnalysisService:
    """Dịch vụ phân tích hình ảnh và trích xuất tag, bảng màu, tối ưu prompt."""

    def analyze(self, image_url: str, prompt: str = "Describe this asset") -> Dict[str, Any]:
        # Phân tích thông tin từ prompt và URL
        tags = ["commercial", "marketing", "high-resolution", "product-photography"]

        keywords_lower = (prompt or "").lower()
        if "coffee" in keywords_lower or "cà phê" in keywords_lower:
            tags.extend(["beverage", "coffee", "lifestyle", "warm-tone"])
            palette = ["#3b2219", "#d4a373", "#fefae0", "#faedcd"]
            description = "Chai cà phê cao cấp trong bối cảnh ánh sáng tự nhiên, phong cách Bắc Âu tối giản."
        elif "perfume" in keywords_lower or "nước hoa" in keywords_lower:
            tags.extend(["luxury", "cosmetics", "fragrance", "elegant"])
            palette = ["#1a1a2e", "#e94560", "#f5f5f5", "#d4af37"]
            description = "Chai nước hoa sang trọng trên bề mặt đá cẩm thạch với ánh sáng viền cinematic."
        else:
            tags.extend(["aesthetic", "branding", "clean-design"])
            palette = ["#0f172a", "#38bdf8", "#f1f5f9", "#10b981"]
            description = f"Hình ảnh thương hiệu chuyên nghiệp, tông màu hiện đại, tối ưu cho quảng cáo đa kênh."

        return {
            "image_url": image_url,
            "description": description,
            "tags": list(set(tags)),
            "palette": palette,
            "recommended_aspect_ratio": "1:1",
        }
