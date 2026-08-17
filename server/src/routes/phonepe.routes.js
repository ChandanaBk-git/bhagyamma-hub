const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  createPhonePePayment,
  verifyPhonePePayment,
} = require("../controllers/phonepe.controller");

/* ==========================================
   Create PhonePe Payment
========================================== */

router.post(
  "/create",
  protect,
  createPhonePePayment
);

/* ==========================================
   Verify PhonePe Payment
========================================== */

router.get(
  "/status/:merchantOrderId",
  protect,
  verifyPhonePePayment
);

module.exports = router;