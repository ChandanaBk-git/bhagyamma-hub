const express = require("express");

const {
  getAllPolicies,
  getPolicyById,
  updatePolicy,
  publishPolicy,
  unpublishPolicy,
  getPolicyHistory,
} = require("../controllers/adminPolicy.controller");

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

// =====================================================
// ADMIN POLICY PROTECTION
// =====================================================

router.use(
  protect,
  authorize("SUPER_ADMIN")
);

// =====================================================
// POLICY ROUTES
// =====================================================

// Get all policies
router.get(
  "/",
  getAllPolicies
);

// Get policy history
router.get(
  "/:id/history",
  getPolicyHistory
);

// Get one policy
router.get(
  "/:id",
  getPolicyById
);

// Update policy
router.patch(
  "/:id",
  updatePolicy
);

// Publish policy
router.patch(
  "/:id/publish",
  publishPolicy
);

// Unpublish policy
router.patch(
  "/:id/unpublish",
  unpublishPolicy
);

module.exports = router;