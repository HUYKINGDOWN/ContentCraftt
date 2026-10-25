from sqlalchemy.orm import Session
from app.models.audience_model import Audience

class AudienceRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Audience).order_by(Audience.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Audience, item_id)

    def create(self, data: dict):
        data = data.copy()  # Tạo bản sao của dữ liệu để tránh thay đổi dữ liệu gốc
        data.pop("platform", None)  # Loại bỏ khóa chính nếu có trong dữ liệu
        item = Audience(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
