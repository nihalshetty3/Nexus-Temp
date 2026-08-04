import os 
import json

from langchain_core.documents import Document

from pypdf import PdfReader

KNOWLEDGE_FOLDER = "knowledge"

def load_documents():
    documents = []
    
    for root , dirs , files in os.walk(KNOWLEDGE_FOLDER):
        for file in files:
            filepath = os.path.join(root , file)
            
            if file.endswith(".pdf"):
                reader = PdfReader(filepath)
                text = ""
                
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                    
                documents.append(
                    Document(
                        page_content = text,
                        metadata = {
                            "source": file,
                            "type": "pdf"
                        }
                    )
                )
            elif file.endswith(".json"):
                with open(filepath , "r") as f:
                    data = json.load(f)
                documents.append(
                     Document(
                        page_content=json.dumps(data, indent=2),
                        metadata={
                            "source": file,
                            "type": "json"
                        }
                    )       
                )
    return documents