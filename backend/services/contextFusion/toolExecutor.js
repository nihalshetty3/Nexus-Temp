import * as Gmail from "../mcp/google/gmail.js";
import * as Sheets from "../mcp/google/sheets.js";
import * as Drive from "../mcp/google/drive.js";
const tools = {
    gmail: Gmail,
    google_sheets: Sheets,
    drive: Drive
};

export async function executeTool(task){
    const tool = tools[task.tool];
    if(!tool) throw new Error(`Unknown tool: ${task.tool}`);

    const action = tool[task.action];
    if(!action) throw new Error(`Unknown action: ${task.action}`);

    return await action (task.params || {});
}