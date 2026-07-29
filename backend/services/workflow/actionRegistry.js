// services/workflow/actionRegistry.js

import { ACTIONS } from "./actions.js";

export const actionRegistry = {

    [ACTIONS.SEND_APPROVAL_EMAIL]: async (context) => {

        console.log("📧 Sending Approval Email");

        // TODO
        // await gmailService.sendApprovalMail(context);

    },

    [ACTIONS.UPDATE_GOOGLE_SHEET]: async (context) => {

       // actionRegistry.js



    console.log("========== MOCK GOOGLE SHEETS ==========");
    console.log("Updating Purchase...");
    console.log(JSON.stringify(context, null, 2));
    console.log("✅ Sheet Updated Successfully (Mock)");


    },

    [ACTIONS.CREATE_JIRA_TICKET]: async (context) => {

        console.log("🎫 Creating Jira Ticket");

        // TODO
        // await jiraService.createTicket(context);

    }

};