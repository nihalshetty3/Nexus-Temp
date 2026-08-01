import * as Gmail from "../mcp/google/gmail.js";
import * as Sheets from "../mcp/google/sheets.js";
import * as Drive from "../mcp/google/drive.js";
import * as Docs from "../mcp/google/docs.js";

const tools = {
    gmail: Gmail,
    google_sheets: Sheets,
    drive: Drive,
    google_docs: Docs
};

// export async function executeTool(task) {
//     const tool = tools[task.tool];
//     if (!tool) throw new Error(`Unknown tool: ${task.tool}`);

//     console.log("Tool:", task.tool);
//     console.log("Requested action:", task.action);
//     console.log("Available actions:", Object.keys(tool));

//     const action = tool[task.action];
//     if (!action) throw new Error(`Unknown action: ${task.action}`);

//     return await action(task.params || {});
// }

export async function executeTool(task) {

    console.log("\n========== EXECUTE TOOL ==========");
    console.log("FULL TASK:");
    console.log(JSON.stringify(task, null, 2));

    const tool = tools[task.tool];
    if (!tool) throw new Error(`Unknown tool: ${task.tool}`);

    console.log("Tool:", task.tool);
    console.log("Requested action:", task.action);
    console.log("Params:");
    console.log(task.params);
    console.log("Available actions:", Object.keys(tool));

    const action = tool[task.action];
    if (!action) throw new Error(`Unknown action: ${task.action}`);

    return await action(task.params || {});
}