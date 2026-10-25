from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_image_service import AIImageService
router = APIRouter(prefix="/ai/image", tags=["AI demo"])
class ImagePrompt(BaseModel):
    prompt: str
@router.post("")
def generate(payload: ImagePrompt):
    return AIImageService().generate(payload.prompt)
