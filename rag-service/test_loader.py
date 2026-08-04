from services.loader import load_documents

docs = load_documents()

print()

print("Documents Loaded:" , len(docs))

print()

for doc in docs:
    print(doc.metadata)
    print(doc.page_content[:300])
    print("-"*50)