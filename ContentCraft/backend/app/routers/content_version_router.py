from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.content_version_schema import ContentVersionCreate, ContentVersionRead
from app.services.content_version_service import ContentVersionService

router = APIRouter(prefix="/content-versions", tags=["content-versions"])


@router.get("", response_model=list[ContentVersionRead])
def list_items(
    content_id: int | None = Query(None, description="Lọc theo content_id"),
    db: Session = Depends(get_db),
):
    return ContentVersionService(db).list(content_id=content_id)


@router.post("", response_model=ContentVersionRead)
def create_item(payload: ContentVersionCreate, db: Session = Depends(get_db)):
    return ContentVersionService(db).create(payload)


@router.get("/{item_id}", response_model=ContentVersionRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return ContentVersionService(db).get(item_id)
