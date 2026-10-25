from fastapi import APIRouter, HTTPException
from app.schemas.content_generation_schema import (
    ContentGenerationRequest,
    ContentGenerationResponse,
)
from app.services.ai_text_service import AITextService

router = APIRouter(prefix="/ai/text", tags=["AI demo"])


@router.post("", response_model=ContentGenerationResponse)
def generate(payload: ContentGenerationRequest):
    try:
        service = AITextService(provider=payload.provider)
        return service.generate(
            topic=payload.topic,
            platform=payload.platform,
            tone=payload.tone,
            audience=payload.audience,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Lỗi khi sinh nội dung AI: {exc}")
