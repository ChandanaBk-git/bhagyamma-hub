const express = require("express");

const router = express.Router();

const controller = require("../controllers/user.controller");

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// ======================================
// User Management
// ======================================

// Get All Users (SUPER_ADMIN & MANAGER)
router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "MANAGER", "USERS"),
  controller.getAllUsers
);

// ======================================
// Logged In User
// ======================================

// My Profile
router.get(
  "/me",
  protect,
  controller.getMyProfile
);

// Dashboard
router.get(
  "/dashboard",
  protect,
  controller.getDashboard
);

// Selling Points Dashboard
router.get(
  "/selling-points",
  protect,
  controller.getSellingPoints
);

// My Referral Network
router.get(
  "/my-network",
  protect,
  controller.getMyNetwork
);

// Referral Tree
router.get(
  "/referral-tree",
  protect,
  controller.getReferralTree
);

// ======================================
// Statistics
// ======================================

router.get(
  "/stats",
  protect,
  authorize("SUPER_ADMIN", "MANAGER"),
  controller.getUserStats
);

// ======================================
// Update / Delete
// ======================================

router.put(
  "/me",
  protect,
  controller.updateMyProfile
);

router.put(
  "/:id",
  protect,
  controller.updateUser
);

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  controller.deleteUser
);

// ======================================
// User Details
// (Keep LAST because :id matches everything)
// ======================================

router.get(
  "/:id",
  protect,
  controller.getUserById
);

module.exports = router;