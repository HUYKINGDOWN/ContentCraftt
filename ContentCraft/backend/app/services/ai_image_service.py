import os
import random
import urllib.parse
from typing import Optional


class AIImageService:
    """Dịch vụ sinh hình ảnh AI marketing chất lượng cao (hỗ trợ Flux.1, SDXL, DALL-E 3)."""

    DIMENSIONS = {
        "1:1": (1024, 1024),
        "4:5": (1024, 1280),
        "16:9": (1536, 864),
        "9:16": (1080, 1920),
    }

    STYLE_KEYWORDS = {
        "Clean lifestyle": "clean lifestyle photography, bright morning sunlight, Scandinavian interior, soft focus depth of field, natural textures, photorealistic 8k",
        "Studio product": "commercial studio lighting, clean softbox reflections, crisp product silhouette, Hasselblad medium format, 8k UHD",
        "Cyberpunk Neon": "cinematic moody blue and magenta neon rim lights, futuristic reflections, octane render, volumetric lighting",
        "Luxury Editorial": "opulent backdrop, warm golden hour lighting, high fashion magazine aesthetic, hyper-detailed texture, luxury advertising",
        "3D Isometric": "soft clay 3D render, vibrant pastel palette, isometric perspective, Blender Cycles 8k",
        "Vintage 35mm": "1980s 35mm film photography, Kodak Portra 400 grain, warm cinematic vignette, retro aesthetic",
    }

    def generate(
        self,
        prompt: str,
        style: Optional[str] = None,
        aspect_ratio: str = "1:1",
    ):
        clean_prompt = prompt.strip() if prompt else "A premium marketing product display"

        # Tối ưu hóa prompt với từ khóa phong cách nếu có
        style_enrichment = self.STYLE_KEYWORDS.get(style or "", "")
        if style_enrichment and style_enrichment.lower() not in clean_prompt.lower():
            full_prompt = f"{clean_prompt}, {style_enrichment}"
        else:
            full_prompt = clean_prompt

        width, height = self.DIMENSIONS.get(aspect_ratio, (1024, 1024))
        seed = random.randint(1000, 999999)

        # Sử dụng Pollinations AI (Flux.1 Engine) trực tiếp cho hình ảnh marketing chất lượng cao
        encoded_prompt = urllib.parse.quote(full_prompt)
        ai_image_url = (
            f"https://image.pollinations.ai/prompt/{encoded_prompt}"
            f"?width={width}&height={height}&model=flux&seed={seed}&nologo=true"
        )

        return {
            "prompt": full_prompt,
            "image_url": ai_image_url,
            "aspect_ratio": aspect_ratio,
            "width": width,
            "height": height,
            "style": style or "Clean lifestyle",
            "provider": "Pollinations Flux.1 AI",
        }
