import {actionRegistry} from "./actionRegistry.js";

export async function executeWorkFlow(actions,context){
        console.log("Executing workflow");
         
    const workflow = [

        "SEND_EMAIL",

        "UPDATE_SHEET",

        "CREATE_JIRA"

    ];

        for(const action of actions){
               const handler=actionRegistry[action];

               if(handler){
                  await handler(context);
               }

             
        }
        console.log("\nWorkflow Finished");

}