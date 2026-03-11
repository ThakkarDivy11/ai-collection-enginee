const express = require("express");
const router = express.Router();
const { createCheckoutSession, stripeWebhook, getPayments, verifyPaymentSession } = require("../controllers/paymentController");
const { protect, admin } = require("../middleware/authMiddleware");

// Webhook must be before protect because it's called by Stripe
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/verify-session/:sessionId", protect, verifyPaymentSession);
router.get("/", protect, admin, getPayments);

module.exports = router;
