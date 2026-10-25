from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AssetCreate(BaseModel):
    name: str = "asset"
    url: str = ""
    kind: str = "image/jpeg"
    product_id: int | None = 1
    extracted_tags: str | None = None
    color_palette: str | None = None


class AssetRead(BaseModel):
    id: int
    name: str = "asset"
    url: str = ""
    kind: str = "image/jpeg"
    product_id: int = 1
    extracted_tags: str | None = None
    color_palette: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
