// testWorkflow.js

import { workflowAgent } from "./services/workflow/workflowAgent.js";

const decision = {
    decision: "APPROVE",
    confidence: 0.95,
    risk: "LOW",
    reason: "Budget available",
    requiresHumanApproval: false
};

const fusedContext = {
    purchaseId: "PUR-101",
    employee: {
        name: "Anvith",
        email: "anvith@gmail.com"
    },
    vendor: "Dell",
    amount: 450000
};

await workflowAgent(decision, fusedContext);