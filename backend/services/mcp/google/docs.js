export async function retrieveProcurementPolicy() {

    console.log("📄 Retrieving Procurement Policy...");

    return {

        policyName: "Procurement Policy v1.0",

        source: "Google Docs",

        maxWithoutApproval: 500000,

        requiresFinanceApprovalAbove: 500000,

        requiresDirectorApprovalAbove: 2000000,

        minimumVendorQuotations: 3,

        mandatoryDocuments: [
            "Vendor Quotation",
            "Purchase Request"
        ],

        approvalHierarchy: [
            "Manager",
            "Finance Manager",
            "Director"
        ],

        autoApprovalAllowed: true
    };
}