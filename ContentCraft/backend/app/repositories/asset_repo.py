from sqlalchemy.orm import Session
from app.models.asset_model import Asset

class AssetRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Asset).order_by(Asset.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Asset, item_id)

    def create(self, data: dict):
        item = Asset(**data)
        self.db.add(item)
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
