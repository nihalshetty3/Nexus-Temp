import express from "express";
import { executionRegistry } from "../services/execution/executionRegistry.js";

const router = express.Router();

function getCustomerEmail(issue) {
    const description = issue.fields?.description || "";
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = description.match(emailRegex);

    if (matches && matches.length > 0) {
        const realEmail = matches.find(e => !e.includes("example.com"));
        if (realEmail) return realEmail;
    }

    const reporterEmail = issue.fields?.reporter?.emailAddress;
    if (reporterEmail && !reporterEmail.includes("example.com")) {
        return reporterEmail;
    }

    return null;
}

router.post("/", async (req, res) => {
    try {
        const { issue, changelog } = req.body;

        if (!issue) return res.status(200).send("No issue payload");

        const statusChange = changelog?.items?.find(item => item.field === "status");
        const rawStatus = statusChange?.toString || issue.fields?.status?.name || "";
        const cleanStatus = rawStatus.toLowerCase().trim();

        const issueKey = issue.key;
        const summary = issue.fields?.summary || "Purchase Request";
        const targetEmail = getCustomerEmail(issue);

        console.log(`\n🔔 Jira Event: ${issueKey} moved to [${rawStatus}]`);

        if (!targetEmail) {
            console.log(`⚠️ Aborting dispatch: No valid real customer email found in ${issueKey}`);
            return res.status(200).send("No valid customer email found");
        }

        // --- 1. APPROVED PATH ---
        if (["done", "approved"].includes(cleanStatus)) {
            console.log(`📧 Sending APPROVAL email to customer: ${targetEmail}`);
            await executionRegistry.gmail.sendEmail({
                to: targetEmail,
                subject: `[APPROVED] Purchase Request: ${summary}`,
                body: `Hello,\n\nYour purchase request (${issueKey}) has been officially APPROVED.\n\nSummary: ${summary}\n\nRegards,\nEnterprise Ops Team`
            });
        }
        // --- 2. REJECTED PATH ---
        else if (["rejected", "cancelled", "declined", "won't do"].includes(cleanStatus)) {
            console.log(`📧 Sending REJECTION email to customer: ${targetEmail}`);
            await executionRegistry.gmail.sendEmail({
                to: targetEmail,
                subject: `[REJECTED] Purchase Request: ${summary}`,
                body: `Hello,\n\nYour purchase request (${issueKey}) was REJECTED during review.\n\nSummary: ${summary}\nReason: Standard procurement requirements or budget approvals were not fulfilled.\n\nRegards,\nEnterprise Ops Team`
            });
        }

        res.status(200).send("Webhook processed successfully");
    } catch (err) {
        console.error("Jira Webhook Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

export default router;