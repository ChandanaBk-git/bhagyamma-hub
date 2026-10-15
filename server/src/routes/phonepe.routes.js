
const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  createPhonePePayment,
  verifyPhonePePayment,
  createGuestPhonePePayment,
  verifyGuestPhonePePayment,
} = require("../controllers/phonepe.controller");

/* ==========================================
   MEMBER - Create PhonePe Payment
========================================== */

router.post(
  "/create",
  protect,
  createPhonePePayment
);

/* ==========================================
   MEMBER - Verify PhonePe Payment
========================================== */

router.get(
  "/status/:merchantOrderId",
  protect,
  verifyPhonePePayment
);

/* ==========================================
   GUEST - Create PhonePe Payment
========================================== */

router.post(
  "/guest/create",
  createGuestPhonePePayment
);

/* ==========================================
   GUEST - Verify PhonePe Payment
========================================== */

router.post(
  "/guest/status",
  verifyGuestPhonePePayment
);

module.exports = router;
