from typing import List

def chunk(text:str , chunk_size:int = 500 , chunk_overlap:int = 100) -> List[any]:
    chunks = []
    start = 0 
    text = text.strip() # remove the extra 

    while start < len(text) :
        end = start + chunk_size


        if end < len(text):  
           break_point = text.rfind(".", start, end) 
        if break_point == -1:
         break_point = text.rfind(" " , start, end )  
        end = break_point + 1
        chunk = text[start:end].strip() 
        chunks.append(chunk)
        start = end - chunk_overlap

    return chunks