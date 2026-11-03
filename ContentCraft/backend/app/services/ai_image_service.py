import os
import random
import urllib.parse
import urllib.request
import uuid
from typing import Optional


class AIImageService:
    """Dịch vụ sinh hình ảnh AI marketing chất lượng cao (hỗ trợ Flux.1, SDXL, Reference Image Subject)."""

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

    VIETNAMESE_KEYWORD_MAP = {
        "con vịt": "a charming duck",
        "vịt": "a duck",
        "vịt vàng": "a cute yellow duck",
        "thiên nga": "an elegant swan",
        "chó": "a cute dog",
        "mèo": "a cute cat",
        "cà phê": "specialty coffee cup",
        "ly cà phê": "iced coffee glass",
        "chai": "premium glass bottle",
        "mỹ phẩm": "luxury cosmetics bottle",
        "quần áo": "fashion apparel",
        "giày": "stylish sneakers",
    }

    def generate(
        self,
        prompt: str,
        style: Optional[str] = None,
        aspect_ratio: str = "1:1",
        reference_subject: Optional[str] = None,
        reference_name: Optional[str] = None,
    ):
        clean_prompt = prompt.strip() if prompt else "A premium marketing product display"

        # Nếu có reference_subject (ví dụ người dùng tải ảnh con vịt), bổ sung vào prompt
        subject_term = ""
        if reference_subject and reference_subject.strip():
            raw_sub = reference_subject.strip().lower()
            translated = self.VIETNAMESE_KEYWORD_MAP.get(raw_sub, raw_sub)
            subject_term = translated
        elif reference_name:
            lower_name = reference_name.lower()
            if any(k in lower_name for k in ["vit", "duck"]):
                subject_term = "a cute duck"
            elif any(k in lower_name for k in ["thiennga", "swan"]):
                subject_term = "an elegant swan"

        # Tích hợp subject vào câu prompt
        if subject_term and subject_term.lower() not in clean_prompt.lower():
            clean_prompt = f"featuring {subject_term}, {clean_prompt}"

        # Tối ưu hóa prompt với từ khóa phong cách
        style_enrichment = self.STYLE_KEYWORDS.get(style or "", "")
        if style_enrichment and style_enrichment.lower() not in clean_prompt.lower():
            full_prompt = f"{clean_prompt}, {style_enrichment}"
        else:
            full_prompt = clean_prompt

        width, height = self.DIMENSIONS.get(aspect_ratio, (1024, 1024))
        seed = random.randint(1000, 999999)

        # Sử dụng Pollinations AI (Flux.1 Engine)
        encoded_prompt = urllib.parse.quote(full_prompt)
        remote_url = (
            f"https://image.pollinations.ai/prompt/{encoded_prompt}"
            f"?width={width}&height={height}&model=flux&seed={seed}&nologo=true"
        )

        # Tải và lưu trữ ảnh cục bộ trong uploads/generated để phục vụ nhanh chóng và lưu trữ vĩnh viễn
        final_image_url = remote_url
        try:
            filename = f"ai_{uuid.uuid4().hex[:12]}.jpg"
            current_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            generated_dir = os.path.join(current_dir, "uploads", "generated")
            os.makedirs(generated_dir, exist_ok=True)
            local_path = os.path.join(generated_dir, filename)

            req = urllib.request.Request(remote_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=12) as response:
                if response.status == 200:
                    with open(local_path, "wb") as f:
                        f.write(response.read())
                    final_image_url = f"http://localhost:8000/uploads/generated/{filename}"
        except Exception as e:
            # Nếu tải về bị timeout, dùng trực tiếp link AI từ Pollinations
            print(f"Warning: could not cache AI image locally: {e}")
            final_image_url = remote_url

        return {
            "prompt": full_prompt,
            "image_url": final_image_url,
            "aspect_ratio": aspect_ratio,
            "width": width,
            "height": height,
            "style": style or "Clean lifestyle",
            "provider": "Pollinations Flux.1 AI",
        }
