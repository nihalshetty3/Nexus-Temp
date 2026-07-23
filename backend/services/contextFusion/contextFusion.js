import { normalizeEvent } from "./normalizeEvent.js";
import { plannerAgent } from "./plannerAgent.js";
import { toolExecutor } from "./toolExecutor.js";
import { fusionService } from "./fusionService.js";

export async function contextFusion(event) {

    console.log("\n========== CONTEXT FUSION ==========\n");

    const normalizedEvent = normalizeEvent(event);

    console.log("Normalized Event:");
    console.log(normalizedEvent);

     const plan = await plannerAgent(normalizedEvent);
    

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

    const fusedContext = fusionService(
        normalizedEvent,
        plan,
        retrievedContext
    );

    console.log("\n========== FUSED CONTEXT ==========\n");
    console.dir(fusedContext, { depth: null });

    console.log("\n====================================\n");
}