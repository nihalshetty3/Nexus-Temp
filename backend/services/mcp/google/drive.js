import {google} from "googleapis";
import { authorize } from "./auth.js";

export async function retrieveVendorQuotation(vendor){
    const auth = await authorize();

    const drive = google.drive({
        version: "v3",
        auth
    });

    const response = await drive.files.list({
        q: "name contains 'quotation'",
        fields: "files(id , name , mimeType , webViewLink)"
    });

    return response.data.files;
}

export async function retrieveInvoice(){
    const auth = await authorize();

    const drive = google.drive({
        version:"v3",
        auth
    });

    const response = await drive.files.list({
        q:"name contains 'invoice'",
        fields:"files(id , name , webViewLink)"
    });

    return response.data.files;
}