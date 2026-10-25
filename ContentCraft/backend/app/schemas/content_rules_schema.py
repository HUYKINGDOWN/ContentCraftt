from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ContentRuleCreate(BaseModel):
    name: str
    rules: str = ""
    brand_id: int | None = 1
    category: str | None = None
    restricted_words: str | None = None
    warnings: str | None = None
    language_preference: str = "VI"


class ContentRuleRead(BaseModel):
    id: int
    name: str
    rules: str = ""
    brand_id: int
    category: str | None = None
    restricted_words: str | None = None
    warnings: str | None = None
    language_preference: str = "VI"
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
