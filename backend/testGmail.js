import { retrievePurchaseRequests } from "./services/mcp/google/gmail.js";

const emails = await retrievePurchaseRequests();
console.log(JSON.stringify(emails , null , 2));
