import dotenv from "dotenv";
dotenv.config();
console.log(process.env.BUDGET_WEBHOOK_URL);

import { retrieveBudget } from "./services/mcp/sheets/sheetsClient.js";

async function test() {

    const budget = await retrieveBudget({
        department: "IT"
    });

    console.log(budget);

}

test();