import { GoogleGenerativeAI } from "@google/generative-ai";

export async function plannerAgent(normalizedEvent) {

    console.log("Gemini Key:", process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const prompt = `
Your job is to analyze normalized enterprise events and determine whether they require further processing.

You are ONLY responsible for planning.
Do NOT make business decisions.
Do NOT retrieve any information yourself.

Available MCP tools:

1. gmail
- Retrieve related email conversations.

2. google_sheets
- Retrieve budgets, finance sheets and structured tabular data.

3. google_docs
- Retrieve company policies and approval documents.

4. drive
- Retrieve invoices, quotations and PDFs.

Rules:

1. Ignore newsletters, promotions and marketing emails.
2. Ignore irrelevant personal emails.
3. Only process business workflows.

If the event is NOT processable:

Return:

{
    "processable": false,
    "workflow": null,
    "priority": null,
    "requiredTools": [],
    "reason": "..."
}

If the event IS processable:

- Identify the workflow.
- Assign a priority (low, medium, high).
- Select the required MCP tools.
- For every required tool, specify its objective.
- Return ONLY valid JSON.

Schema:

{
    "processable": boolean,

    "workflow": "string",

    "priority": "low | medium | high",

    "requiredTools": [
        {
            "tool": "gmail | google_sheets | google_docs | drive",
            "objective": "What information should this tool retrieve?"
        }
    ],

    "reason": "Explain why this event should or should not be processed."
}

Incoming Event:
${JSON.stringify(normalizedEvent, null , 2)}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return JSON.parse(
        response.replace(/```json/g, "").replace(/```/g, "")
    );
}