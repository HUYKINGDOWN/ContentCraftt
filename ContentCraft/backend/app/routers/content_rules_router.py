from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.content_rules_schema import ContentRuleCreate, ContentRuleRead
from app.services.content_rules_service import ContentRuleService

router = APIRouter(prefix="/content-rules", tags=["content-rules"])


@router.get("", response_model=list[ContentRuleRead])
def list_items(db: Session = Depends(get_db)):
    return ContentRuleService(db).list()


@router.post("", response_model=ContentRuleRead)
def create_item(payload: ContentRuleCreate, db: Session = Depends(get_db)):
    return ContentRuleService(db).create(payload)


@router.get("/{item_id}", response_model=ContentRuleRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return ContentRuleService(db).get(item_id)
