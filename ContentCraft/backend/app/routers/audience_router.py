from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.audience_schema import AudienceCreate, AudienceRead, AudienceUpdate
from app.services.audience_service import AudienceService

router = APIRouter(prefix="/audiences", tags=["audiences"])


@router.get("", response_model=list[AudienceRead])
def list_items(db: Session = Depends(get_db)):
    return AudienceService(db).list()


@router.post("", response_model=AudienceRead)
def create_item(payload: AudienceCreate, db: Session = Depends(get_db)):
    return AudienceService(db).create(payload)


@router.get("/{item_id}", response_model=AudienceRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return AudienceService(db).get(item_id)


@router.put("/{item_id}", response_model=AudienceRead)
def update_item(item_id: int, payload: AudienceUpdate, db: Session = Depends(get_db)):
    return AudienceService(db).update(item_id, payload)


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    return AudienceService(db).delete(item_id)
