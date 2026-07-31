const express = require("express");
const router = express.Router();

const managerController = require("../controllers/manager.controller");

// ✅ Correct import
const {
    protect,
    authorize,
} = require("../middleware/auth.middleware");

// Authentication
router.use(protect);

// Manager only
router.use(authorize("MANAGER"));

// Dashboard
router.get(
    "/dashboard",
    managerController.getDashboard
);

// Members
router.get(
    "/members",
    managerController.getMembers
);

router.get(
    "/members/:id",
    managerController.getMemberById
);

// Referral Tree
router.get(
    "/referral-tree",
    managerController.getReferralTree
);

// Profile
router.get(
    "/profile",
    managerController.getProfile
);

module.exports = router;