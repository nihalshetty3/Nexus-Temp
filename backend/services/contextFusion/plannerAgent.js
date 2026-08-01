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
   - retrieveEmailThread

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
      "params": {}
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

        const result = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

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