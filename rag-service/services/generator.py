import os 
from dotenv import load_dotenv
from google import genai
from services.retriever import retrieve
from services.reranker import rerank

load_dotenv()
client = genai.Client(
    api_key = os.getenv("GEMINI_API_KEY")
)

def ask_rag(question):
    retrieved_chunks = retrieve(question , k=10)
    
    retrieved_chunks = rerank(
        question, 
        retrieved_chunks,
        top_k=3
    )
    
    context=""
    
    for i , chunk in enumerate(retrieved_chunks , 1):
        
        context += f"""
Document {i}
Source: {chunk.metadata["source"]}
{chunk.page_content}
----------------------------------------

"""

    prompt = f"""
You are an Enterprise AI assistant.
Answer ONLY using the retrieved context.
If the answer is not available in the context,
reply:
"I couldn't find relevant information in the enterprise knowledge base."

====================

Context
{context}

====================
Give a professional answer.
"""
    response = client.models.generate_content(
         model="models/gemini-3.6-flash",
        contents=prompt
    )
    return response.text 