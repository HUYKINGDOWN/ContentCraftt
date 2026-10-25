from sqlalchemy.orm import Session
from app.models.content_version_model import ContentVersion

class ContentVersionRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(ContentVersion).order_by(ContentVersion.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(ContentVersion, item_id)

    def create(self, data: dict):
        item = ContentVersion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
