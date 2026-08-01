import { workflowAgent } from "./services/workflow/workflowAgent.js";

const decision = {
    decision: "APPROVE"
};

const fusedContext = {

    workflowData: {
        department: "IT",
        amount: 100000,
        vendor: "Apple",
        requester: "John",
        item: "MacBook Pro"
    },

    businessContext: {
        budget: {
            success: true,
            department: "IT",
            budget: 500000,
            spent: 100000,
            remaining: 400000
        }
    }

};

await workflowAgent(decision, fusedContext);