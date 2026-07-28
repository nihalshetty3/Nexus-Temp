# Nexus-Temp
Agentic AI for business automation.

# System Architecture
<img width="592" height="697" alt="image" src="https://github.com/user-attachments/assets/abff48e0-655f-4a0c-8e4f-f42657cd11a9" />

# The Internal Architecture & Execution Loop
<img width="374" height="652" alt="Screenshot 2026-07-27 at 9 04 05 PM" src="https://github.com/user-attachments/assets/49fc4735-c4c2-4984-8b03-cedc1ad1ac98" />

# Run inside backend
This:
Builds the backend->
Starts RabbitMQ + Backend ->
Immediately follows the backend logs

docker compose up -d --build && docker logs -f nexus-backend
