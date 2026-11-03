from sqlalchemy.orm import Session
from app.models.content_model import Content, normalize_content_data
from app.models.brand_model import Brand


def ensure_valid_brand_id(db: Session, brand_id: int | None) -> int:
    if brand_id:
        existing = db.query(Brand.id).filter(Brand.id == brand_id).first()
        if existing:
            return brand_id
    first_brand = db.query(Brand.id).first()
    return first_brand[0] if first_brand else 1


class ContentRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, limit: int = 100):
        return self.db.query(Content).order_by(Content.id.desc()).limit(limit).all()

    def get(self, item_id: int):
        return self.db.get(Content, item_id)

    def create(self, data: dict):
        norm = normalize_content_data(data)
        norm["brand_id"] = ensure_valid_brand_id(self.db, norm.get("brand_id"))
        item = Content(**norm)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_status(self, item_id: int, status: str):
        item = self.get(item_id)
        if item:
            st = str(status).lower()
            if st in ("in review", "in_review", "review", "reviewed"):
                norm_status = "Reviewed"
            elif st in ("approved", "approve"):
                norm_status = "Approved"
            elif st in ("published", "publish"):
                norm_status = "Published"
            else:
                norm_status = "Draft"
            item.status = norm_status
            self.db.commit()
            self.db.refresh(item)
        return item

    def update(self, item_id: int, data: dict):
        item = self.get(item_id)
        if item is None:
            return None
        norm = normalize_content_data(data)
        if "brand_id" in norm:
            norm["brand_id"] = ensure_valid_brand_id(self.db, norm.get("brand_id"))
        for key, value in norm.items():
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
