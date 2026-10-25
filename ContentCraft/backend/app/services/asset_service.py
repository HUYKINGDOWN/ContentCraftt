from sqlalchemy.orm import Session
from app.repositories.asset_repo import AssetRepository
from app.shared.exceptions import not_found

class AssetService:
    def __init__(self, db: Session):
        self.repo = AssetRepository(db)

    def list(self):
        return self.repo.list()

    def get(self, item_id: int):
        item = self.repo.get(item_id)
        if item is None:
            raise not_found("Asset")
        return item

    def create(self, data):
        if hasattr(data, "model_dump"):
            data = data.model_dump()
        return self.repo.create(data)
