import { GoogleGenerativeAI } from "@google/generative-ai";

export async function decisionAgent(fusedContext){
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
       model: "gemini-flash-latest"
    });

    const prompt = `
    You are an Enterprise AI Decision Engine.
    
    You have already received ALL necessary business context.
    
    Your job is NOT to retrieve more information.
    
    Your job is ONLY to decide whether the workflow should be:
    
    1. APPROVE
    2. REJECT
    3. HUMAN_REVIEW
    
    Consider:
    
    - Workflow
    - Priority
    - Business Event
    - Company Policy
    - Available Budget
    - Previous Email Discussion
    - Vendor Quotation
    
    Decision Rules:
    
    • If budget is sufficient
    • Policy is satisfied
    • Quotation exists
    
    → APPROVE
    
    If policy is violated
    
    → REJECT
    
    If information is incomplete OR approval authority is unclear
    
    → HUMAN_REVIEW
    
    Return ONLY valid JSON.
    
    Schema:
    
    {
        "decision":"APPROVE | REJECT | HUMAN_REVIEW",
        "confidence":0.0,
        "risk":"LOW | MEDIUM | HIGH",
        "reason":"Explain your decision.",
        "actions":[
            "action1",
            "action2"
        ],
        "requiresHumanApproval":true
    }
    
    Business Context:
    ${JSON.stringify(fusedContext , null , 2)}
`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const clean = response
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim();

    return JSON.parse(clean);
}