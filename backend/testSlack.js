import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: "Slack Integration Succesful!!\nHellow from Nexus AI"
});

console.log("Slack text message sent");