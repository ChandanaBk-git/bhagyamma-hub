const express = require("express");

const router = express.Router();

/* ========================= Authentication ========================= */

router.use("/auth", require("./auth.routes"));

/* ========================= User Management ========================= */

router.use("/users", require("./user.routes"));

/* ========================= Product Catalog ========================= */

router.use("/categories", require("./category.routes"));
router.use("/products", require("./product.routes"));


/* ========================= Shopping ========================= */

router.use("/cart", require("./cart.routes"));
router.use("/orders", require("./order.routes"));
/* ========================= MLMa Modules ========================= */

router.use("/referrals", require("./referral.routes"));
router.use("/wallet", require("./wallet.routes"));
router.use("/commissions", require("./commission.routes"));

/* ========================= Admin ========================= */

router.use("/admin", require("./admin.routes"));

/* ========================= API Information ========================= */

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Bhagyamma Hub API v1",
    });
});

module.exports = router;