import * as Gmail from "../mcp/google/gmail.js";
import * as Sheets from "../mcp/google/sheets.js";
import * as Slack from "./slack.js";

export const executionRegistry = {
    gmail: Gmail,
    google_sheets: Sheets,
    slack: Slack
}