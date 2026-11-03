from sqlalchemy.orm import Session
from app.models.content_version_model import ContentVersion

class ContentVersionRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, content_id: int | None = None, limit: int = 100):
        query = self.db.query(ContentVersion)
        if content_id is not None:
            query = query.filter(ContentVersion.content_id == content_id)
        return query.order_by(ContentVersion.version_number.desc(), ContentVersion.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(ContentVersion, item_id)

    def get_latest_version_number(self, content_id: int) -> int:
        latest = (
            self.db.query(ContentVersion)
            .filter(ContentVersion.content_id == content_id)
            .order_by(ContentVersion.version_number.desc())
            .first()
        )
        return latest.version_number if latest else 0

    def create(self, data: dict):
        content_id = data.get("content_id")
        if content_id and not data.get("version_number"):
            data["version_number"] = self.get_latest_version_number(content_id) + 1
        item = ContentVersion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
