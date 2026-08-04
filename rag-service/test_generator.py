from dotenv import load_dotenv
load_dotenv()

from services.generator import ask_rag

while True:
    question = input("\nAsk>")
    if question.lower() == "exit":
        break
    
    answer = ask_rag(question)
    print()
    print("=" * 80)
    
    print(answer)
    print("=" * 80)