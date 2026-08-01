//import readline from "readline/promise";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "process";

export async function waitForApproval(decision) {

    const rl = readline.createInterface({
        input,
        output
    });

    console.log("\n==============================");
    console.log(" HUMAN APPROVAL REQUIRED");
    console.log("==============================");

    console.log(`Decision :${decision.decision}`);
    console.log(`Risk  :${decision.risk}`);
    console.log(`Reason  :${decision.reason}`);

    console.log("\nApprove this request?");
    const answer = await rl.question("Type (y/n): ");

    rl.close();

    return answer.trim().toLowerCase() === "y";
}