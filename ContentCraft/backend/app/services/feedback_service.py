from sqlalchemy.orm import Session
from app.repositories.feedback_repo import FeedbackRepository
from app.shared.exceptions import not_found

class FeedbackService:
    def __init__(self, db: Session):
        self.repo = FeedbackRepository(db)

    def list(self):
        return self.repo.list()

    def get(self, item_id: int):
        item = self.repo.get(item_id)
        if item is None:
            raise not_found("Feedback")
        return item

    def create(self, data):
        if hasattr(data, "model_dump"):
            data = data.model_dump()
        return self.repo.create(data)
