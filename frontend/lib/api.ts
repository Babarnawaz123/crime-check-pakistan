const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChatResponse {
  answer: string;
  sources: string[];
  sections: string[];
}

export interface IngestResponse {
  message: string;
  chunks_indexed: number;
}

export async function sendQuestion(question: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to get answer");
  }
  return res.json();
}

export async function ingestDocuments(): Promise<IngestResponse> {
  const res = await fetch(`${API_BASE}/api/ingest`, { method: "POST" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Ingestion failed");
  }
  return res.json();
}