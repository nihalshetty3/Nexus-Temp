from sentence_transformers import CrossEncoder

model = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2"
)

def rerank(question , chunks , top_k=3):
    """
    question : User question
    chunks   : Retrieved LanChain Documents
    """
    
    pairs = [
        (question , chunk.page_content)
        for chunk in chunks
    ]
    
    scores = model.predict(pairs)
    ranked = list(
        zip(chunks , scores)
    )
    
    ranked.sort(
        key=lambda x: x[1],
        reverse=True
    )
    
    return [
        chunk 
        for chunk , score in ranked[:top_k]
    ]