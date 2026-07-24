
import {executeWorkFlow} from "./workflowExecutor.js";

export async function workflowAgent(llmResponse){
        
         console.log("WorkFlow Agent Started");
    





    await executeWorkflow(llmResponse);

    console.log("Workflow Completed");

}
