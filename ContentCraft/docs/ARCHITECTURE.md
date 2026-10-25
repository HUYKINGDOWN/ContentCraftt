# Architecture
Request flow: **Router (HTTP) → Service (business logic) → Repository (SQLAlchemy query) → Model (table)**. Pydantic schemas validate incoming payloads. Services are instantiated with a SQLAlchemy session injected by FastAPI's `get_db` dependency. Adapters isolate mock AI, storage, vision, OAuth and social providers.

- `core/`: settings, database session, security and logging.
- `shared/`: common exceptions, permissions and utilities.
- `models/`, `schemas/`, `repositories/`, `services/`, `routers/`: five-layer structure.
- `frontend/src/services`: typed fetch wrapper for the REST API.
- AI/publishing providers are deterministic mock implementations; no external credentials are required.
