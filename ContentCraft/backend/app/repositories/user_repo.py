from sqlalchemy.orm import Session
from app.models.user_model import User
from app.core.security import hash_password


def normalize_user_data(data: dict) -> dict:
    data = data.copy()

    # Normalize role: ('Staff' | 'BrandOwner' | 'Admin')
    role = str(data.get("role", "BrandOwner")).lower()
    if "admin" in role:
        data["role"] = "Admin"
    elif "staff" in role or "editor" in role:
        data["role"] = "Staff"
    else:
        data["role"] = "BrandOwner"

    # Normalize status: ('Blocked' | 'Inactive' | 'Active')
    status = str(data.get("status", "Active")).lower()
    if "block" in status or "suspend" in status:
        data["status"] = "Blocked"
    elif "inactive" in status or "invite" in status:
        data["status"] = "Inactive"
    else:
        data["status"] = "Active"

    return data


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(User).order_by(User.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(User, item_id)

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def create(self, data: dict):
        data = normalize_user_data(data)
        raw_pw = data.pop("password", None)
        if raw_pw and "password_hash" not in data:
            data["password_hash"] = hash_password(raw_pw)
        elif "password_hash" not in data:
            data["password_hash"] = hash_password("demo1234")
        item = User(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item_id: int, data: dict):
        item = self.get(item_id)
        if item is None:
            return None
        data = normalize_user_data(data)
        raw_pw = data.pop("password", None)
        if raw_pw:
            data["password_hash"] = hash_password(raw_pw)
        for key, value in data.items():
            if value is not None and hasattr(item, key):
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item_id: int):
        item = self.get(item_id)
        if item is None:
            return False
        self.db.delete(item)
        self.db.commit()
        return True
