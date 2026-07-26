import express from "express";
import { contextFusion } from "../services/contextFusion/contextFusion.js";
const router = express.Router();

router.post("/" , async (req , res) =>{
    console.log("Sheets Webhook Triggered");

    contextFusion (req.body);

    res.sendStatus(200);
});

export default router;