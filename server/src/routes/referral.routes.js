const express = require("express");

const router = express.Router();

const controller = require("../controllers/referral.controller");

const { protect } = require("../middleware/auth.middleware");

router.get(
    "/my",
    protect,
    controller.getMyReferrals
);

router.get(
    "/count",
    protect,
    controller.getReferralCount
);

module.exports = router;