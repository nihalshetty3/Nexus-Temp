import { getChannel } from "./connection.js";

import { contextFusion } from "../services/contextFusion/contextFusion.js";
// import { content } from "googleapis/build/src/apis/content.js";

export async function startConsumer(){
    const channel = getChannel();

    console.log("Waiting for events...");
    channel.consume("purchase-events", async (msg) => {
        if(!msg) return;

        try{
            const event = JSON.parse(msg.content.toString());

            console.log("\n Event recieved from queue");
            console.dir(event, { depth: null });

            await contextFusion(event);
            
            channel.ack(msg);
            console.log("Event processed");
        }
        catch(err){
            console.error("Processing failed", err);

            channel.nack(msg , false, false);
        }
    });
}