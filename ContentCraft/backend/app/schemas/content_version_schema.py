from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ContentVersionCreate(BaseModel):
    content_id: int
    version_number: int = 1
    body: str = ""
    edited_by_user_id: int | None = 1
    change_summary: str | None = None


class ContentVersionRead(BaseModel):
    id: int
    content_id: int
    version_number: int = 1
    body: str = ""
    edited_by_user_id: int = 1
    change_summary: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
