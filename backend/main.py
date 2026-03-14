from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.chat import router as chat_router
from app.ingest import router as ingest_router

app = FastAPI(
    title="Crime-Check Pakistan API",
    description="AI-powered legal assistant for Pakistani law (PPC, CrPC, PECA)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router,   prefix="/api")
app.include_router(ingest_router, prefix="/api")

@app.get("/")
def root():
    return {
        "status":  "running",
        "project": "Crime-Check Pakistan",
        "version": "1.0.0",
        "docs":    "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
