from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    description: str = ""
    brand_id: int | None = 1
    category_name: str | None = None
    usp: str | None = None
    key_features: str | None = None
    status: bool = True


class ProductRead(BaseModel):
    id: int
    name: str
    description: str | None = ""
    brand_id: int
    category_name: str | None = None
    usp: str | None = None
    key_features: str | None = None
    status: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
