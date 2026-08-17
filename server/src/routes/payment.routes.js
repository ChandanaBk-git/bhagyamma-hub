const express = require("express");

const router =
  express.Router();

const paymentController =
  require("../controllers/payment.controller");

const authMiddleware =
  require("../middlewares/auth.middleware");

// =====================================================
// AUTHENTICATED PAYMENT ROUTES
// =====================================================

// Create / initiate payment
router.post(
  "/create",
  authMiddleware,
  paymentController.createPayment
);

// Verify payment
router.post(
  "/verify",
  authMiddleware,
  paymentController.verifyPayment
);

// Get payment status
router.get(
  "/status/:orderId",
  authMiddleware,
  paymentController.getPaymentStatus
);

// =====================================================
// PHONEPE CALLBACK
// =====================================================
//
// Do NOT add authMiddleware here if PhonePe calls
// this endpoint directly.
//
// Make sure your actual PhonePe integration verifies
// the callback signature before trusting its contents.
//
// =====================================================

router.post(
  "/callback",
  paymentController.phonePeCallback
);

module.exports = router;