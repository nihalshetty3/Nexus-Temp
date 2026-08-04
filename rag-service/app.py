from fastapi import FastAPI 
from pydantic import BaseModel

from services.generator import ask_rag

app=FastAPI(title="Enterprise RAG API")

class QueryRequest(BaseModel):
    question: str
    
@app.post("/rag/query")
def query(request: QueryRequest):
    
    answer = ask_rag(request.question)
    return {
        "question": request.question,
        "answer": answer
    }