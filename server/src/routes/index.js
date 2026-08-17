const express = require("express");

const router = express.Router();

/* ========================= Route Imports ========================= */

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const productRoutes = require("./product.routes");
const cartRoutes = require("./cart.routes");
const orderRoutes = require("./order.routes");
const referralRoutes = require("./referral.routes");
const walletRoutes = require("./wallet.routes");
const commissionRoutes = require("./commission.routes");
const withdrawRoutes = require("./withdraw.routes");
const adminRoutes = require("./admin.routes");
const phonepeRoutes = require("./phonepe.routes");
/* ========================= Authentication ========================= */

router.use("/auth", authRoutes);

/* ========================= User Management ========================= */

router.use("/users", userRoutes);

/* ========================= Product Catalog ========================= */

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);

/* ========================= Shopping ========================= */

router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use(
  "/payments/phonepe",
  phonepeRoutes
);

/* ========================= MLM Modules ========================= */

router.use("/referrals", referralRoutes);
router.use("/wallet", walletRoutes);
router.use("/commissions", commissionRoutes);
router.use("/withdraws", withdrawRoutes);

/* ========================= Admin ========================= */

router.use("/admin", adminRoutes);

/* ========================= API Information ========================= */

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bhagyamma Hub API v1",
  });
});

module.exports = router;