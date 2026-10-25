from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.analytics_schema import AnalyticsEventCreate, AnalyticsEventRead, AnalyticsSummaryRead
from app.services.analytics_service import AnalyticsEventService

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/events", response_model=list[AnalyticsEventRead])
def list_items(db: Session = Depends(get_db)):
    return AnalyticsEventService(db).list()


@router.post("/events", response_model=AnalyticsEventRead)
def create_item(payload: AnalyticsEventCreate, db: Session = Depends(get_db)):
    return AnalyticsEventService(db).create(payload)


@router.get("/events/{item_id}", response_model=AnalyticsEventRead)
def get_item(item_id: int, db: Session = Depends(get_db)):
    return AnalyticsEventService(db).get(item_id)


@router.get("/summary", response_model=AnalyticsSummaryRead)
def get_summary(db: Session = Depends(get_db)):
    return AnalyticsEventService(db).summary()
