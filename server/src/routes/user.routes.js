const express = require("express");

const router = express.Router();

const controller = require("../controllers/user.controller");

const { protect } = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

// =======================
// User Management Routes
// =======================

// Get all users (Only SUPER_ADMIN & MANAGER)
router.get(
    "/",
    protect,
    authorize("SUPER_ADMIN", "MANAGER","USERS"),
    controller.getAllUsers
);

router.get(
    "/me",
    protect,
    controller.getMyProfile
);

router.put(
    "/:id",
    protect,
    controller.updateUser
);
router.delete(
    "/:id",
    protect,
    authorize("SUPER_ADMIN"),
    controller.deleteUser
);

router.get(
    "/stats",
    protect,
    authorize("SUPER_ADMIN", "MANAGER"),
    controller.getUserStats
);

// Get user by ID (Any logged-in user)
router.get(
    "/:id",
    protect,
    controller.getUserById
);



module.exports = router;