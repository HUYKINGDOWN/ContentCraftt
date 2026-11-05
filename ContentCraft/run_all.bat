@echo off
title ContentCraft - Khoi Dong He Thong
echo ========================================================
echo   DANG KHOI DONG BACKEND VA FRONTEND CONTENTCRAFT...
echo ========================================================
echo.

:: Khoi dong Backend FastAPI tai cong 8000
start "ContentCraft Backend (Port 8000)" cmd /k "cd /d ""%~dp0backend"" && (if exist .\venv\Scripts\python.exe (.\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) else (python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload))"

:: Khoi dong Frontend Vite React tai cong 5173
start "ContentCraft Frontend (Port 5173)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo He thong dang khoi dong thanh cong!
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8000/docs
echo.
echo Ban co the dong cua so nay sau khi ca 2 terminal da chay.
timeout /t 5
