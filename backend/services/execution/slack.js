import axios from "axios";

export async function sendMessage(params){
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: params.message
    });

    console.log("Slack Message sent");
}