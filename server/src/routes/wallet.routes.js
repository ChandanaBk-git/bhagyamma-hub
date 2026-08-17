const express = require("express");

const router = express.Router();

const controller =
require("../controllers/wallet.controller");

const { protect } =
require("../middleware/auth.middleware");

router.get(
    "/",
    protect,
    controller.getMyWallet
);

router.post(
    "/credit",
    protect,
    controller.testCredit
);

router.post(
    "/debit",
    protect,
    controller.testDebit
);

module.exports = router;