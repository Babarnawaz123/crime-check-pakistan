@echo off
echo ============================================
echo  Crime-Check Pakistan - Backend Setup
echo ============================================
echo.

cd backend

echo [1/5] Creating virtual environment...
python -m venv venv
call venv\Scripts\activate

echo.
echo [2/5] Upgrading pip and build tools...
python -m pip install --upgrade pip setuptools wheel

echo.
echo [3/5] Installing numpy and pyarrow (pre-built binaries)...
pip install numpy --only-binary=:all:
pip install pyarrow --only-binary=:all:

echo.
echo [4/5] Installing remaining packages...
pip install fastapi==0.111.0
pip install "uvicorn[standard]==0.29.0"
pip install python-dotenv==1.0.1
pip install groq==0.9.0
pip install lancedb==0.8.2
pip install pypdf==4.2.0
pip install sentence-transformers==3.0.1
pip install python-multipart==0.0.9

echo.
echo [5/5] Done! All packages installed successfully.
echo.
echo ============================================
echo  Next steps:
echo  1. Add your GROQ_API_KEY to backend\.env
echo  2. Run: venv\Scripts\activate
echo  3. Run: uvicorn main:app --reload --port 8000
echo ============================================
pause
