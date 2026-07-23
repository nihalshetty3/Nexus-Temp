export async function mockDocs(query) {

    console.log("\n===== GOOGLE DOCS MCP =====");
    console.log("Query:", query);

    return {
        approvalLimit: 1000000,
        policy: "Manager approval required above ₹10L"
    };
}