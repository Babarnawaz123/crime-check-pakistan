# ⚖️ Crime-Check Pakistan
### AI-Powered Legal Assistant for Pakistani Law

> Ask questions about PPC, CrPC & PECA — get instant cited answers powered by RAG + Llama 3.1

---

## 🚀 Quick Start (For New Users)

### Prerequisites
Before starting, make sure you have these installed:
- **Python 3.12** → https://www.python.org/ftp/python/3.12.9/python-3.12.9-amd64.exe
- **Node.js 18+** → https://nodejs.org/en/download
- **Git** → https://git-scm.com/download/win

---

### Step 1 — Clone the project
```cmd
git clone https://github.com/YOURUSERNAME/crime-check-pakistan.git
cd crime-check-pakistan
```

---

### Step 2 — Get a FREE Groq API Key
1. Go to https://console.groq.com
2. Sign up (free)
3. Click **API Keys → Create API Key**
4. Copy the key (starts with `gsk_...`)

---

### Step 3 — Add your API key
Open `backend/.env` and replace the placeholder:
```
GROQ_API_KEY=gsk_your_actual_key_here
```

---

### Step 4 — Add PDF files (if not included)
Copy your legal PDFs into `data/pdfs/`:
```
data/
└── pdfs/
    ├── PPC.pdf
    ├── CrPC.pdf
    └── PECA.pdf
```

---

### Step 5 — Install & Run (One command!)
Double-click `install_and_run.bat` OR run in CMD:
```cmd
install_and_run.bat
```
This automatically:
- Creates Python virtual environment with Python 3.12
- Installs all backend packages
- Installs frontend packages
- Starts both servers

---

### Step 6 — Index Documents (First time only)
1. Open http://localhost:3000
2. Click **"⚡ Index Documents"** button
3. Wait 3-5 minutes for indexing to complete
4. Start asking legal questions! 🎉

---

## 📁 Project Structure
```
crime-check-pakistan/
├── backend/
│   ├── app/
│   │   ├── chat.py        # Chat API endpoint
│   │   └── ingest.py      # PDF ingestion endpoint
│   ├── core/
│   │   └── rag.py         # RAG pipeline (the brain)
│   ├── models/
│   │   └── schemas.py     # Data models
│   ├── main.py            # FastAPI server
│   ├── requirements.txt   # Python dependencies
│   └── .env               # API keys (add yours here)
├── frontend/
│   ├── app/
│   │   ├── page.tsx       # Main chat UI
│   │   ├── layout.tsx     # App layout
│   │   └── globals.css    # Styles
│   └── lib/
│       └── api.ts         # API helper
├── data/
│   ├── pdfs/              # Legal PDF files go here
│   └── vector_db/         # Auto-generated after indexing
├── install_and_run.bat    # One-click setup & start
├── start_app.bat          # Start servers (after first install)
└── README.md
```

---

## 🔗 URLs
| URL | Description |
|-----|-------------|
| http://localhost:3000 | Frontend chat interface |
| http://localhost:8000 | Backend API |
| http://localhost:8000/docs | Interactive API docs |

---

## 🛠️ Tech Stack
| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.12 |
| LLM | Groq API (Llama 3.1 8B) |
| Embeddings | Sentence Transformers |
| Vector DB | LanceDB |
| PDF Parser | PyPDF |

---

## ❓ Troubleshooting

**Backend won't start?**
- Make sure Python 3.12 is installed: `py -3.12 --version`
- Make sure venv is activated: you should see `(venv)` in terminal
- Re-run: `install_and_run.bat`

**"Vector DB not initialized" error?**
- Click **"⚡ Index Documents"** button first
- Wait for indexing to complete before asking questions

**Groq API error?**
- Check your API key in `backend/.env`
- Make sure key starts with `gsk_`
- Get a free key at https://console.groq.com

**npm not found?**
- Install Node.js from https://nodejs.org
- Restart CMD after installing

---

## ⚠️ Disclaimer
This tool is for **educational purposes only** and does not constitute legal advice.
Always consult a qualified lawyer for legal matters.

---

## to run the Backend 
cd E:\crime-check-pakistan\backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000

cd E:\crime-check-pakistan\frontend
npm run dev
