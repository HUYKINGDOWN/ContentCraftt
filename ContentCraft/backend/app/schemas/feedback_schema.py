from datetime import datetime
from pydantic import BaseModel, ConfigDict


class FeedbackCreate(BaseModel):
    content_id: int | None = 1
    rating: int = 5
    comment: str = ""


class FeedbackRead(BaseModel):
    id: int
    content_id: int = 1
    rating: int = 5
    comment: str = ""
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
