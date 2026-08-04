//import readline from "readline/promise";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "process";

export async function waitForApproval(decision) {

    if (process.env.AUTO_APPROVE === "true" || process.env.AUTO_APPROVE === true) {
        console.log("\n[Human Approval] AUTO_APPROVE is enabled. Automatically approving request...");
        return "APPROVED"; // Wait, does the caller expect true/false or a string? Let's check contextFusion.js!
    }

    const rl = readline.createInterface({
        input,
        output
    });

    console.log("\n==============================");
    console.log(" HUMAN APPROVAL REQUIRED");
    console.log("==============================");

    console.log(`Outcome  :${decision.outcome || decision.decision}`);
    console.log(`Risk     :${decision.risk}`);
    console.log(`Reason   :${decision.reason}`);

    const answer = await rl.question("Approve this task? (y/n): ");

    rl.close();

    const ans = answer.trim().toLowerCase();
    return (ans === "y" || ans === "yes") ? "APPROVED" : "REJECTED";
}