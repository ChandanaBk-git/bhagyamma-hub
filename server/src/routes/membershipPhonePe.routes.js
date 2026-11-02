
const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const {
    createMembershipPayment,
    verifyMembershipPayment,
} = require("../controllers/membershipPhonePe.controller");

router.post(
    "/create",
    protect,
    createMembershipPayment
);

router.get(
    "/status/:merchantOrderId",
    protect,
    verifyMembershipPayment
);

module.exports = router;
