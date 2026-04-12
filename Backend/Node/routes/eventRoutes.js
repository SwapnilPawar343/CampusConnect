import express from "express";
import { createEvent, getEvents } from "../controller/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);

export default router;
