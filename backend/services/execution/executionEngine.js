import { executionRegistry } from "./executionRegistry.js";

export async function executionEngine(decision, fusedContext) {

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