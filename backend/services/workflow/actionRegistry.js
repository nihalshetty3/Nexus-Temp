// services/workflow/actionRegistry.js

import { retrieveBudget } from "../mcp/sheets/sheetsClient.js";
import { ACTIONS } from "./actions.js";

export const actionRegistry = {

    [ACTIONS.SEND_APPROVAL_EMAIL]: async (context) => {

        console.log("📧 Sending Approval Email");

        // TODO
        // await gmailService.sendApprovalMail(context);

    },

    [ACTIONS.UPDATE_GOOGLE_SHEET]: async (context) => {

        console.log("========== GOOGLE SHEETS ==========");
        const department=context.event.department;
        const amount=Number(context.event.amount);

        const budget=await retrieveBudget({
             department
        });

         if (!budget || !budget.success) {
            throw new Error("Department not found in Budget Sheet");
        }
         const newSpent = Number(budget.spent) + amount;
        const newRemaining = Number(budget.budget) - newSpent;

        await updateBudget({
            department,
            spent: newSpent,
            remaining: newRemaining
        });

        console.log(" Budget Sheet Updated");


    },

    [ACTIONS.CREATE_JIRA_TICKET]: async (context) => {

        console.log(" Creating Jira Ticket");

        // TODO
        // await jiraService.createTicket(context);

    }

};