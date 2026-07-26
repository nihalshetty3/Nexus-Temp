import { executeTool } from "./services/contextFusion/toolExecutor.js";

const task = {
    tool: "gmail",
    action: "retrievePurchaseRequests"
};

const result = await executeTool(task);

console.log(JSON.stringify(result, null, 2));