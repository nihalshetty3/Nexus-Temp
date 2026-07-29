import express from "express";
// import { contextFusion } from "../services/contextFusion/contextFusion.js";

import { normalizeEvent } from "../services/contextFusion/normalizeEvent.js";
import { publishEvent } from "../rabbitmq/producer.js";

const router = express.Router();

router.post("/" , async (req , res) =>{
    console.log("Sheets Webhook Triggered");

    // const normalizedEvent = normalizeEvent(req.body);

    await publishEvent(req.body);

    res.sendStatus(200);
});

export default router;