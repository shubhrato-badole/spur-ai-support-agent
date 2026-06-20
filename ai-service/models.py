from pydantic import BaseModel
from typing import List

class RetrieveRequest(BaseModel):
    query: str
    top_k: int = 5

class ChunkResult(BaseModel):
    content: str
    source_type: str
    source_key: str
    similarity: float

class RetrieveResponse(BaseModel):
    chunks: List[ChunkResult]

class IngestRequest(BaseModel):
    source_type: str 
    source_key: str
    content: str