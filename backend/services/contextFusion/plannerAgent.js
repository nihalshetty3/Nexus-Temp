import { GoogleGenerativeAI } from "@google/generative-ai";

export async function plannerAgent(normalizedEvent) {

    console.log("Gemini Key:", process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite"
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


If the event is NOT processable return:

{
  "processable": false,
  "workflow": null,
  "priority": null,
  "requiredTools": [],
  "reason": "..."
}

If the event IS processable return:

{
  "processable": true,
  "workflow": "string",
  "priority": "low | medium | high",
  "requiredTools": [
    {
      "tool": "tool_name",
      "action": "action_name",
      "params": {}
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

    const result = await model.generateContent(prompt);

    const response = result.response.text();
    const plannerOutput = JSON.parse(
        response.replace(/```json/g, "").replace(/```/g, "")
    );
    
    console.log("\n========== PLANNER OUTPUT ==========");
    console.log(JSON.stringify(plannerOutput, null, 2));
    
    return plannerOutput;
}