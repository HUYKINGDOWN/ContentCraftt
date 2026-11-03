from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.asset_schema import AssetCreate, AssetRead
from app.services.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=list[AssetRead])
def list_items(db: Session = Depends(get_db)):
    return AssetService(db).list()


@router.post("", response_model=AssetRead)
def create_item(payload: AssetCreate, db: Session = Depends(get_db)):
    return AssetService(db).create(payload)


@router.get("/{item_id}", response_model=AssetRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return AssetService(db).get(item_id)


@router.delete("/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    return AssetService(db).delete(item_id)
