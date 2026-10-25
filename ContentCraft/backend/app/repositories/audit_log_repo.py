from sqlalchemy.orm import Session
from app.models.audit_log_model import AuditLog

class AuditLogRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(AuditLog).order_by(AuditLog.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(AuditLog, item_id)

    def create(self, data: dict):
        item = AuditLog(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item
