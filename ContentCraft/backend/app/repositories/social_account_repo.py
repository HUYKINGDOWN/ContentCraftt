from sqlalchemy.orm import Session
from app.models.social_account_model import SocialAccount

class SocialAccountRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(SocialAccount).order_by(SocialAccount.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(SocialAccount, item_id)

    def create(self, data: dict):
        item = SocialAccount(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
