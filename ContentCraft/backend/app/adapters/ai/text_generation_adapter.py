import logging
import os
from pathlib import Path
from typing import Optional

from dotenv import find_dotenv, load_dotenv
from openai import (
    OpenAI,
    APIConnectionError,
    APIStatusError,
    AuthenticationError,
    BadRequestError,
    RateLimitError,
)
from google import genai
from google.genai import errors

from app.adapters.ai.base import TextGenerationProvider

# Nạp file .env từ thư mục hiện tại hoặc các thư mục cha
_env_path = find_dotenv(usecwd=True)
if _env_path:
    load_dotenv(_env_path)
else:
    load_dotenv()

logger = logging.getLogger(__name__)


class OpenAIAdapter(TextGenerationProvider):
    """Lớp giao tiếp giữa ContentCraft và OpenAI API (sử dụng Chat Completions chuẩn)."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = (api_key or os.getenv("OPENAI_API_KEY") or "").strip()

        if not self.api_key:
            raise RuntimeError(
                "Thiếu OPENAI_API_KEY trong file .env. Vui lòng cấu hình OPENAI_API_KEY để sử dụng OpenAI."
            )

        env_model = (model or os.getenv("OPENAI_MODEL") or "gpt-4o-mini").strip()
        # Chuyển đổi nếu cấu hình model không tồn tại
        if env_model in ["", "gpt-5.5"]:
            env_model = "gpt-4o-mini"
        self.model = env_model

        self.client = OpenAI(
            api_key=self.api_key,
            timeout=60.0,
            max_retries=2,
        )

    def generate_text(self, prompt: str) -> str:
        if not prompt or not prompt.strip():
            raise ValueError("Prompt không được để trống")

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "Bạn là chuyên gia sáng tạo nội dung marketing chuyên nghiệp, am hiểu sâu sắc về mạng xã hội và truyền thông số.",
                    },
                    {"role": "user", "content": prompt.strip()},
                ],
                temperature=0.7,
            )

            if not response.choices or not response.choices[0].message:
                raise RuntimeError("OpenAI API không trả về lựa chọn phản hồi nào.")

            result = response.choices[0].message.content

            if not result or not result.strip():
                raise RuntimeError("OpenAI trả về nội dung rỗng.")

            return result.strip()

        except AuthenticationError as exc:
            raise RuntimeError(
                "OpenAI API Key không hợp lệ hoặc đã hết hạn (AuthenticationError 401). "
                "Vui lòng kiểm tra lại OPENAI_API_KEY trong file .env."
            ) from exc

        except RateLimitError as exc:
            error_code = getattr(exc, "code", None)
            error_type = getattr(exc, "type", None)

            if (
                error_code in {"insufficient_quota", "credit_balance_exhausted"}
                or error_type == "insufficient_quota"
            ):
                raise RuntimeError(
                    "Tài khoản OpenAI đã hết hạn mức khả dụng (quota/credits). "
                    "Vui lòng kiểm tra Billing trên OpenAI dashboard."
                ) from exc

            raise RuntimeError(
                "OpenAI API đang giới hạn tốc độ yêu cầu (Rate Limit). Vui lòng thử lại sau giây lát."
            ) from exc

        except BadRequestError as exc:
            raise RuntimeError(
                f"Yêu cầu gửi đến OpenAI API không hợp lệ: {getattr(exc, 'message', str(exc))}"
            ) from exc

        except APIConnectionError as exc:
            raise RuntimeError(
                "Không thể kết nối đến máy chủ OpenAI API. Vui lòng kiểm tra mạng Internet."
            ) from exc

        except APIStatusError as exc:
            raise RuntimeError(
                f"OpenAI API trả về lỗi HTTP {exc.status_code}: {getattr(exc, 'message', str(exc))}"
            ) from exc

        except Exception as exc:
            raise RuntimeError(f"Lỗi khi gọi OpenAI API: {exc}") from exc


class GeminiAdapter(TextGenerationProvider):
    """Lớp giao tiếp giữa ContentCraft và Google Gemini API."""

    # Danh sách model dự phòng theo thứ tự ưu tiên
    FALLBACK_MODELS = [
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
    ]

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = (api_key or os.getenv("GEMINI_API_KEY") or "").strip()

        if not self.api_key:
            raise RuntimeError(
                "Thiếu GEMINI_API_KEY trong file .env. Vui lòng cấu hình GEMINI_API_KEY để sử dụng Gemini."
            )

        env_model = (model or os.getenv("GEMINI_MODEL") or "gemini-3.5-flash").strip()
        # Chuyển đổi nếu cấu hình model cũ không còn khả dụng
        if env_model in ["", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]:
            env_model = "gemini-3.5-flash"

        self.model = env_model
        self.client = genai.Client(api_key=self.api_key)

    def _call_model(self, model_name: str, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=model_name,
            contents=prompt.strip(),
        )
        return (response.text or "").strip()

    def generate_text(self, prompt: str) -> str:
        if not prompt or not prompt.strip():
            raise ValueError("Prompt không được để trống")

        candidate_models = [self.model] + [m for m in self.FALLBACK_MODELS if m != self.model]
        last_error = None

        for model_to_try in candidate_models:
            try:
                result = self._call_model(model_to_try, prompt)
                if result:
                    return result
                raise RuntimeError(f"Mô hình {model_to_try} trả về nội dung rỗng")

            except (errors.ServerError, errors.ClientError) as exc:
                last_error = exc
                status_code = getattr(exc, "code", getattr(exc, "status_code", None))
                error_msg = str(exc)

                # Nếu lỗi 401 hoặc 403 (sai key), báo ngay không cần thử model khác
                if status_code in (401, 403):
                    raise RuntimeError(
                        "GEMINI_API_KEY không hợp lệ hoặc không có quyền truy cập. "
                        "Vui lòng kiểm tra lại GEMINI_API_KEY trong file .env."
                    ) from exc

                # Nếu lỗi 429 hoặc RESOURCE_EXHAUSTED
                if status_code == 429 or "RESOURCE_EXHAUSTED" in error_msg:
                    raise RuntimeError(
                        "Gemini API đã vượt quá hạn mức sử dụng (Quota / Rate Limit). Vui lòng thử lại sau."
                    ) from exc

                # Nếu 503 (quá tải), 504 (timeout) hoặc 404 (model không tìm thấy), thử model tiếp theo trong fallback
                if (
                    status_code in (503, 504, 404)
                    or "UNAVAILABLE" in error_msg
                    or "NOT_FOUND" in error_msg
                    or "DEADLINE_EXCEEDED" in error_msg
                ):
                    logger.warning(
                        f"[Gemini] Mô hình {model_to_try} gặp lỗi {status_code or error_msg}, thử mô hình dự phòng tiếp theo..."
                    )
                    continue

                raise RuntimeError(f"Lỗi khi gọi Gemini API ({model_to_try}): {exc}") from exc

            except Exception as exc:
                last_error = exc
                logger.warning(
                    f"[Gemini] Lỗi không xác định với mô hình {model_to_try}: {exc}, thử mô hình dự phòng..."
                )
                continue

        if last_error:
            raise RuntimeError(f"Lỗi khi gọi Gemini API: {last_error}")
        raise RuntimeError("Không thể nhận nội dung phản hồi từ Gemini API.")


class ResilientAIAdapter(TextGenerationProvider):
    """Adapter thông minh tự động dự phòng giữa OpenAI và Gemini khi một bên gặp lỗi."""

    def __init__(self, primary: TextGenerationProvider, fallback: Optional[TextGenerationProvider] = None):
        self.primary = primary
        self.fallback = fallback

    def generate_text(self, prompt: str) -> str:
        try:
            return self.primary.generate_text(prompt)
        except Exception as primary_error:
            if not self.fallback:
                raise primary_error

            logger.warning(
                f"[AI Resilient] Nhà cung cấp chính ({self.primary.__class__.__name__}) gặp lỗi: {primary_error}. "
                f"Tự động chuyển sang nhà cung cấp phụ ({self.fallback.__class__.__name__})..."
            )

            try:
                return self.fallback.generate_text(prompt)
            except Exception as fallback_error:
                raise RuntimeError(
                    f"Cả hai nhà cung cấp AI đều không thực hiện được.\n"
                    f"- Chính ({self.primary.__class__.__name__}): {primary_error}\n"
                    f"- Phụ ({self.fallback.__class__.__name__}): {fallback_error}"
                ) from fallback_error


def get_text_generation_provider(provider_name: Optional[str] = None) -> TextGenerationProvider:
    """Khởi tạo provider sinh văn bản theo cấu hình và hỗ trợ tự động fallback an toàn."""
    target_provider = (provider_name or os.getenv("AI_PROVIDER") or "gemini").strip().lower()

    openai_key = (os.getenv("OPENAI_API_KEY") or "").strip()
    gemini_key = (os.getenv("GEMINI_API_KEY") or "").strip()

    openai_adapter = None
    gemini_adapter = None

    if openai_key:
        try:
            openai_adapter = OpenAIAdapter()
        except Exception as e:
            logger.warning(f"Không thể khởi tạo OpenAIAdapter: {e}")

    if gemini_key:
        try:
            gemini_adapter = GeminiAdapter()
        except Exception as e:
            logger.warning(f"Không thể khởi tạo GeminiAdapter: {e}")

    if target_provider == "openai":
        if openai_adapter:
            return ResilientAIAdapter(primary=openai_adapter, fallback=gemini_adapter)
        elif gemini_adapter:
            logger.warning("Không có cấu hình OpenAI hợp lệ, tự động sử dụng GeminiAdapter.")
            return gemini_adapter
        else:
            return OpenAIAdapter()  # Sẽ ném ngoại lệ hướng dẫn thiếu key

    elif target_provider == "gemini":
        if gemini_adapter:
            return ResilientAIAdapter(primary=gemini_adapter, fallback=openai_adapter)
        elif openai_adapter:
            logger.warning("Không có cấu hình Gemini hợp lệ, tự động sử dụng OpenAIAdapter.")
            return openai_adapter
        else:
            return GeminiAdapter()  # Sẽ ném ngoại lệ hướng dẫn thiếu key

    else:
        raise ValueError(
            f"AI_PROVIDER không hợp lệ: '{target_provider}'. Hỗ trợ 'gemini' hoặc 'openai'."
        )