import fs from "fs/promises";
import path from "path";
import {google} from "googleapis";
import {authenticate} from "@google-cloud/local-auth";

const SCOPES= [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly"
]

const TOKEN_PATH= path.join(process.cwd() , "token.json");
const CREDENTIALS_PATH= path.join(process.cwd() , "credentials.json");

let authClient = null;

async function loadSavedCredentials() {
    try{
        const content = await fs.readFile(TOKEN_PATH);
        const credentails = JSON.parse(content);

        return google.auth.fromJSON(credentails);
    }
    catch{
        return null;
    }
}

async function saveCredentials(client){
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed;

    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token
    });
    await fs.writeFile(TOKEN_PATH , payload);
}

export async function authorize(){
    if(authClient) return authClient;

    authClient = await loadSavedCredentials();
    if(authClient) return authClient;

    authClient = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH
    });

    if(authClient.credentials){
        await saveCredentials(authClient);
    }
    return authClient;
}