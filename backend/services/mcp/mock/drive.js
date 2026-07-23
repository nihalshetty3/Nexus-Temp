export async function mockDrive(query) {

    console.log("\n===== GOOGLE DRIVE MCP =====");
    console.log("Query:", query);

    return {
        fileName: "Dell Monitor Quotation.pdf",
        amount: 500000
    };
}