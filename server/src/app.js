
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

const policyRoutes = require("./routes/policy.routes");

const adminPolicyRoutes = require("./routes/adminPolicy.routes");

// =====================================
// MIDDLEWARE
// =====================================

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL
            ? process.env.CLIENT_URL.split(",").map(url => url.trim())
            : true,
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================================
// ROUTE IMPORTS
// =====================================

// Authentication
const authRoutes = require("./routes/auth.routes");

// Products
const productRoutes = require("./routes/product.routes");

// Categories
const categoryRoutes = require("./routes/category.routes");

// Cart
const cartRoutes = require("./routes/cart.routes");

// Orders
const orderRoutes = require("./routes/order.routes");

// Admin
const adminRoutes = require("./routes/admin.routes");

// Manager
const managerRoutes = require("./routes/manager.routes");

// User
const userRoutes = require("./routes/user.routes");

// Wallet
const walletRoutes = require("./routes/wallet.routes");

// Commission
const commissionRoutes = require("./routes/commission.routes");

// Packaging
const packagingRoutes = require("./routes/packaging.routes");

// Notifications
const notificationRoutes = require("./routes/notification.routes");

// =====================================
// API ROUTES
// =====================================

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/products", productRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/cart", cartRoutes);

app.use("/api/v1/orders", orderRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/manager", managerRoutes);

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/wallet", walletRoutes);

app.use("/api/v1/commission", commissionRoutes);

app.use("/api/v1/packaging", packagingRoutes);

// Notification API
app.use("/api/v1/notifications", notificationRoutes);

// Policy API
app.use("/api/v1/policies", policyRoutes);

app.use("/api/v1/admin/policies", adminPolicyRoutes);

// =====================================
// HEALTH CHECK
// =====================================

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Bhagyamma Hub API is running",
        timestamp: new Date().toISOString(),
    });
});

// =====================================
// 404 HANDLER
// =====================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
        path: req.originalUrl,
    });
});

// =====================================
// GLOBAL ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
    console.error("API Error:", err);

    const statusCode = err.statusCode || err.status || 500;

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Internal server error"
                : err.message,
    });
});

module.exports = app;