
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const {
  createPhonePePayment,
  verifyPhonePePayment,
  createGuestPhonePePayment,
  verifyGuestPhonePePayment,
  retryPhonePePayment,
} = require("../controllers/phonepe.controller");
const {
  createMemberPhonePeSession,
  createGuestPhonePeSession,
  verifyPhonePeSession,
} = require("../controllers/phonepe.controller");

// Authenticated member checkout
router.post("/session/create", protect, createMemberPhonePeSession);

// Guest checkout
router.post("/guest/session/create", createGuestPhonePeSession);

// Server-side PhonePe status verification
router.post("/session/status", verifyPhonePeSession);
router.get("/session/status/:merchantOrderId", verifyPhonePeSession);
/* ==========================================
   MEMBER - Retry PhonePe Payment
========================================== */

router.post(
  "/orders/:orderId/retry",
  protect,
  retryPhonePePayment
);
module.exports = router;
