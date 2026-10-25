from fastapi import APIRouter
from app.services.admin_service import AdminService
router = APIRouter(prefix="/admin", tags=["admin"])
@router.get("/status")
def status():
    return AdminService().status()
