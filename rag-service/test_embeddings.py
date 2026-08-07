from services.loader import load_documents
from services.chunker import chunk_documents
from services.embeddings import build_vector_store

docs = load_documents()
chunks = chunk_documents(docs)
index = build_vector_store(chunks)

print()

print("Documents:" , len(docs))
print("Chunks:" , len(chunks))
print("Vectors:" , index.ntotal)

print()

print("FAISS index created succesfully")