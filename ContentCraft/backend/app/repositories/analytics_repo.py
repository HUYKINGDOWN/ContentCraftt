from sqlalchemy.orm import Session
from app.models.analytics_model import AnalyticsEvent

class AnalyticsEventRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(AnalyticsEvent).order_by(AnalyticsEvent.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(AnalyticsEvent, item_id)

    def create(self, data: dict):
        item = AnalyticsEvent(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
