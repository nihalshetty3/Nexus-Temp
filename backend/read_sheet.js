import "dotenv/config";
import { google } from "googleapis";
import { authorize } from "./services/mcp/google/auth.js";

async function main() {
    const auth = await authorize();
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.BUDGET_SHEET_ID,
        range: "Budget!A:D"
    });
    console.log(response.data.values);
}
main();
