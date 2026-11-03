from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.brand_model import Brand
from app.models.product_model import Product
from app.models.content_model import Content
from app.models.user_model import User
from app.core.config import settings


class AdminService:
    def __init__(self, db: Session = None):
        self.db = db

    def status(self):
        stats = {
            "environment": settings.ENVIRONMENT,
            "database": settings.DB_NAME,
            "status": "online",
            "db_connected": False,
            "counts": {
                "brands": 0,
                "products": 0,
                "contents": 0,
                "users": 0,
            },
        }

        if self.db:
            try:
                self.db.execute(text("SELECT 1"))
                stats["db_connected"] = True
                stats["counts"]["brands"] = self.db.query(Brand).count()
                stats["counts"]["products"] = self.db.query(Product).count()
                stats["counts"]["contents"] = self.db.query(Content).count()
                stats["counts"]["users"] = self.db.query(User).count()
            except Exception as e:
                stats["db_error"] = str(e)

        return stats
