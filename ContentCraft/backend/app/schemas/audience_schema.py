from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AudienceCreate(BaseModel):
    name: str
    description: str = ""
    platform: str = "general"
    brand_id: int | None = 1
    age_min: int | None = None
    age_max: int | None = None
    gender: str = "All"
    interests: str | None = None
    behaviors: str | None = None
    notes: str | None = None


class AudienceRead(BaseModel):
    id: int
    name: str
    description: str = ""
    platform: str = "general"
    brand_id: int
    age_min: int | None = None
    age_max: int | None = None
    gender: str = "All"
    interests: str | None = None
    behaviors: str | None = None
    notes: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
