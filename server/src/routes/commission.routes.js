const express = require("express");
const router = express.Router();

const commissionController = require("../controllers/commission.controller");
const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.get(
    "/my",
    protect,
    commissionController.getMyCommissions
);

router.get(
    "/",
    protect,
    authorize("SUPER_ADMIN"),
    commissionController.getAllCommissions
);

router.get(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    commissionController.getCommissionById
);

module.exports = router;