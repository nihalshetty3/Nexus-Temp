import { google } from "googleapis";
import { authorize } from "./auth.js";
import { GmailQueries } from "./gmailQueries.js";

async function searchEmails(query) {

    const auth = await authorize();

    const gmail = google.gmail({
        version: "v1",
        auth
    });

    const response = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: 10
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
        return [];
    }

    const emails = await Promise.all(

        messages.map(async (message) => {

            const mail = await gmail.users.messages.get({
                userId: "me",
                id: message.id
            });

            const headers = mail.data.payload.headers || [];

            const getHeader = (name) =>
                headers.find(h => h.name === name)?.value || "";

            let bodyData = "";

            if (mail.data.payload.parts) {

                const textPart = mail.data.payload.parts.find(
                    part => part.mimeType === "text/plain"
                );

                bodyData = textPart?.body?.data || "";

            } else {

                bodyData = mail.data.payload.body?.data || "";
            }

            const body = bodyData
                ? Buffer.from(
                      bodyData.replace(/-/g, "+").replace(/_/g, "/"),
                      "base64"
                  ).toString("utf8")
                : "";

            return {

                subject: getHeader("Subject"),

                from: getHeader("From"),

                date: getHeader("Date"),

                snippet: mail.data.snippet,

                body
            };

        })

    );

    return emails;
}
function summarizeEmails(emails) {

    const approvals = emails.filter(email => {

        const text =
            (email.subject + " " + email.body).toLowerCase();

        return (
            text.includes("approved") ||
            text.includes("approval granted")
        );

    }).length;

    const rejections = emails.filter(email => {

        const text =
            (email.subject + " " + email.body).toLowerCase();

        return (
            text.includes("rejected") ||
            text.includes("declined")
        );

    }).length;

    return {

        similarPurchases: emails.length,

        approvals,

        rejections,

        latestDiscussion:

            emails.length > 0
                ? emails[0].snippet
                : null,

        latestEmailDate:

            emails.length > 0
                ? emails[0].date
                : null,

        emails
    };
}

export async function retrieveRelatedEmails() {

    const purchaseRequests =
        await searchEmails(GmailQueries.PURCHASE_REQUESTS);

    const approvalEmails =
        await searchEmails(GmailQueries.APPROVAL_EMAILS);

    const vendorQuotations =
        await searchEmails(GmailQueries.VENDOR_QUOTES);

    const budgetDiscussions =
        await searchEmails(GmailQueries.BUDGET_DISCUSSIONS);

    const allEmails = [

        ...purchaseRequests,

        ...approvalEmails,

        ...vendorQuotations,

        ...budgetDiscussions
    ];

    return summarizeEmails(allEmails);
}

export async function sendEmail(params){
    const auth = await authorize();

    const gmail = google.gmail({
        version:"v1",
        auth
    });

    const email = [
        `To: ${params.to}`,
        "Content-Type: text/plain; charset=UTF-8",
        "MIME-Version: 1.0",
        `Subject: ${params.subject}`,
        "",
        params.body
    ].join("\n");

    const encoded = Buffer 
        .from(email)
        .toString("base64")
        .replace(/\+/g,"-")

        .replace(/\//g,"_")

        .replace(/=+$/,"");

        await gmail.users.messages.send({
            userId:"me",
            requestBody:{
                raw: encoded
            }
        });

        console.log("Email sent");
}