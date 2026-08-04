import faiss
import pickle

from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")

def retrieve(query , k=10):
    index = faiss.read_index("vectorstore/index.faiss")
    
    with open("vectorstore/chunks.pkl", "rb") as f:
        chunks = pickle.load(f)
        
    query_embedding = model.encode(
        [query],
        convert_to_numpy = True
    )
    
    distances,indices = index.search(query_embedding, k)
    
    results=[]
    
    for idx in indices[0]:
        if idx != -1:
            results.append(chunks[idx])
    return results