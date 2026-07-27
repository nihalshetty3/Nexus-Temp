import { authorize } from "./services/mcp/google/auth.js";

console.log("Starting authentication...");

await authorize();

console.log("Authentication complete!");