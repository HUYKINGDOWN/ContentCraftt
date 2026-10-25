from sqlalchemy.orm import Session
from app.repositories.product_repo import ProductRepository
from app.shared.exceptions import not_found

class ProductService:
    def __init__(self, db: Session):
        self.repo = ProductRepository(db)

    def list(self):
        return self.repo.list()

    def get(self, item_id: int):
        item = self.repo.get(item_id)
        if item is None:
            raise not_found("Product")
        return item

    def create(self, data):
        if hasattr(data, "model_dump"):
            data = data.model_dump()
        return self.repo.create(data)
