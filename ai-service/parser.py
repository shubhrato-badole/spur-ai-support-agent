import json 
import os 
from pypdf import PdfReader
from typing import List, Dict


def parse_pdf(pdf_dir: str) -> List[any]:

    result = []

    for filename in os.listdir(pdf_dir):        
        if not filename.endswith(".pdf"):  
            continue

    file_path = os.path.join(pdf_dir, filename)   

    try:
           reader = PdfReader(file_path) 
           text = "\n".join(
                page.extract_text()
                for page in reader.pages
                if page.extract_text()
            ).strip()
           
           result.append({
                "source_key": os.path.splitext(filename)[0],
                "source_type": "policy",
                 "content": text
            })

           print(f"✅ Parsed: {filename}")
    except Exception as e:
            print(f"❌ Failed: {filename} → {e}")
    
    return result