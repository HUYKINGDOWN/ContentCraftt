from sqlalchemy.orm import Session
from app.repositories.content_repo import ContentRepository
from app.shared.exceptions import not_found


class ContentService:
    def __init__(self, db: Session):
        self.repo = ContentRepository(db)

    def list(self):
        return self.repo.list()

    def get(self, item_id: int):
        item = self.repo.get(item_id)
        if item is None:
            raise not_found("Content")
        return item

    def create(self, data):
        if hasattr(data, "model_dump"):
            data = data.model_dump()
        return self.repo.create(data)

    def update_status(self, item_id: int, status: str):
        item = self.repo.update_status(item_id, status)
        if item is None:
            raise not_found("Content")
        return item
