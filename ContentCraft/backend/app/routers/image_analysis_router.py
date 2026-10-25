from fastapi import APIRouter
from app.schemas.image_analysis_schema import ImageAnalysisRequest
from app.services.image_analysis_service import ImageAnalysisService
router = APIRouter(prefix="/image-analysis", tags=["assets"])
@router.post("")
def analyze(payload: ImageAnalysisRequest):
    return ImageAnalysisService().analyze(payload.image_url, payload.prompt)
