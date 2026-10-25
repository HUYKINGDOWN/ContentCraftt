from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.services.publishing_service import PublishingService

router = APIRouter(prefix="/publishing", tags=["publishing"])


class PublishRequest(BaseModel):
    content_id: int
    platform: str = "Facebook"


@router.get("/status")
def get_publishing_status():
    """Kiểm tra xem hệ thống đã được cấu hình API mạng xã hội thật (Facebook / Webhook) hay chưa."""
    return PublishingService().check_api_status()


@router.post("")
def publish(payload: PublishRequest, db: Session = Depends(get_db)):
    return PublishingService(db).publish(payload.content_id, payload.platform)
