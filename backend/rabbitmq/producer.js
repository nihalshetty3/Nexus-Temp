import { getChannel } from "./connection.js";

export async function publishEvent(event){
    const channel = getChannel();

    channel.sendToQueue(
        "purchase-events",
        Buffer.from(JSON.stringify(event)),
        {
            persistent: true
        }
    );

    console.log("Event queued");
}