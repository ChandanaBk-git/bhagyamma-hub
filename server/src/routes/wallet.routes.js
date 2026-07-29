const express = require("express");
const router = express.Router();

const controller = require("../controllers/wallet.controller");

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// =======================
// Logged-in User Wallet
// =======================
router.get("/me", protect, controller.getMyWallet);

// Transaction History
router.get("/history", protect, controller.getHistory);

// =======================
// Admin Operations
// =======================

// Credit Wallet
router.post(
    "/credit",
    protect,
    authorize("SUPER_ADMIN", "MANAGER"),
    controller.creditWallet
);

// Debit Wallet
router.post(
    "/debit",
    protect,
    authorize("SUPER_ADMIN", "MANAGER"),
    controller.debitWallet
);

// Get Any User Wallet
router.get(
    "/user/:userId",
    protect,
    authorize("SUPER_ADMIN", "MANAGER"),
    controller.getWalletByUserId
);

module.exports = router;