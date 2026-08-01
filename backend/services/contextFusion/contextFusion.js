import { normalizeEvent } from "./normalizeEvent.js";
import { plannerAgent } from "./plannerAgent.js";
import { executeTool } from "./toolExecutor.js";
import { fusionService } from "./fusionService.js";
import { decisionAgent } from "../decision/decisionAgent.js";
import { waitForApproval } from "../execution/humanApprovals.js";
import { executionEngine } from "../execution/executionEngine.js";
import { workflowAgent } from "../workflow/workflowAgent.js";
export async function contextFusion(event) {

    console.log("\n========== CONTEXT FUSION ==========\n");

    const normalizedEvent = normalizeEvent(event);

    console.log("Normalized Event:");
    console.log(normalizedEvent);

    const plan = await plannerAgent(normalizedEvent);


    // console.log("\nPlanner Output:");
    // console.log(plan);

    if (!plan.processable) {
        console.log("\nEvent ignored.");
        console.log("\n====================================\n");
        return;
    }

    const retrievedContext = [];
    for (const task of plan.requiredTools) {
        const result = await executeTool(task);
        retrievedContext.push(result);
    }

    console.log("\n========== TOOL EXECUTION ==========\n");

    for (let i = 0; i < plan.requiredTools.length; i++) {
        const task = plan.requiredTools[i];
        const result = retrievedContext[i];

        console.log(
            ` ${task.tool}.${task.action} → ${Array.isArray(result) ? result.length + " records" : "Success"
            }`
        );
    }

    const fusedContext = fusionService(
        normalizedEvent,
        plan,
        retrievedContext
    );

    console.log("\n========== FUSED CONTEXT ==========\n");

    console.log({
        event: fusedContext.event.summary,
        workflow: fusedContext.workflow.name,
        priority: fusedContext.workflow.priority,
        contextSources: {
            budget: fusedContext.context.budget ? 1 : 0,
            policy: fusedContext.context.policy ? 1 : 0,
            quotations: fusedContext.context.quotations.length,
            relatedEmails: fusedContext.context.relatedEmails.length
        }
    });

    const decision = await decisionAgent(fusedContext);
    if (decision.decision === "HUMAN_REVIEW") {
        const approved = await waitForApproval(decision);
    }

    console.log("\n========== DECISION ==========\n");

    console.log(`Decision   : ${decision.decision}`);
    console.log(`Risk       : ${decision.risk}`);
    console.log(`Confidence : ${(decision.confidence * 100).toFixed(0)}%`);
    console.log(`Reason     : ${decision.reason}`);

    if (decision.actions?.length) {
        console.log("\nActions:");
        decision.actions.forEach(action => console.log(`• ${action}`));
    }

    if(decision.requireHumanApproval){
        const status = await waitForApproval(decision);

        if(status==="REJECTED"){
            console.log("Human rejected the request");
            console.log("Workflow terminated");

            return;
        }
        console.log("human approved the request");
    }

    console.log("\n========== EXECUTION ==========\n");

    await executionEngine(decision , fusedContext);

    await workflowAgent(decision,fusedContext);

    console.log("\n====================================\n");
    

}
