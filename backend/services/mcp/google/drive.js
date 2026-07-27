import {google} from "googleapis";
import { authorize } from "./auth";

export async function retrieveVendorQuotation(){
    const auth = await authorize();

    const drive = google.drive({
        version: "v3",
        auth
    });

    const response = await drive.files.list({
        q:"name contains quotation",
        fileds: "files(id , name . mimeType , webViewLink)"
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

    return response.data.fields;
}