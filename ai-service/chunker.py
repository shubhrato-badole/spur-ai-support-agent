from typing import List

def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 100) -> List[str]:
    chunks = []
    start = 0
    text = text.strip()

    while start < len(text):
        end = start + chunk_size

        if end < len(text):
            break_point = text.rfind(".", start, end)
            if break_point == -1:
                break_point = text.rfind(" ", start, end)
            if break_point != -1:          # ← THIS check was missing
                end = break_point + 1

        chunk = text[start:end].strip()
        if chunk:                           # ← also avoid empty chunks
            chunks.append(chunk)

        start = end - chunk_overlap

        if start <= 0 and len(chunks) > 0:  # ← safety net against infinite loop
            start = end

    return chunks