from services.retriever import retrieve
from services.reranker import rerank

question = input("Question: ")
chunks = retrieve(question , k=10)

print("\nRetrieved:" , len(chunks))

reranked = rerank(
    question, 
    chunks,
    top_k=3
)

print("\nBEST CHUNKS\n")

for i , chunk in enumerate(reranked , 1):
    print("=" * 70)
    
    print("Rank", i)
    
    print(chunk.metadata)
    
    print()
    
    print(chunk.page_content[:500])