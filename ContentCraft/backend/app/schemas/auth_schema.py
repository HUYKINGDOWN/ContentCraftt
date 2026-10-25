from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "BrandOwner"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str = "BrandOwner"
    access_token: str = "demo-token"
    token_type: str = "bearer"
