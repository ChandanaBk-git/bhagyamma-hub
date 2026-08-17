const express = require("express");

const router = express.Router();

const { protect } =
require("../middleware/auth.middleware");

const controller =
require("../controllers/commissionHistory.controller");

console.log("Commission History Controller:", controller);

router.get(
    "/my",
    protect,
    controller.getMyHistory
);

module.exports = router;