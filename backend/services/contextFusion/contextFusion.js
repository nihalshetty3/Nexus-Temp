import { normalizeEvent } from "./normalizeEvent.js";
import { plannerAgent } from "./plannerAgent.js";
import { toolExecutor } from "./toolExecutor.js";

export async function contextFusion(event) {

    console.log("\n========== CONTEXT FUSION ==========\n");

    const normalizedEvent = normalizeEvent(event);

    console.log("Normalized Event:");
    console.log(normalizedEvent);

    // const plan = await plannerAgent(normalizedEvent);
    const plan = {
        processable: true,
        workflow: "purchase_approval",
        priority: "high",
        requiredTools: [
            {
                tool: "gmail",
                objective: "Retrieve previous email conversation."
            },
            {
                tool: "google_sheets",
                objective: "Retrieve IT budget."
            },
            {
                tool: "google_docs",
                objective: "Retrieve procurement policy."
            },
            {
                tool: "drive",
                objective: "Retrieve vendor quotation."
            }
        ]
    };
    
    console.log("\nPlanner Output:");
    console.log(plan);

    if (!plan.processable) {
        console.log("\nEvent ignored.");
        console.log("\n====================================\n");
        return;
    }

    const retrievedContext = await toolExecutor(plan.requiredTools);

    console.log("\nRetrieved Context:");
    console.log(retrievedContext);

    console.log("\n====================================\n");
}