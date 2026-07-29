import {google} from "googleapis";
import {authorize} from "./auth.js";

const SPREADSHEET_ID = process.env.BUDGET_SHEET_ID;
const RANGE = "Budget!A:D";

export async function retrieveBudget({department , amount=0}) {

    if(!department) {
        console.log("Department not provided");

        return {
            found: false,
            error: "Department not provided"
        };
    }
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

    for(let i=1; i<rows.length; i++){
        const row = rows[i];

        if(row[0].toLowerCase() === department.toLowerCase()){
            const budget = Number(row[1]);
            const spent = Number(row[2]);
            const remaining = Number(row[3]);

            const utilization = Number(
                ((spent / budget) * 100).toFixed(2)
            );
            return {
                department,

                budget,

                spent,

                remaining,

                requestedAmount: amount,

                sufficientBudget:
                    remaining >= amount,

                utilization,

                status:
                utilization >= 90
                    ? "CRITICAL"
                    : utilization >= 75
                    ? "WARNING"
                    : "HEALTH"
            };
        }
    }
    return {
        department,
        found: false
    };
}