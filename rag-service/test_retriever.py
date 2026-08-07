from services.retriever import retrieve 
query = input("Ask a question:")

results = retrieve(query)
print()
print("=" * 80)
print("Retrieved Chunks")
print("=" * 80)

for i , chunk in enumerate(results , 1):
    print()
    
    print(f"Results {i}")
    
    print(chunk.metadata)
    print()
    
    print(chunk.page_content)
    print("=" * 80)