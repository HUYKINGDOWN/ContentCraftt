from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str = "demo1234"
    role: str = "BrandOwner"


class UserUpdate(BaseModel):
    email: str | None = None
    full_name: str | None = None
    role: str | None = None
    status: str | None = None


class UserRead(BaseModel):
    id: int
    email: str
    full_name: str
    role: str = "BrandOwner"
    status: str = "Active"
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
