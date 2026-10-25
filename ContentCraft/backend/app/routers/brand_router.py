from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.brand_schema import BrandCreate, BrandRead
from app.services.brand_service import BrandService

router = APIRouter(prefix="/brands", tags=["brands"])


@router.get("", response_model=list[BrandRead])
def list_items(db: Session = Depends(get_db)):
    return BrandService(db).list()


@router.post("", response_model=BrandRead)
def create_item(payload: BrandCreate, db: Session = Depends(get_db)):
    return BrandService(db).create(payload)


@router.get("/{item_id}", response_model=BrandRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return BrandService(db).get(item_id)
