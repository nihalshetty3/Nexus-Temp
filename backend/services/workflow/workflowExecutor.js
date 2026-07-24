import {actionRegistry} from "./actionRegistry.js";

export async function executeWorkFlow(actions,context){
        console.log("Executing workflow");

        for(const action of actions){
               const handler=actionRegistry[action];

               if(!handler){
                  console.log(`${action} not implemented`);
                  continue;
               }

               await handler(context);
        }
        console.log("\nWorkflow Finished");
        
}