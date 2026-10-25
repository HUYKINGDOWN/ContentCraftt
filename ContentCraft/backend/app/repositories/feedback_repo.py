from sqlalchemy.orm import Session
from app.models.feedback_model import Feedback

class FeedbackRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Feedback).order_by(Feedback.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Feedback, item_id)

    def create(self, data: dict):
        item = Feedback(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
