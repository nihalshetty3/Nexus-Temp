import {google} from "googleapis";
import {authorize} from "./auth.js";

const SPREADSHEET_ID = process.env.BUDGET_SHEET_ID;
const RANGE = "Budget!A:D";

export async function retrieveBudegt({department}) {
    const auth = await authorize();

    const sheets = google.sheets({
        version: "v4",
        auth
    });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE
    });

    const rows = response.data.values;

    if(!rows || rows.length===0){
        return null;
    }

    const headers = rows[0];

    for(let i=1; i<rows.length; i++){
        const row = rows[i];

        if(row[0].toLowerCase() === department.toLowerCase()){
            return {
                department: row[0],
                budget: Number(row[1]),
                spent: Number(row[2]),
                remaining: Number(row[3])
            };
        }
    }
    return null;
}