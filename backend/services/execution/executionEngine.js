import { executionRegistry } from "./executionRegistry.js";
import { createJiraIssue } from "../mcp/jira/jiraClient.js";

export async function executionEngine(decision, fusedContext) {

    const isHumanReview = decision.outcome === "HUMAN_REVIEW" || 
                          decision.decision === "HUMAN_REVIEW" || 
                          decision.requireHumanApproval === true ||
                          decision.requireHumanApproval === "true" ||
                          decision.requiresHumanApproval === true ||
                          decision.requiresHumanApproval === "true";

    if (isHumanReview) {
        try {
            const ticket = await createJiraIssue({
                summary: `[Human Review Required] ${fusedContext.event?.summary || "Escalated Task"}`,
                description: `Reasoning: ${decision.reason}\nRisk Level: ${decision.risk}\nConfidence: ${typeof decision.confidence === 'number' ? (decision.confidence * 100).toFixed(0) + '%' : decision.confidence}`,
                priority: decision.risk === "HIGH" ? "High" : "Medium"
            });
            
            if (ticket && ticket.key) {
                console.log(`✅ Human review ticket logged in Jira: ${ticket.key}`);
            }
        } catch (err) {
            console.error("⚠️ Failed to automatically create Jira Issue:", err.message);
        }

        console.log("Safely halting automated execution for this event as it requires offline human review.");
        return;
    }

    if (!decision.executionPlan?.length) {
        console.log("No execution tasks.");
        return;
    }

    console.log("\n========== EXECUTION ==========\n");

    for (const task of decision.executionPlan) {

        if (task.service === "gmail") {

            const from = fusedContext.event.payload.from;

            const match = from.match(/<(.+?)>/);

            task.params.to = match
                ? match[1]
                : from;
        }

        const service = executionRegistry[task.service];

        if (!service) {
            console.log(`Unknown service: ${task.service}`);
            continue;
        }

        const action = service[task.action];

        if (!action) {
            console.log(`Unknown action: ${task.action}`);
            continue;
        }

        console.log(`Executing ${task.service}.${task.action}`);

        await action(task.params);

        console.log(" Task completed\n");
    }
}