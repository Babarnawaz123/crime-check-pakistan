@echo off
echo ============================================
echo  Crime-Check Pakistan - Starting App
echo ============================================
echo.

echo Starting Backend (FastAPI)...
start "Backend" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

echo Starting Frontend (Next.js)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ============================================
echo  App is starting!
echo  Backend:  http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo  Frontend: http://localhost:3000
echo ============================================
pause
