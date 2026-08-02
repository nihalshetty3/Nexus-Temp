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

Your responsibilities are:

1. Analyze the incoming enterprise request.
2. Evaluate ALL retrieved enterprise context.
3. Decide whether the request should be:
   - APPROVE
   - REJECT
   - HUMAN_REVIEW
4. Generate an execution plan for downstream services.

You are NOT allowed to invent information.
Base every decision ONLY on the supplied enterprise context.

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

Evaluate ALL retrieved enterprise context.

Decision Rules

APPROVE when:
- Budget is available.
- Budget is sufficient.
- Procurement policy is satisfied.
- Required vendor quotations exist.
- Required invoices/documents exist (if applicable).
- No duplicate/conflicting requests exist.
- Amount is within automatic approval threshold.

REJECT when:
- Budget unavailable.
- Budget insufficient.
- Procurement policy violated.
- Mandatory quotations/documents missing.
- Duplicate/conflicting requests detected.

HUMAN_REVIEW when:
- Purchase exceeds automatic approval threshold.
- Manager approval required.
- Enterprise information is incomplete.
- Confidence is below 0.80.

--------------------------------------------------

Execution Rules

If decision == APPROVE

Generate:

1. Gmail approval email
2. Slack approval notification

If decision == REJECT

Generate:

1. Gmail rejection email
2. Slack rejection notification

If decision == HUMAN_REVIEW

Generate:

1. Slack notification requesting manager approval.

Do NOT generate Gmail approval/rejection.

Supported execution services

gmail
- sendEmail

slack
- sendMessage

For Gmail:
Generate ONLY:
- subject
- body

Never generate recipient email addresses.

For Slack:
Generate ONE concise notification containing:

- Decision
- Workflow
- Department
- Vendor
- Amount
- Risk
- Confidence
- Reason

Return ONLY valid JSON.

Schema

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
    },

    {
      "service":"slack",
      "action":"sendMessage",
      "params":{
        "message":""
      }
    }

  ]
}

Rules

- NEVER include recipient email.
- NEVER include markdown.
- NEVER include explanation outside JSON.
- If HUMAN_REVIEW:
    - requiresHumanApproval must be true.
    - executionPlan should contain ONLY the Slack notification.
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