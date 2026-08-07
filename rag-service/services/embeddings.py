from sentence_transformers import SentenceTransformer

import faiss
import pickle
import os

model = SentenceTransformer("all-MiniLM-L6-v2")

def build_vector_store(chunks):
    texts = [chunk.page_content for chunk in chunks]
    embeddings = model.encode(
        texts,
        convert_to_numpy=True
    )
    
    dimension = embeddings.shape[1]
    
    index = faiss.IndexFlatL2(dimension)
    
    index.add(embeddings)
    
    os.makedirs("vectorStore", exist_ok=True)
    
    faiss.write_index(
        index,
        "vectorstore/index.faiss"
    )
    
    with open(
        "vectorstore/chunks.pkl",
        "wb"
    ) as f:
        pickle.dump(chunks, f)
    return index