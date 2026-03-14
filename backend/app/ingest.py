from fastapi import APIRouter, HTTPException
from models.schemas import IngestResponse
from core.rag import ingest_pdfs

router = APIRouter()

@router.post("/ingest", response_model=IngestResponse)
async def ingest_documents():
    """Process all PDFs in data/pdfs/ and build the vector database."""
    try:
        count = ingest_pdfs()
        return IngestResponse(
            message=f"Successfully indexed {count} chunks from legal documents!",
            chunks_indexed=count
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
