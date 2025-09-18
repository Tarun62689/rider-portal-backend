// src/routes/rideRoutes.js
import express from "express";
import {
  getRideRoute,
  createRidePayment,
  handleStripeWebhook,
} from "../controllers/rideController.js";

const router = express.Router();

router.get("/route", getRideRoute);
router.post("/create", createRidePayment);
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;
