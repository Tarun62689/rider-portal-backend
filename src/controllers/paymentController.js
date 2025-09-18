// controllers/paymentController.js
import express from "express";
import stripe from "../utils/stripe.js";

const router = express.Router();

// Create a Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, currency } = req.body; // e.g., amount in paisa/cents

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency || "usd",
            product_data: {
              name: "Ride Fare",
            },
            unit_amount: amount, // in cents (USD) or paise (INR)
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/payments/success",
      cancel_url: "http://localhost:5173/payments/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment session failed" });
  }
});

export default router;
