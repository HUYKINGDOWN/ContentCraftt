from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ContentCreate(BaseModel):
    title: str
    body: str = ""
    status: str = "Draft"
    platform: str = "Facebook"
    brand_id: int | None = 1
    product_id: int | None = None
    target_customer_id: int | None = None
    rule_id: int | None = None
    content_type: str = "Caption"
    language_preference: str = "VI"


class ContentUpdate(BaseModel):
    title: str | None = None
    body: str | None = None
    status: str | None = None
    platform: str | None = None
    brand_id: int | None = None
    product_id: int | None = None
    target_customer_id: int | None = None
    rule_id: int | None = None
    content_type: str | None = None
    language_preference: str | None = None


class ContentStatusUpdate(BaseModel):
    status: str


class ContentRead(BaseModel):
    id: int
    title: str
    body: str = ""
    status: str = "Draft"
    platform: str = "Facebook"
    brand_id: int
    product_id: int | None = None
    target_customer_id: int | None = None
    rule_id: int | None = None
    content_type: str = "Caption"
    language_preference: str = "VI"
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
