from datetime import datetime
from pydantic import BaseModel, ConfigDict


class BrandCreate(BaseModel):
    name: str
    description: str = ""
    tone: str = "friendly"
    user_id: int | None = None
    industry: str | None = None
    core_values: str | None = None
    brand_voice: str | None = None
    communication_style: str | None = None
    marketing_preferences: str | None = None


class BrandUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    tone: str | None = None
    user_id: int | None = None
    industry: str | None = None
    core_values: str | None = None
    brand_voice: str | None = None
    communication_style: str | None = None
    marketing_preferences: str | None = None


class BrandRead(BaseModel):
    id: int
    name: str
    description: str = ""
    tone: str = "friendly"
    user_id: int | None = None
    industry: str | None = None
    core_values: str | None = None
    brand_voice: str | None = None
    communication_style: str | None = None
    marketing_preferences: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
