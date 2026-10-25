from sqlalchemy.orm import Session
from app.models.content_rules_model import ContentRule

class ContentRuleRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(ContentRule).order_by(ContentRule.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(ContentRule, item_id)

    def create(self, data: dict):
        item = ContentRule(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
