import os
import psycopg2
from dotenv import load_dotenv
from embeddings import embed_query

load_dotenv()

def get_db():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def retrieve_chunks(query: str, top_k: int = 5):
    query_embedding = embed_query(query)

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, content, source_type, source_key,
               1 - (embedding <=> %s::vector) AS similarity
        FROM knowledge_chunks
        ORDER BY embedding <=> %s::vector
        LIMIT %s
    """, (query_embedding, query_embedding, top_k))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    results = []
    for row in rows:
        results.append({
            "id": str(row[0]),
            "content": row[1],
            "source_type": row[2],
            "source_key": row[3],
            "similarity": float(row[4])
        })

    return results