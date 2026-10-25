from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.database import Base, engine
from app import models  # register all model metadata
from app.routers import (
    auth_router, user_router, brand_router, product_router, audience_router,
    content_rules_router, asset_router, image_analysis_router, ai_text_router,
    ai_image_router, content_router, content_version_router, feedback_router,
    analytics_router, publishing_router, admin_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning during table creation: {e}")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="ContentCraft runnable demo API",
    lifespan=lifespan,
)

origins = [x.strip() for x in settings.CORS_ORIGINS.split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


@app.get("/api/health", tags=["system"])
def health():
    return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}


prefix = "/api"
for module in [
    auth_router, user_router, brand_router, product_router, audience_router,
    content_rules_router, asset_router, image_analysis_router, ai_text_router,
    ai_image_router, content_router, content_version_router, feedback_router,
    analytics_router, publishing_router, admin_router,
]:
    app.include_router(module.router, prefix=prefix)
