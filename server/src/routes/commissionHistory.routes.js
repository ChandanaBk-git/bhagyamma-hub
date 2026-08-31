const express =
  require("express");

const router =
  express.Router();


// ============================================================
// AUTH
// ============================================================

const {
  protect,
} =
  require("../middleware/auth.middleware");


// ============================================================
// CONTROLLER
// ============================================================

const controller =
  require("../controllers/commissionHistory.controller");


// ============================================================
// GET MY COMMISSION HISTORY
// ============================================================
//
// LEGACY COMPATIBILITY ROUTE.
//
// It uses the EXACT SAME repository as:
//
// /commission/my
//
// ============================================================

router.get(

  "/my",

  protect,

  controller.getMyHistory

);


// ============================================================
// EXPORT
// ============================================================

module.exports =
  router;