const express = require("express");

const router = express.Router();

// ============================================================
// AUTH MIDDLEWARE
// ============================================================

const {
    protect,
} = require("../middleware/auth.middleware");

// ============================================================
// ROLE MIDDLEWARE
// ============================================================

const authorize = require("../middleware/role.middleware");

// ============================================================
// CONTROLLER
// ============================================================

const commissionController =
    require("../controllers/commission.controller");


// ============================================================
// MY COMMISSION HISTORY
// ============================================================
// GET
// /api/v1/commissions/my
//
// Returns commissions received by logged-in user.
// ============================================================

router.get(
    "/my",
    protect,
    commissionController.getMyCommissions
);


// ============================================================
// MY COMMISSION SUMMARY
// ============================================================
// GET
// /api/v1/commissions/my/summary
//
// IMPORTANT:
// This route must come BEFORE /:id.
// ============================================================

router.get(
    "/my/summary",
    protect,
    commissionController.getMyCommissionSummary
);


// ============================================================
// MY COMMISSION TOTAL
// ============================================================
// GET
// /api/v1/commissions/total
//
// Returns total commission of logged-in user.
// ============================================================

router.get(
    "/total",
    protect,
    commissionController.getMyCommissionTotal
);


// ============================================================
// OPTIONAL SUMMARY ALIAS
// ============================================================
// GET
// /api/v1/commissions/summary
//
// Keep this also working in case another part of the
// frontend/backend already uses /summary.
// ============================================================

router.get(
    "/summary",
    protect,
    commissionController.getMyCommissionSummary
);


// ============================================================
// BACKFILL EXISTING PAID MEMBERSHIPS
// ============================================================
// POST
// /api/v1/commissions/backfill-paid-memberships
//
// SUPER_ADMIN ONLY
//
// IMPORTANT:
// This MUST be POST, not GET.
// ============================================================

router.post(
    "/backfill-paid-memberships",
    protect,
    authorize("SUPER_ADMIN"),
    commissionController.backfillPaidMembershipCommissions
);


// ============================================================
// GET ALL COMMISSIONS
// ============================================================
// GET
// /api/v1/commissions
//
// SUPER_ADMIN ONLY
// ============================================================

router.get(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    commissionController.getAllCommissions
);


// ============================================================
// GET COMMISSION BY ID
// ============================================================
// GET
// /api/v1/commissions/:id
//
// IMPORTANT:
// Keep this LAST.
// Otherwise /my, /total, /summary etc. can be interpreted
// as an ID.
// ============================================================

router.get(
    "/:id",
    protect,
    commissionController.getCommissionById
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;