from sqlalchemy.orm import Session
from app.models.brand_model import Brand

class BrandRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Brand).order_by(Brand.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Brand, item_id)

    def create(self, data: dict):
        item = Brand(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
