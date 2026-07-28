export async function retrieveProcurementPolicy(){
    console.log("Retrieving Procurement Policy...");

    return {
        maxWithoutApproval: 500000,
        approvalRequired: true,
        source: "Google Docs (Mock"
    };
}