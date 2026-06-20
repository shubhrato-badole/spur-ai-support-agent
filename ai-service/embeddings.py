from google import genai
from google.genai import types
import os
from dotenv import  load_dotenv

load_dotenv() 

client = genai.Client(api_key= os.getenv("GEMINI_API_KEY")) # this is used to get the env os is used ot get the env form env file 

EMBEDDING_MODEL = "text-embedding-004" # we are using this embbedig model or we can alsl it like a ore trainfed ai model that we used to turn the text into samll chunks 


def embed_text(text:str) -> list[float]:

    result = client.models.embed_content(
          model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT")
     )
    return result.embeddings[0].values

def embed_query(query: str) -> list[float]:
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=query,
        config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY")
    )
    return result.embeddings[0].values