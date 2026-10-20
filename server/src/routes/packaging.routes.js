
const express = require("express");

const router = express.Router();

const controller = require("../controllers/packaging.controller");

const {
  protect,
  authorize,
} = require("../middleware/auth.middleware");

// =====================================================
// PACKAGING LOGIN — PUBLIC ROUTE
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
// PACKAGING STAFF — DASHBOARD
// =====================================================

router.get(
  "/dashboard",
  authorize("PACKAGING"),
  controller.dashboard
);

// =====================================================
// PACKAGING STAFF — ORDERS
// =====================================================

// Get assigned orders
router.get(
  "/orders",
  authorize("PACKAGING"),
  controller.orders
);

// Get assigned order details
router.get(
  "/orders/:id",
  authorize("PACKAGING"),
  controller.orderDetails
);

// =====================================================
// DOWNLOAD ORDER INVOICE / BILL PDF
// =====================================================

// Frontend invoice download endpoint
router.get(
  "/orders/:id/bill",
  authorize("PACKAGING"),
  controller.downloadOrderDocument
);

// Backward-compatible document endpoint
router.get(
  "/orders/:id/document",
  authorize("PACKAGING"),
  controller.downloadOrderDocument
);

// =====================================================
// UPDATE PACKING STATUS
// =====================================================

router.patch(
  "/orders/:id/status",
  authorize("PACKAGING"),
  controller.updateStatus
);

// =====================================================
// ADMIN — ASSIGN ORDER TO PACKAGING STAFF
// =====================================================

router.patch(
  "/orders/:id/assign",
  authorize("ADMIN", "SUPER_ADMIN"),
  controller.assignOrder
);

module.exports = router;
