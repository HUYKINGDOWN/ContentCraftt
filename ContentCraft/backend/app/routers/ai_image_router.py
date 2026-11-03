from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_image_service import AIImageService

router = APIRouter(prefix="/ai/image", tags=["AI demo"])


class ImagePrompt(BaseModel):
    prompt: str
    style: str | None = None
    aspect_ratio: str | None = "1:1"


@router.post("")
def generate(payload: ImagePrompt):
    return AIImageService().generate(
        prompt=payload.prompt,
        style=payload.style,
        aspect_ratio=payload.aspect_ratio or "1:1",
    )
