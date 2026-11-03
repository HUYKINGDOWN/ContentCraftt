from sqlalchemy.orm import Session
from app.models.content_model import Content


class ContentRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Content).order_by(Content.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Content, item_id)

    def create(self, data: dict):
        item = Content(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_status(self, item_id: int, status: str):
        item = self.get(item_id)
        if item:
            item.status = status
            self.db.commit()
            self.db.refresh(item)
        return item

    def update(self, item_id: int, data: dict):
        item = self.get(item_id)
        if item is None:
            return None
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
