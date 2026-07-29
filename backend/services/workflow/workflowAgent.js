// services/workflow/workflowAgent.js

import { ACTIONS } from "./actions.js";
import { workflowExecutor } from "./workflowExecutor.js";

export async function workflowAgent(decision, fusedContext) {

    let workflow = [];

    switch (decision.decision) {

        case "APPROVE":

            workflow = [

                ACTIONS.SEND_APPROVAL_EMAIL,

                ACTIONS.UPDATE_GOOGLE_SHEET,

                ACTIONS.CREATE_JIRA_TICKET

            ];

            break;

        case "REJECT":

            console.log("Workflow terminated.");

            return;

        case "HUMAN_REVIEW":

            console.log("Waiting for Human Approval...");

            return;

        default:

            throw new Error("Invalid Decision");

    }

    await workflowExecutor(workflow, fusedContext);

}