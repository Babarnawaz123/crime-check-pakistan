from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    question: str
    language: Optional[str] = "english"

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    sections: list[str]

class IngestResponse(BaseModel):
    message: str
    chunks_indexed: int
