import os
import psycopg2
from dotenv import load_dotenv
from parser import parse_pdf
from chunker import chunk_text
from embeddings import embed_text

load_dotenv()

def get_db():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def ingest_policies(folder_path: str):
    conn = get_db()
    cur = conn.cursor()

    print("📄 Parsing PDF...")
    documents = parse_pdf(folder_path)
    print(f"Parsed {len(documents)} document(s)")

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

        conn.commit()
        print(f"   ✅ Stored: {doc['source_key']}")

    cur.close()
    conn.close()
    print("🎉 Ingestion complete!")

if __name__ == "__main__":
    ingest_policies("docs")