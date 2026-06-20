import os
import psycopg2
from dotenv import load_dotenv
from parser import load_policies
from chunker import chunk_text
from embeddings import embed_text

load_dotenv()


def get_db():
    return psycopg2.connect(os.getenv("DATABASE_URL"))


def ingest_polices(folder_path:str):
    conn = get_db()
    cur = conn.cursor()

    documents = load_policies(folder_path)

    for doc in documents:
        chunks = chunk_text(doc["content"])
        print(f"   → {len(chunks)} chunks created")

    for i, chunk in enumerate(chunks):
            print(f"   🧮 Embedding chunk {i+1}/{len(chunks)}...")
            embedding = embed_text(chunk)

            cur.execute("""
                INSERT INTO knowledge_chunks      
                (source_type, source_key, content, embedding)
                VALUES (%s, %s, %s, %s)
            """, (
                doc["source_type"],
                doc["source_key"],
                chunk,
                embedding
            ))