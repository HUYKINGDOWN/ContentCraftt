from sqlalchemy.orm import Session
from app.repositories.brand_repo import BrandRepository
from app.shared.exceptions import not_found

class BrandService:
    def __init__(self, db: Session):
        self.repo = BrandRepository(db)

    def list(self):
        return self.repo.list()

    def get(self, item_id: int):
        item = self.repo.get(item_id)
        if item is None:
            raise not_found("Brand")
        return item

    def create(self, data):
        if hasattr(data, "model_dump"):
            data = data.model_dump()
        return self.repo.create(data)
