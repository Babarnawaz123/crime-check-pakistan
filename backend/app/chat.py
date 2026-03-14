from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from core.rag import generate_answer

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Answer a legal question using RAG pipeline."""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty!")
    try:
        result = generate_answer(request.question)
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            sections=result["sections"]
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
