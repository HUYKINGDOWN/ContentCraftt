from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.feedback_schema import FeedbackCreate, FeedbackRead
from app.services.feedback_service import FeedbackService

router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.get("", response_model=list[FeedbackRead])
def list_items(db: Session = Depends(get_db)):
    return FeedbackService(db).list()


@router.post("", response_model=FeedbackRead)
def create_item(payload: FeedbackCreate, db: Session = Depends(get_db)):
    return FeedbackService(db).create(payload)


@router.get("/{item_id}", response_model=FeedbackRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return FeedbackService(db).get(item_id)
