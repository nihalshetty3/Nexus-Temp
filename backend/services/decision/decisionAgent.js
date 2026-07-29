import { GoogleGenerativeAI } from "@google/generative-ai";

export async function decisionAgent(fusedContext){
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
       model: "gemini-flash-latest"
    });

    const prompt = `
You are an Enterprise Autonomous Business Decision Agent.

Your task is to evaluate the incoming business request using ALL retrieved enterprise context.

Do NOT make a decision based only on the incoming email.

========================
WORKFLOW
========================
Workflow: ${fusedContext.workflow.name}
Priority: ${fusedContext.workflow.priority}

========================
INCOMING REQUEST
========================
${JSON.stringify(fusedContext.event, null, 2)}

========================
DEPARTMENT BUDGET
========================
${JSON.stringify(fusedContext.context.budget, null, 2)}

========================
PROCUREMENT POLICY
========================
${JSON.stringify(fusedContext.context.policy, null, 2)}

========================
VENDOR QUOTATIONS
========================
${JSON.stringify(fusedContext.context.quotations, null, 2)}

========================
PREVIOUS RELATED EMAILS
========================
${JSON.stringify(fusedContext.context.relatedEmails, null, 2)}

--------------------------------------------------------

Reason using ALL the above information.

Follow these steps:

1. Verify whether the department has sufficient remaining budget.

2. Check whether the procurement policy allows automatic approval.

3. Verify vendor quotation availability.

4. Look for previous approvals or rejections for similar purchases.

5. Detect duplicate or conflicting requests if possible.

6. If any important information is missing,
reduce confidence.

7. Explain exactly which pieces of context influenced your decision.

Decision Rules

• APPROVE
Budget available
Policy satisfied
Quotation available

• HUMAN_REVIEW
Policy requires manager approval
Information incomplete
High-value purchase

• REJECT
Budget insufficient
Policy violation
Missing mandatory documents

Return ONLY valid JSON.

Schema:

{
    "decision":"APPROVE | REJECT | HUMAN_REVIEW",

    "confidence":0.0,

    "risk":"LOW | MEDIUM | HIGH",

    "reason":"Explain why the decision was taken using the retrieved business context.",

    "evidence":[
        "Budget remaining: ₹18,00,000",
        "Policy threshold: ₹5,00,000",
        "Vendor quotation found",
        "2 previous MacBook purchases approved"
    ],

    "actions":[
        "action1",
        "action2"
    ],

    "requiresHumanApproval":true
}
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const clean = response
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim();

    return JSON.parse(clean);
}