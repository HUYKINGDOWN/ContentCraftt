from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.ai_image_service import AIImageService

router = APIRouter(prefix="/ai/image", tags=["AI demo"])


class ImagePrompt(BaseModel):
    prompt: str
    style: Optional[str] = None
    aspect_ratio: Optional[str] = "1:1"
    reference_subject: Optional[str] = None
    reference_name: Optional[str] = None


@router.post("")
def generate(payload: ImagePrompt):
    return AIImageService().generate(
        prompt=payload.prompt,
        style=payload.style,
        aspect_ratio=payload.aspect_ratio or "1:1",
        reference_subject=payload.reference_subject,
        reference_name=payload.reference_name,
    )
