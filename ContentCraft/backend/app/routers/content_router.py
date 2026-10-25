from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.content_schema import ContentCreate, ContentRead, ContentStatusUpdate
from app.services.content_service import ContentService

router = APIRouter(prefix="/contents", tags=["contents"])


@router.get("", response_model=list[ContentRead])
def list_items(db: Session = Depends(get_db)):
    return ContentService(db).list()


@router.post("", response_model=ContentRead)
def create_item(payload: ContentCreate, db: Session = Depends(get_db)):
    return ContentService(db).create(payload)


@router.get("/{item_id}", response_model=ContentRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return ContentService(db).get(item_id)


@router.patch("/{item_id}/status", response_model=ContentRead)
def update_status(item_id: int, payload: ContentStatusUpdate, db: Session = Depends(get_db)):
    return ContentService(db).update_status(item_id, payload.status)


@router.post("/{item_id}/approve", response_model=ContentRead)
def approve_item(item_id: int, db: Session = Depends(get_db)):
    return ContentService(db).update_status(item_id, "Approved")
