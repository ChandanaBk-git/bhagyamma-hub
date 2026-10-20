
const express = require("express");
const router = express.Router();

const controller = require("../controllers/packaging.controller");

const {
  protect,
  authorize,
} = require("../middleware/auth.middleware");

// =====================================================
// PACKAGING LOGIN
// =====================================================

router.post("/login", controller.login);

// All routes below require authentication
router.use(protect);

// =====================================================
// ADMIN — PACKAGING STAFF
// =====================================================

router.post(
  "/staff",
  authorize("ADMIN", "SUPER_ADMIN"),
  controller.createStaff
);

router.get(
  "/staff",
  authorize("ADMIN", "SUPER_ADMIN"),
  controller.listStaff
);

router.patch(
  "/staff/:id",
  authorize("ADMIN", "SUPER_ADMIN"),
  controller.updateStaff
);

// =====================================================
// PACKAGING DASHBOARD
// =====================================================

router.get(
  "/dashboard",
  authorize("PACKAGING"),
  controller.dashboard
);

// =====================================================
// PACKAGING ORDERS
// =====================================================

router.get(
  "/orders",
  authorize("PACKAGING"),
  controller.orders
);

router.get(
  "/orders/:id",
  authorize("PACKAGING"),
  controller.orderDetails
);

// =====================================================
// DOWNLOAD ORDER BILL PDF
// IMPORTANT: Matches packaging.controller.js export
// =====================================================

router.get(
  "/orders/:id/bill",
  authorize("PACKAGING"),
  controller.downloadOrderBill
);

// Keep the document URL for backward compatibility
router.get(
  "/orders/:id/document",
  authorize("PACKAGING"),
  controller.downloadOrderBill
);

// =====================================================
// UPDATE PACKAGING STATUS
// =====================================================

router.patch(
  "/orders/:id/status",
  authorize("PACKAGING"),
  controller.updateStatus
);

// =====================================================
// ADMIN — ASSIGN ORDER
// =====================================================

router.patch(
  "/orders/:id/assign",
  authorize("ADMIN", "SUPER_ADMIN"),
  controller.assignOrder
);

module.exports = router;
