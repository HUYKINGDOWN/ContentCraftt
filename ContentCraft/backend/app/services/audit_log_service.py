from sqlalchemy.orm import Session
from app.repositories.audit_log_repo import AuditLogRepository
from app.shared.exceptions import not_found

class AuditLogService:
    def __init__(self, db: Session):
        self.repo = AuditLogRepository(db)

    def list(self):
        return self.repo.list()

    def get(self, item_id: int):
        item = self.repo.get(item_id)
        if item is None:
            raise not_found("AuditLog")
        return item

    def create(self, data):
        if hasattr(data, "model_dump"):
            data = data.model_dump()
        return self.repo.create(data)
