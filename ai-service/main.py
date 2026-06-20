from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import RetrieveRequest, RetrieveResponse, ChunkResult
from retriever import retrieve_chunks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "spur-rag-ai-service"}

@app.post("/retrieve", response_model=RetrieveResponse)
def retrieve(request: RetrieveRequest):
    chunks = retrieve_chunks(request.query, request.top_k)
    return RetrieveResponse(
        chunks=[ChunkResult(**chunk, metadata={}) for chunk in chunks]
    )