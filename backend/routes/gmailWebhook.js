import express from "express";
import { contextFusion }  from "../services/contextFusion/contextFusion.js";

const router = express.Router();
router.post("/" , async (req , res) => {
    console.log("Gmail Webhook Triggered");

    await contextFusion(req.body);

    res.sendStatus(200);
});

export default router;