
import {executeWorkFlow} from "./workflowExecutor.js";

export async function workflowAgent(decision){
        
         console.log("WorkFlow Agent Started");

         if (
        decision.decision !== "AUTO_APPROVE" &&
       decision.decision !== "HUMAN_APPROVED"
    ) {
        console.log("Workflow not executed.");
        return;
    }




const actions = [
        "SEND_APPROVAL_EMAIL",
        "UPDATE_GOOGLE_SHEET",
       
    ];

    await executeWorkflow(actions, decision);

    console.log("Workflow Completed");

}
