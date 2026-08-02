import axios from "axios";

export async function createJiraIssue({ summary, description, priority = "Medium" }) {
    // Read directly from your .env key names
    let host = process.env.JIRA_DOMAIN || process.env.JIRA_HOST;
    const email = process.env.JIRA_USER_EMAIL || process.env.JIRA_EMAIL;
    const token = process.env.JIRA_API_TOKEN;
    const projectKey = process.env.JIRA_PROJECT_KEY || "KAN";

    if (!host || !email || !token) {
        console.warn("⚠️ Jira credentials missing in .env. Skipping Jira ticket creation.");
        return null;
    }

    // Clean up host string if https:// or trailing slashes were included in .env
    host = host.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Basic Auth encoding for Atlassian REST API v3
    const authHeader = Buffer.from(`${email}:${token}`).toString("base64");

    const payload = {
        fields: {
            project: { key: projectKey },
            summary: summary,
            description: {
                type: "doc",
                version: 1,
                content: [
                    {
                        type: "paragraph",
                        content: [{ type: "text", text: description || "No additional description provided." }]
                    }
                ]
            },
            issuetype: { name: "Task" },
            priority: { name: priority }
        }
    };

    try {
        const response = await axios.post(
            `https://${host}/rest/api/3/issue`,
            payload,
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }
        );

        console.log(`🎫 Jira Ticket Created Successfully: ${response.data.key}`);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to create Jira Issue:", error.response?.data?.errorMessages || error.message);
        throw error;
    }
}