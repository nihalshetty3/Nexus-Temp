import {google} from "googleapis";
import {authorize} from "./auth.js";
import { GmailQueries } from "./gmailQueries.js";

async function searchEmails(query) {
    console.log("Entered searchEmails");

    return [];
    const auth = await authorize();

    const gmail = google.gmail({
        version: "v1",
        auth
    });

    const response = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: 5
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
        return [];
    }

    return await Promise.all(

        messages.map(async (message) => {

            const mail = await gmail.users.messages.get({
                userId: "me",
                id: message.id
            });

            const headers = mail.data.payload.headers || [];

            const getHeader = (name) =>
                headers.find(h => h.name === name)?.value || "";

            // ===================== NEW =====================

            // Get the Base64 encoded body
            let bodyData = "";

            if (mail.data.payload.parts) {
                const textPart = mail.data.payload.parts.find(
                    part => part.mimeType === "text/plain"
                );

                bodyData = textPart?.body?.data || "";
            } else {
                bodyData = mail.data.payload.body?.data || "";
            }

            // Gmail uses URL-safe Base64 (- and _)
            const decodedBody = bodyData
                ? Buffer.from(
                      bodyData.replace(/-/g, "+").replace(/_/g, "/"),
                      "base64"
                  ).toString("utf8")
                : "";

            // ===============================================

            return {

                source: "gmail",

                id: mail.data.id,

                threadId: mail.data.threadId,

                subject: getHeader("Subject"),

                from: getHeader("From"),

                to: getHeader("To"),

                date: getHeader("Date"),

                snippet: mail.data.snippet,

                body: decodedBody,

                labels: mail.data.labelIds,
                
                hasAttachments:
                    (mail.data.payload.parts || []).some(
                        part => part.filename && part.filename.length > 0
                    ),
            };

        })

    );

}

export async function retrievePurchaseRequests(){
    return await searchEmails(
        GmailQueries.PURCHASE_REQUESTS
    );
}

export async function retrieveApprovalEmails(){
    return await searchEmails(
        GmailQueries.APPROVAL_EMAILS
    );
}

export async function retrieveVendorQuotations(){
    return await searchEmails(
        GmailQueries.VENDOR_QUOTES
    );
}

export async function retrieveBudgetDiscussions(){
    return await searchEmails(
        GmailQueries.BUDGET_DISCUSSIONS
    )
}

export async function retrieveRelatedEmails() {
    console.log("➡️ Fetching purchase requests");
    const purchaseRequests = await retrievePurchaseRequests();
    console.log("✅ Purchase requests:", purchaseRequests.length);

    console.log("➡️ Fetching approval emails");
    const approvalEmails = await retrieveApprovalEmails();
    console.log("✅ Approval emails:", approvalEmails.length);

    console.log("➡️ Fetching vendor quotations");
    const vendorQuotations = await retrieveVendorQuotations();
    console.log("✅ Vendor quotations:", vendorQuotations.length);

    console.log("➡️ Fetching budget discussions");
    const budgetDiscussions = await retrieveBudgetDiscussions();
    console.log("✅ Budget discussions:", budgetDiscussions.length);

    return [
        ...purchaseRequests,
        ...approvalEmails,
        ...vendorQuotations,
        ...budgetDiscussions
    ];
}