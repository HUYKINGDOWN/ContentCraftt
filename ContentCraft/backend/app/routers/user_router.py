from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user_schema import UserRead, UserCreate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db)):
    return UserService(db).list()


@router.post("", response_model=UserRead)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    return UserService(db).create(payload)


@router.get("/{item_id}", response_model=UserRead)
def get_user(item_id: int, db: Session = Depends(get_db)):
    return UserService(db).get(item_id)
