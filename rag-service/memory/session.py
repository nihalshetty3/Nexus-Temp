import json
import os 

MEMORY_FILE = "memory/chat_history.json"

def load_memory():
    if not os.path.exists (MEMORY_FILE):
        return {}
    
    with open(MEMORY_FILE, "r") as f:
        return json.load(f)
    
def save_memory(memory):
    with open(MEMORY_FILE, "w") as f:
        json.dump(memory, f , indent=4)

def add_message(session_id , role , messsage):
    memory = load_memory()
    
    if session_id not in memory:
        memory[session_id]=[]
    
    memory[session_id].append({
        "role": role,
        "message": messsage
    })
    
    save_memory(memory)

def get_history(session_id , limit=6):
    
    memory = load_memory()
    
    if session_id not in memory:
        return []
    return memory[session_id][-limit:]

def clear_history(session_id):
    memory = load_memory()
    
    if session_id in memory:
        del memory[session_id]
    save_memory(memory)