import { google } from "googleapis";
import { authorize } from "./auth.js";

export async function retrieveVendorQuotation(vendor = "") {

    const auth = await authorize();

    const drive = google.drive({
        version: "v3",
        auth
    });

    const query = vendor
        ? `name contains '${vendor}' and name contains 'quotation'`
        : "name contains 'quotation'";

    const response = await drive.files.list({

        q: query,

        fields:
            "files(id,name,mimeType,webViewLink,createdTime)",

        orderBy: "createdTime desc"
    });

    const files = response.data.files || [];

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

export async function retrieveInvoice(vendor = "") {

    const auth = await authorize();

    const drive = google.drive({
        version: "v3",
        auth
    });

    const query = vendor
        ? `name contains '${vendor}' and name contains 'invoice'`
        : "name contains 'invoice'";

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