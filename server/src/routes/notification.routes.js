
const express = require("express");

const {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} = require("../controllers/notification.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Get logged-in user's notifications
router.get("/", protect, getMyNotifications);

// Get unread notification count
router.get("/unread-count", protect, getUnreadCount);

// Mark all notifications as read
router.patch("/read-all", protect, markAllAsRead);

// Mark a single notification as read
router.patch("/:id/read", protect, markAsRead);

// Delete a notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;