from sqlalchemy.orm import Session
from app.models.product_model import Product
from app.models.brand_model import Brand


def ensure_valid_brand_id(db: Session, brand_id: int | None) -> int:
    if brand_id:
        existing = db.query(Brand.id).filter(Brand.id == brand_id).first()
        if existing:
            return brand_id
    first_brand = db.query(Brand.id).first()
    return first_brand[0] if first_brand else 1


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Product).order_by(Product.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Product, item_id)

    def create(self, data: dict):
        data = data.copy()
        data["brand_id"] = ensure_valid_brand_id(self.db, data.get("brand_id"))
        item = Product(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item_id: int, data: dict):
        item = self.get(item_id)
        if item is None:
            return None
        data = data.copy()
        if "brand_id" in data:
            data["brand_id"] = ensure_valid_brand_id(self.db, data.get("brand_id"))
        for key, value in data.items():
            if value is not None and hasattr(item, key):
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item_id: int):
        item = self.get(item_id)
        if item is None:
            return False
        self.db.delete(item)
        self.db.commit()
        return True
