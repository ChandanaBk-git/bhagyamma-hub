const express = require("express");

const router = express.Router();

const adminController =
require("../controllers/admin.controller");

const { protect } =
require("../middleware/auth.middleware");

const authorize =
require("../middleware/role.middleware");

// ==========================================
// Dashboard
// ==========================================

router.get(
    "/dashboard",
    protect,
    authorize("SUPER_ADMIN"),
    adminController.getDashboard
);

// ==========================================
// User Management
// ==========================================

// Get All Users

router.get(
    "/users",
    protect,
    authorize("SUPER_ADMIN"),
    adminController.getAllUsers
);

// Get User By ID

router.get(
    "/users/:id",
    protect,
    authorize("SUPER_ADMIN"),
    adminController.getUserById
);

// Activate / Deactivate User

router.patch(
    "/users/:id/status",
    protect,
    authorize("SUPER_ADMIN"),
    adminController.updateUserStatus
);

// Change Role

router.patch(
    "/users/:id/role",
    protect,
    authorize("SUPER_ADMIN"),
    adminController.updateUserRole
);

// Delete User

router.delete(
    "/users/:id",
    protect,
    authorize("SUPER_ADMIN"),
    adminController.deleteUser
);

// Admin Referral Tree

router.get(
  "/referral-tree",
  protect,
  authorize("SUPER_ADMIN"),
  adminController.getReferralTree
);

// ==========================================
// Update User Details
// ==========================================

router.patch(
  "/users/:id",
  protect,
  authorize("SUPER_ADMIN"),
  adminController.updateUser
);

module.exports = router;