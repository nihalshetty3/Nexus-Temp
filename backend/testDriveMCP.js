import {retrieveVendorQuotation} from "./services/mcp/google/drive.js";
const files = await retrieveVendorQuotation();

console.log(files);