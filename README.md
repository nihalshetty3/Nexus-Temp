# Nexus-Temp
Agentic AI for business automation.

# System Architecture
<img width="592" height="697" alt="image" src="https://github.com/user-attachments/assets/abff48e0-655f-4a0c-8e4f-f42657cd11a9" />

# Visual flow
![Uploading image.png…]()

[ Incoming Webhook HTTP POST ]
              │
              ▼
  ┌───────────────────────┐
  │  Express Ingestion    │ (Validates, extracts payload)
  └───────────┬───────────┘
              │
              ▼
  ┌───────────────────────┐
  │   RabbitMQ Producer   │ (Serializes payload, publishes to exchange)
  └───────────┬───────────┘
              │ [ purchase-events queue ]
              ▼
  ┌───────────────────────┐
  │   RabbitMQ Consumer   │ (Pulls message async, starts trace context)
  └───────────┬───────────┘
              │
              ▼
  ┌───────────────────────┐
  │ Event Normalization   │ (Converts raw schema ➔ Normalized Domain Model)
  └───────────┬───────────┘
              │
              ▼
  ┌───────────────────────┐
  │ Gemini Planner Agent  │ (Zero-shot intent recognition & MCP plan generation)
  └───────────┬───────────┘
              │ [ Directed Acyclic Graph / Tool Plan ]
              ▼
  ┌───────────────────────┐
  │    Tool Executor      │ (Invokes OAuth2 Google MCP connectors)
  └───────────┬───────────┘
              │ [ Raw Google APIs: Gmail, Sheets, Drive ]
              ▼
  ┌───────────────────────┐
  │ Context Fusion Engine │ (Synthesizes intent + spreadsheet balances + PDF quotes)
  └───────────┬───────────┘
              │
              ▼
  ┌───────────────────────┐
  │ Gemini Decision Agent │ (Evaluates policy rules, computes confidence & risk)
  └───────────┬───────────┘
              │
              ├───────────────────────────────────────────┐
              │                                           │
  [ decision == APPROVE / REJECT ]             [ decision == HUMAN_REVIEW ]
              │                                           │
              ▼                                           ▼
  ┌───────────────────────┐                   ┌───────────────────────┐
  │    Action Registry    │                   │ Persistent Task Queue │
  └───────────┬───────────┘                   └───────────┬───────────┘
              │                                           │
       ┌──────┴──────────────┐                            ▼
       ▼                     ▼                ┌───────────────────────┐
┌──────────────┐     ┌──────────────┐         │ React HITL Dashboard  │
│  Sheets Write│     │  Gmail Send  │         └───────────┬───────────┘
│  (v4 API)    │     │  (v1 API)    │                     │ (Admin Single-Click)
└──────────────┘     └──────────────┘                     ▼
                                              ┌───────────────────────┐
                                              │ Resumes Action Engine │
                                              └───────────────────────┘
                                              
