from sqlalchemy.orm import Session
from app.models.audience_model import Audience

class AudienceRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Audience).order_by(Audience.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Audience, item_id)

    def create(self, data: dict):
        data = data.copy()
        data.pop("platform", None)
        item = Audience(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item_id: int, data: dict):
        item = self.get(item_id)
        if item is None:
            return None
        data = data.copy()
        data.pop("platform", None)
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
