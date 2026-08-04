from services.loader import load_documents
from services.chunker import chunk_documents

docs = load_documents()
chunks = chunk_documents(docs)

print(f"\nOriginal Documents: {len(docs)}")
print(f"Generated Chunks: {len(chunks)}")

for i , chunk in enumerate(chunks[:5]):
    print(f"Chunk {i+1}")
    print(chunk.metadata)
    print(chunk.page_content)
    print("-"* 80)