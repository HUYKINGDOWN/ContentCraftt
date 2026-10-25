from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth_schema import RegisterRequest, LoginRequest, AuthResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = AuthService(db).register(payload.email, payload.full_name, payload.password, payload.role)
    return AuthResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        access_token="demo-token",
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService(db).login(payload.email, payload.password)
    return AuthResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        access_token="demo-token",
    )
