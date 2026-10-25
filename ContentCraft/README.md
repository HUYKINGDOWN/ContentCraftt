# ContentCraft — runnable demo scaffold

Demo nền tảng quản lý thương hiệu/sản phẩm/đối tượng và tạo nội dung. Backend dùng FastAPI + SQLAlchemy + Pydantic, phân lớp Router → Service → Repository → Model; frontend dùng React + Vite + TypeScript.

## Chạy nhanh bằng Docker
1. Cài Docker Desktop.
2. Tại thư mục này chạy: `docker compose up --build`
3. API: http://localhost:8000/docs — frontend: http://localhost:5173
4. Health check: http://localhost:8000/api/health

Docker Compose khởi chạy PostgreSQL. Backend tạo bảng tự động khi khởi động để tiện demo; Alembic được cấu hình sẵn cho migration về sau.

## Chạy backend không dùng Docker
Python 3.11+:
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# đổi DATABASE_URL trong .env thành sqlite:///./contentcraft.db nếu chạy ngoài Docker
uvicorn app.main:app --reload
```
Lưu ý: `backend/app/core/config.py` đọc `.env` ở thư mục dự án; khi chạy từ `backend/`, có thể đặt biến môi trường hoặc tạo `backend/.env`. Với cấu hình local dễ nhất, dùng Docker Compose.

## Demo API
- `POST /api/auth/register` — tạo tài khoản demo
- `POST /api/auth/login` — đăng nhập demo (không dùng cho production)
- `GET/POST /api/brands`
- `GET/POST /api/products`
- `GET/POST /api/audiences`
- `GET/POST /api/content-rules`
- `GET/POST /api/contents`
- `POST /api/ai/text` — sinh nội dung mẫu deterministic, không gọi dịch vụ AI thật
- `GET /api/analytics/summary`

## Ghi chú
Đây là scaffold chạy demo, không phải bản production: auth demo chưa phát hành JWT, publishing/social adapters là mock, AI là mock, cần bổ sung migration/review bảo mật/validation/kiểm thử trước khi triển khai thật.
