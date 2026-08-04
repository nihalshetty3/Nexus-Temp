import { GoogleGenAI } from "@google/genai";

export async function plannerAgent(normalizedEvent) {

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const prompt = `
You are an Enterprise Planning Agent.

Your ONLY responsibility is to analyze an incoming enterprise event and determine what additional business context is required.

Do NOT make business decisions.
Do NOT approve or reject requests.
Do NOT retrieve any information yourself.

Your job is ONLY to generate MCP tasks.

Available MCP tools and actions:

1. gmail
   - retrieveRelatedEmails

2. google_sheets
   - retrieveBudget
   - retrieveLeaveBalance

3. google_docs
   - retrieveProcurementPolicy
   - retrieveLeavePolicy
   - retrieveTravelPolicy

4. drive
   - retrieveVendorQuotation
   - retrieveInvoice

Rules:

1. Ignore newsletters, promotions and spam.
2. Ignore irrelevant personal emails.
3. Only process enterprise workflows.
4. Return ONLY valid JSON.
5. Every required tool MUST include:
   - tool
   - action
   - params
6. For every processable workflow, extract any business fields that are present.

For purchase_request, extract:
- department
- amount
- vendor
- requester
- item

Return them inside workflowData.

If a field cannot be determined, return null.
If the event is NOT processable return:

{
  "processable": false,
  "workflow": null,
  "priority": null,
  "workflowData": {
  "department": "string | null",
  "amount": "number | null",
  "vendor": "string | null",
  "requester": "string | null",
  "item": "string | null"
},
  "requiredTools": [],
  "reason": "..."
}

If the event IS processable return:

{
  "processable": true,
  "workflow": "string",
  "priority": "low | medium | high",
  "workflowData": {
  "department": "string | null",
  "amount": "number | null",
  "vendor": "string | null",
  "requester": "string | null",
  "item": "string | null"
},

  "requiredTools": [
    {
      "tool": "drive",
      "action": "retrieveVendorQuotation",
      "params": {
        "vendor":"Apple"
      }
    }
  ],
  "reason": "..."
}

Examples

Purchase Request

{
  "processable": true,
  "workflow": "purchase_request",
  "priority": "high",
   "workflowData": {
    "department": "IT",
    "amount": 100000,
    "vendor": "Apple",
    "requester": "John",
    "item": "MacBook Pro"
  },

  "requiredTools": [
    {
      "tool": "google_sheets",
      "action": "retrieveBudget",
      "params": {
        "department": "IT"
      }
    },
    {
      "tool": "google_docs",
      "action": "retrieveProcurementPolicy",
      "params": {}
    },
    {
      "tool": "drive",
      "action": "retrieveVendorQuotation",
      "params": {
        "vendor": "Apple"}
    },
    {
      "tool": "gmail",
      "action": "retrieveRelatedEmails",
      "params": {}
    }
  ],
  "reason": "Requires budget, policy, quotation and previous communication."
}

Leave Request

{
  "processable": true,
  "workflow": "leave_request",
  "priority": "medium",
  "workflowData": {
  "department": null,
  "amount": null,
  "vendor": null,
  "requester": "John",
  "item": null
},
  "requiredTools": [
    {
      "tool": "google_docs",
      "action": "retrieveLeavePolicy",
      "params": {}
    },
    {
      "tool": "google_sheets",
      "action": "retrieveLeaveBalance",
      "params": {}
    }
  ],
  "reason": "Requires leave policy and employee leave balance."
}

Incoming Event:

${JSON.stringify(normalizedEvent, null, 2)}
`;

  try {
    let result;
    let attempt = 0;
    const maxRetries = 3;
    const fallbackModels = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3-flash-preview"];
    let modelIndex = 0;

    while (modelIndex < fallbackModels.length) {
      const currentModel = fallbackModels[modelIndex];
      try {
        result = await ai.models.generateContent({
          model: currentModel,
          contents: prompt,
        });
        break;
      } catch (err) {
        // Check if model is not found/unavailable (404) or daily limit is exhausted (429/quota/limit: 20)
        const isModelUnavailableOrExhausted = err.status === 404 ||
          (err.status === 429 && err.message && (err.message.includes("limit: 20") || err.message.includes("RESOURCE_EXHAUSTED"))) ||
          (err.message && (err.message.includes("no longer available") || err.message.includes("not found") || err.message.includes("NOT_FOUND")));

        if (isModelUnavailableOrExhausted && modelIndex < fallbackModels.length - 1) {
          console.warn(`[Planner Agent] Model ${currentModel} is unavailable or exhausted. Falling back to next model...`);
          modelIndex++;
          continue;
        }

        // If it is a transient error (429/503), retry with backoff on the current model first
        const isRetryable = err.status === 429 || err.status === 503 ||
          (err.message && (err.message.includes("429") || err.message.includes("503") || err.message.includes("RESOURCE_EXHAUSTED") || err.message.includes("UNAVAILABLE")));
        if (isRetryable && attempt < maxRetries) {
          attempt++;
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          console.warn(`[Planner Agent] Transient API error on ${currentModel} (429/503). Retrying attempt ${attempt}/${maxRetries} after ${delay.toFixed(0)}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (modelIndex < fallbackModels.length - 1) {
          // Try next model if retries exhausted
          console.warn(`[Planner Agent] Retries exhausted for ${currentModel}. Falling back to next model...`);
          modelIndex++;
          attempt = 0;
        } else {
          throw err;
        }
      }
    }

    const response = result.text;

    const plannerOutput = JSON.parse(
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
    );

    console.log("\n========== PLANNER OUTPUT ==========");
    console.log(JSON.stringify(plannerOutput, null, 2));

    return plannerOutput;

  } catch (err) {
    console.error("Gemini Error:", err);
    throw err;
  }
}