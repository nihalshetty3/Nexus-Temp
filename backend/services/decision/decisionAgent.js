import { GoogleGenAI } from "@google/genai";

export async function decisionAgent(fusedContext) {

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are an Enterprise Autonomous Business Decision Agent.

Your responsibility is to:
1. Analyze the incoming request.
2. Evaluate all enterprise context.
3. Decide whether to APPROVE, REJECT or HUMAN_REVIEW.
4. If the request can be executed automatically, generate an execution plan.
5. If sending an email is required, generate ONLY the subject and body.
   NEVER generate recipient email addresses.

==================================================
WORKFLOW
==================================================

Workflow:
${fusedContext.workflow.name}

Priority:
${fusedContext.workflow.priority}

==================================================
INCOMING REQUEST
==================================================

${JSON.stringify(fusedContext.event, null, 2)}

==================================================
DEPARTMENT BUDGET
==================================================

${JSON.stringify(fusedContext.context.budget, null, 2)}

==================================================
PROCUREMENT POLICY
==================================================

${JSON.stringify(fusedContext.context.policy, null, 2)}

==================================================
VENDOR QUOTATIONS
==================================================

${JSON.stringify(fusedContext.context.quotations, null, 2)}

==================================================
PREVIOUS RELATED EMAILS
==================================================

${JSON.stringify(fusedContext.context.relatedEmails, null, 2)}

==================================================

Reason using ALL available enterprise context.

Decision Guidelines

APPROVE when:
- Budget is sufficient.
- Procurement policy allows approval.
- Vendor quotation exists.
- No conflicting requests exist.

HUMAN_REVIEW when:
- Manager approval is required.
- Information is incomplete.
- Purchase value exceeds approval threshold.
- Confidence is below 0.80.

REJECT when:
- Budget unavailable.
- Policy violation.
- Mandatory quotation or documents missing.
- Duplicate/conflicting request detected.

When APPROVE:
Generate a professional approval email.

When REJECT:
Generate a professional rejection email explaining why.

When HUMAN_REVIEW:
Do NOT generate an execution plan.

Return ONLY valid JSON.

Schema:

{
    "decision":"APPROVE | REJECT | HUMAN_REVIEW",

    "confidence":0.0,

    "risk":"LOW | MEDIUM | HIGH",

    "reason":"",

    "requiresHumanApproval":true,

    "executionPlan":[
        {
            "service":"gmail",
            "action":"sendEmail",
            "params":{
                "subject":"",
                "body":""
            }
        }
    ]
}

Rules:

- NEVER include recipient email.
- NEVER include markdown.
- NEVER include explanation outside JSON.
- If HUMAN_REVIEW then executionPlan must be [].
`;

    try {

        const result = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        const response = result.text;

        const clean = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const decision = JSON.parse(clean);

        console.log("\n========== DECISION OUTPUT ==========");
        console.log(JSON.stringify(decision, null, 2));

        return decision;

    } catch (err) {
        console.error("Decision Agent Error:", err);
        throw err;
    }
}