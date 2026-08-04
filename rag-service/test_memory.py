from memory.session import (
    add_message,
    get_history,
    clear_history
)

session="nihal"

clear_history(session)

add_message(session , "user", 
            "Why was my desktop request rejected?")

add_message(
    session,
    "assistant",
    "Your desktop request was rejected because duplicate purchase requests were detected and the requested quantity did not match the quotation."
)

add_message(
    session,
    "user",
    "Who was the vendor?"
)

add_message(
    session,
    "assistant",
    "The vendor was BenQ India Pvt Ltd."
)

history=get_history(session)

print()

print("="*80)

print("Conversation History")

print("=" * 80)

for msg in history:
    print(f"{msg['role']} : {msg['message']}")