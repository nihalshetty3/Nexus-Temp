// services/workflow/workflowExecutor.js

import { actionRegistry } from "./actionRegistry.js";

export async function workflowExecutor(actions, context) {

    for (const action of actions) {

        const handler = actionRegistry[action];

        if (!handler) {

            console.warn(`Unknown action : ${action}`);
            continue;

        }

        try {

            await handler(context);

        }

        catch (err) {

            console.error(`${action} failed`);
            console.error(err.message);

        }

    }

}