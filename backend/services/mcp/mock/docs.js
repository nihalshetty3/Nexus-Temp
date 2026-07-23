export async function mockDocs(objective) {

    console.log("\n===== GOOGLE DOCS MCP =====");
    console.log("Objective:", objective);

    return {
        approvalLimit: 1000000,
        policy: "Manager approval required above ₹10L"
    };
}