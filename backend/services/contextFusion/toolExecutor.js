import * as Gmail from "../mcp/google/gmail.js";

const tools = {
    gmail: Gmail,
};

export async function executeTool(task){
    const tool = tools[task.tool];
    if(!tool) throw new Error(`Unknown tool: ${task.tool}`);

    const action = tool[task.action];
    if(!action) throw new Error(`Unknown action: ${task.action}`);

    return await action (task.params || {});
}