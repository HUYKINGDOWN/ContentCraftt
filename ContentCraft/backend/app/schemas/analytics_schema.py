from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AnalyticsEventCreate(BaseModel):
    event_name: str = "engagement"
    value: int = 1
    content_id: int | None = 1
    post_url: str | None = None
    reach_count: int | None = 0
    engagement_count: int | None = 0
    click_count: int | None = 0


class AnalyticsEventRead(BaseModel):
    id: int
    content_id: int = 1
    post_url: str | None = None
    reach_count: int = 0
    engagement_count: int = 0
    click_count: int = 0
    logged_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class AnalyticsSummaryRead(BaseModel):
    total_brands: int = 0
    total_products: int = 0
    total_contents: int = 0
    total_reach: int = 0
    total_engagement: int = 0
    total_clicks: int = 0
