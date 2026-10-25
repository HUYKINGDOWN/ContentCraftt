from sqlalchemy import func
from sqlalchemy.orm import Session
from app.repositories.analytics_repo import AnalyticsEventRepository
from app.models.brand_model import Brand
from app.models.product_model import Product
from app.models.content_model import Content
from app.models.analytics_model import AnalyticsEvent
from app.shared.exceptions import not_found


class AnalyticsEventService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AnalyticsEventRepository(db)

    def list(self):
        return self.repo.list()

    def get(self, item_id: int):
        item = self.repo.get(item_id)
        if item is None:
            raise not_found("AnalyticsEvent")
        return item

    def create(self, data):
        if hasattr(data, "model_dump"):
            data = data.model_dump()
        return self.repo.create(data)

    def summary(self):
        total_brands = self.db.query(Brand).count()
        total_products = self.db.query(Product).count()
        total_contents = self.db.query(Content).count()
        reach_sum = self.db.query(func.coalesce(func.sum(AnalyticsEvent.reach_count), 0)).scalar() or 0
        engagement_sum = self.db.query(func.coalesce(func.sum(AnalyticsEvent.engagement_count), 0)).scalar() or 0
        click_sum = self.db.query(func.coalesce(func.sum(AnalyticsEvent.click_count), 0)).scalar() or 0

        return {
            "total_brands": total_brands,
            "total_products": total_products,
            "total_contents": total_contents,
            "total_reach": int(reach_sum),
            "total_engagement": int(engagement_sum),
            "total_clicks": int(click_sum),
        }
