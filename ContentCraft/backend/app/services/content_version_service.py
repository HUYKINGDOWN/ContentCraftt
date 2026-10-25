from sqlalchemy.orm import Session
from app.repositories.content_version_repo import ContentVersionRepository
from app.shared.exceptions import not_found

class ContentVersionService:
    def __init__(self, db: Session):
        self.repo = ContentVersionRepository(db)

    def list(self):
        return self.repo.list()

    def get(self, item_id: int):
        item = self.repo.get(item_id)
        if item is None:
            raise not_found("ContentVersion")
        return item

    def create(self, data):
        if hasattr(data, "model_dump"):
            data = data.model_dump()
        return self.repo.create(data)
