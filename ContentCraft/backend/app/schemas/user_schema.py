from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str = "demo1234"
    role: str = "BrandOwner"


class UserRead(BaseModel):
    id: int
    email: str
    full_name: str
    role: str = "BrandOwner"
    status: str = "Active"
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
