const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/packaging.controller");

const {
    protect,
    authorize,
} = require("../middleware/auth.middleware");

// =====================================================
// PACKAGING LOGIN
// Public route
// =====================================================

router.post(
    "/login",
    controller.login
);

// =====================================================
// AUTHENTICATED PACKAGING ROUTES
// =====================================================

router.use(protect);

// =====================================================
// ADMIN — PACKAGING STAFF MANAGEMENT
// =====================================================

// Create Packaging account
router.post(
    "/staff",
    authorize("ADMIN", "SUPER_ADMIN"),
    controller.createStaff
);

// Get all Packaging accounts
router.get(
    "/staff",
    authorize("ADMIN", "SUPER_ADMIN"),
    controller.listStaff
);

// Update Packaging account
router.patch(
    "/staff/:id",
    authorize("ADMIN", "SUPER_ADMIN"),
    controller.updateStaff
);

// =====================================================
// PACKAGING STAFF
// =====================================================

// Dashboard
router.get(
    "/dashboard",
    authorize("PACKAGING"),
    controller.dashboard
);

// Assigned orders
router.get(
    "/orders",
    authorize("PACKAGING"),
    controller.orders
);

// Assigned order details
router.get(
    "/orders/:id",
    authorize("PACKAGING"),
    controller.orderDetails
);

// Update packing status
router.patch(
    "/orders/:id/status",
    authorize("PACKAGING"),
    controller.updateStatus
);

// =====================================================
// ADMIN — ASSIGN ORDER TO PACKAGING STAFF
// =====================================================

// Only Admin/Super Admin can assign orders
router.patch(
    "/orders/:id/assign",
    authorize("ADMIN", "SUPER_ADMIN"),
    controller.assignOrder
);

module.exports = router;