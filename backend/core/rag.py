import os
import lancedb
import numpy as np
from groq import Groq
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

VECTOR_DB_PATH  = os.getenv("VECTOR_DB_PATH", "../data/vector_db")
PDF_DIR         = os.getenv("PDF_DIR", "../data/pdfs")
MODEL_NAME      = os.getenv("MODEL_NAME", "llama3-8b-8192")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

# Load embedding model once at startup
print("Loading embedding model...")
embedder = SentenceTransformer(EMBEDDING_MODEL)

# Connect to LanceDB
db = lancedb.connect(VECTOR_DB_PATH)

SYSTEM_PROMPT = """You are Crime-Check Pakistan, an AI legal assistant specializing in Pakistani law.
You ONLY answer based on the provided legal document excerpts from PPC, CrPC, and PECA.

Rules:
1. Every answer MUST cite the exact Section number and Act name.
2. Format answers clearly: Definition → Punishment/Procedure → Citation.
3. Always end with the source: 'According to [Act Name], Section [X]...'
4. If not found in context, say: 'This query is not covered in the provided legal documents. Please consult a qualified lawyer.'
5. Never fabricate sections or laws.
6. Be clear, concise, and accurate.
7. Add a disclaimer at the end: 'This is for educational purposes only, not legal advice.'"""


def extract_text_from_pdfs() -> list[dict]:
    """Read all PDFs and split into chunks."""
    chunks = []

    # Auto-detect PDF files in the directory
    if not os.path.exists(PDF_DIR):
        raise FileNotFoundError(f"PDF directory not found: {PDF_DIR}")

    pdf_files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith(".pdf")]
    if not pdf_files:
        raise FileNotFoundError(f"No PDF files found in {PDF_DIR}")

    # Map filenames to act names
    act_map = {
        "ppc": "PPC",
        "crpc": "CrPC",
        "peca": "PECA"
    }

    for filename in pdf_files:
        # Determine act name from filename
        act_name = "Unknown"
        for key, val in act_map.items():
            if key in filename.lower():
                act_name = val
                break

        path = os.path.join(PDF_DIR, filename)
        print(f"Reading {filename} ({act_name})...")

        try:
            reader = PdfReader(path)
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            continue

        for page_num, page in enumerate(reader.pages):
            text = page.extract_text()
            if not text or len(text.strip()) < 50:
                continue

            text = text.strip()
            chunk_size = 500
            overlap    = 100

            for i in range(0, len(text), chunk_size - overlap):
                chunk = text[i:i + chunk_size].strip()
                if len(chunk) < 100:
                    continue
                chunks.append({
                    "text":   chunk,
                    "act":    act_name,
                    "page":   page_num + 1,
                    "source": filename
                })

    print(f"Total chunks extracted: {len(chunks)}")
    return chunks


def ingest_pdfs() -> int:
    """Process PDFs and store embeddings in LanceDB."""
    chunks = extract_text_from_pdfs()
    if not chunks:
        raise ValueError("No text extracted from PDFs!")

    print("Generating embeddings (this may take a few minutes)...")
    texts      = [c["text"] for c in chunks]
    embeddings = embedder.encode(texts, show_progress_bar=True)

    data = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        data.append({
            "id":     i,
            "text":   chunk["text"],
            "act":    chunk["act"],
            "page":   chunk["page"],
            "source": chunk["source"],
            "vector": embedding.tolist()
        })

    table = db.create_table("legal_docs", data=data, mode="overwrite")
    print(f"Successfully indexed {len(data)} chunks into LanceDB!")
    return len(data)


def search_documents(query: str, top_k: int = 5) -> list[dict]:
    """Search vector DB for relevant chunks."""
    try:
        table = db.open_table("legal_docs")
    except Exception:
        raise RuntimeError("Vector DB not initialized. Please call POST /api/ingest first.")

    query_embedding = embedder.encode([query])[0].tolist()
    results = table.search(query_embedding).limit(top_k).to_list()
    return results


def generate_answer(question: str) -> dict:
    """Full RAG pipeline: retrieve → augment → generate."""
    results = search_documents(question)

    if not results:
        return {
            "answer":   "No relevant legal information found in the documents.",
            "sources":  [],
            "sections": []
        }

    context = ""
    sources  = []

    for r in results:
        context += f"\n[{r['act']} - Page {r['page']}]\n{r['text']}\n---\n"
        source = f"{r['act']} (Page {r['page']})"
        if source not in sources:
            sources.append(source)

    client   = Groq(api_key=os.getenv("GROQ_API_KEY"))
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": f"Legal Context:\n{context}\n\nQuestion: {question}"}
        ],
        temperature=0.1,
        max_tokens=1024
    )

    answer = response.choices[0].message.content
    return {
        "answer":   answer,
        "sources":  sources,
        "sections": []
    }
