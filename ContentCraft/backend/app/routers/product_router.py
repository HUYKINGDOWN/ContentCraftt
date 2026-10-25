from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.product_schema import ProductCreate, ProductRead
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductRead])
def list_items(db: Session = Depends(get_db)):
    return ProductService(db).list()


@router.post("", response_model=ProductRead)
def create_item(payload: ProductCreate, db: Session = Depends(get_db)):
    return ProductService(db).create(payload)


@router.get("/{item_id}", response_model=ProductRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return ProductService(db).get(item_id)
