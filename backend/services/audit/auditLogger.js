import { promises as fs } from "node:fs";
import path from "node:path";

const LOG_FILE = path.resolve("logs/decision-history.json");
console.log("Writing audit log to:", LOG_FILE);

export async function saveAuditLog({
    event,
    fusedContext,
    decision,
    executionPlan,
}) {

    let history =[];

    try{
        const data = await fs.readFile(LOG_FILE, "utf8");
        history = JSON.parse(data);
    }

    catch{
        history=[];
    }

    const record = {
        id: `REQ-${Date.now()}`,
        timestamp: new Date().toISOString(),
        requestor: event.payload.from,
        subject: event.payload.subject,
        workflow: fusedContext.workflow.name,
        decision: decision.decision,
        confidence: decision.confidence,
        risk: decision.risk,
        reason: decision.reason,
        contextUsed:{
            budget:
                !!fusedContext.context?.budget,
            policy:
                !!fusedContext.context?.policy,
            quotations:
                fusedContext.context?.quotations?.quotationCount || 0,
            relatedEmails:
                fusedContext.context?.relatedEmails?.similarPurchases || 0
        },
        
        executedServices:
            executionPlan.map(task => ({
                service: task.service,
                action: task.action
            })),
            status: "SUCCESS"
    };

    console.log("\n===== RECORD =====");
    console.log(record);

    history.unshift(record);

    console.log("\n===== HISTORY =====");
    console.log(history);

    await fs.mkdir(path.dirname(LOG_FILE), {
        recursive: true
    });

    await fs.writeFile(
        LOG_FILE,
        JSON.stringify(history, null , 4)
    );
    console.log("Audit log saved");
}