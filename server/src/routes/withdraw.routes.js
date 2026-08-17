const express = require("express");

const router = express.Router();

const controller = require("../controllers/withdraw.controller");

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// ======================================
// Member Routes
// ======================================

// Create Withdraw Request
router.post(
  "/",
  protect,
  authorize(
    "MEMBER",
    "SUPERVISOR",
    "MANAGER",
    "SUPER_ADMIN"
  ),
  controller.requestWithdraw
);

// My Withdraw History
router.get(
  "/my",
  protect,
  authorize(
    "MEMBER",
    "SUPERVISOR",
    "MANAGER",
    "SUPER_ADMIN"
  ),
  controller.getMyWithdraws
);

// ======================================
// Manager/Admin
// ======================================

// All Withdraw Requests
router.get(
  "/",
  protect,
  authorize(
    "MANAGER",
    "SUPER_ADMIN"
  ),
  controller.getAllWithdraws
);

// Approve Withdraw
router.put(
  "/:id/approve",
  protect,
  authorize(
    "MANAGER",
    "SUPER_ADMIN"
  ),
  controller.approveWithdraw
);

// Reject Withdraw
router.put(
  "/:id/reject",
  protect,
  authorize(
    "MANAGER",
    "SUPER_ADMIN"
  ),
  controller.rejectWithdraw
);

module.exports = router;