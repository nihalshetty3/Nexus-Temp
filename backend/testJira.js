import dotenv from "dotenv";
import path from "path";

// Tell dotenv to look inside backend/.env relative to the current file
dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });

import { createJiraIssue } from "./services/mcp/jira/jiraClient.js";

async function runTest() {
    console.log("🧪 Testing Jira Ticket Creation...\n");

    try {
        const result = await createJiraIssue({
            summary: "[Test] High-Risk Purchase Request Review Required",
            description: "Automated test ticket triggered by Nexus Multi-Agent Engine.",
            priority: "High"
        });

        console.log("\nResult:", result);
    } catch (err) {
        console.error("\nTest Failed:", err.message);
    }
}

runTest();