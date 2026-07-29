import dotenv from "dotenv";
dotenv.config();
console.clear();

import express from "express";
import bodyParser from "body-parser";

import gmailWebhook from "../routes/gmailWebhook.js";
import sheetWebhook from "../routes/sheetWebhook.js";
import { connectRabbitMQ } from "../rabbitmq/connection.js";
import { startConsumer } from "../rabbitmq/consumer.js";

await connectRabbitMQ();
await startConsumer();

const app = express();

app.use(bodyParser.json());

app.use("/webhook/gmail" , gmailWebhook);
app.use("/webhook/sheets" , sheetWebhook);

app.listen(3000 , () => {
    console.log("Server running");
});

