import { google } from "googleapis";
import { authorize } from "./auth.js";

export async function retrieveVendorQuotation(params={}) {
    console.log("\n===== RAW PARAMS =====");
console.log(params);

console.log("\n===== PARAMS.VENDOR =====");
console.log(params.vendor);

console.log("\n===== TYPE =====");
console.log(typeof params.vendor);

    const vendor = (params.vendor || "")
    .toLowerCase()
    .replace(/\b(india|pvt|ltd)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

    const auth = await authorize();

    const drive = google.drive({
        version:"v3",
        auth
    });

    const query = "name contains 'quotation'";

        console.log("\n===== DRIVE QUERY =====");
        console.log(query);

    const response = await drive.files.list({

        q: query,

        fields:
            "files(id,name,mimeType,webViewLink,createdTime)",

        orderBy: "createdTime desc"
    });

    const files = response.data.files || [];
    console.log("\n===== DRIVE FILES =====");
    console.log(files);

    console.log("\n===== DRIVE RESULT =====");
    console.log(JSON.stringify({
    available: files.length > 0,
    quotationCount: files.length,
    files
}, null, 2));

    return {

        vendor: vendor || "Unknown",

        available: files.length > 0,

        quotationCount: files.length,

        latestQuotation:

            files.length > 0
                ? {
                    name: files[0].name,
                    link: files[0].webViewLink,
                    createdTime: files[0].createdTime
                }
                : null,

        quotations: files
    };
    
}

export async function retrieveInvoice(params={}) {

    const vendor = (params.vendor || "")
    .toLowerCase()
    .replace(/\b(india|pvt|ltd)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
    const auth = await authorize();

    const drive = google.drive({
        version: "v3",
        auth
    });

    const query = "name contains 'quotation'";

    const response = await drive.files.list({

        q: query,

        fields:
            "files(id,name,webViewLink,createdTime)",

        orderBy: "createdTime desc"
    });

    const files = response.data.files || [];

    return {

        vendor: vendor || "Unknown",

        available: files.length > 0,

        invoiceCount: files.length,

        latestInvoice:

            files.length > 0
                ? {
                    name: files[0].name,
                    link: files[0].webViewLink,
                    createdTime: files[0].createdTime
                }
                : null,

        invoices: files
    };
}