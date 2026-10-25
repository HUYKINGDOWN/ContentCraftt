from sqlalchemy.orm import Session
from app.models.user_model import User
from app.core.security import hash_password, verify_password
from fastapi import HTTPException


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, email: str, full_name: str, password: str, role: str = "BrandOwner"):
        if self.db.query(User).filter(User.email == email).first():
            raise HTTPException(409, "Email already registered")
        user = User(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
            role=role or "BrandOwner",
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def login(self, email: str, password: str):
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(401, "Invalid email or password")
        return user
