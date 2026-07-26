import "dotenv/config";
console.log("Spreadsheet ID:", process.env.BUDGET_SHEET_ID);
import { retrieveBudegt } from "./services/mcp/google/sheets.js";

async function main() {

    const budget = await retrieveBudegt({
        department: "IT"
    });

    console.log("\n========== SHEETS MCP ==========\n");
    console.log(budget);
}

main();