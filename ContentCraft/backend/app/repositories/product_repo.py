from sqlalchemy.orm import Session
from app.models.product_model import Product

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Product).order_by(Product.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Product, item_id)

    def create(self, data: dict):
        item = Product(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
