import { executionRegistry } from "./executionRegistry.js";

export async function executionEngine(decision){
    if(!decision.executionPlan){
        console.log("No execution tasks.");
        return;
    }

    console.log("\n========== EXECUTION ==========\n");

    for(const task of decision.executionPlan){
        console.log(
            `Executing ${task.service}.${task.action}`
        );

        const service = executionRegistry[task.service];

        if(!service){
            console.log("Unknown service");
            continue;
        }

        const action = service[task.action];

        if(!action){
            console.log("Unknown action");
            continue;
        }

        await action(task.params);
        console.log("Done\n");
    }
}