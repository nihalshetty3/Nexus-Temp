import { mockSheets } from "../mcp/mock/sheets.js";
import { mockDocs } from "../mcp/mock/docs.js";
import { mockDrive } from "../mcp/mock/drive.js";
import { mockGmail } from "../mcp/mock/gmail.js";

export async function toolExecutor(retrievalPlan){

    const retrievedContext = {};

    for(const task of retrievalPlan){
        switch(task.tool){
            case "gmail":
                retrievedContext.gmail =
                    await mockGmail(task.objective);
                break;

            case "google_sheets":
                retrievedContext.budget = 
                    await mockSheets(task.objective);
                break;
            
            case "google_docs":
                retrievedContext.policy = 
                    await mockDocs(task.objective);
                break;

            case "drive":
                retrievedContext.quotation =
                    await mockDrive(task.objective);
                break;
        }
    }
    return retrievedContext;
}