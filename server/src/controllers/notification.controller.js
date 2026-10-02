
const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const getRecipientId = (req) => req.user?.id;

const isValidId = (id) => mongoose.isValidObjectId(id);

// GET MY NOTIFICATIONS
const getMyNotifications = async (req, res) => {
    try {
        const recipientId = getRecipientId(req);

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

        const filter = { recipientId };

        if (req.query.unread === "true") {
            filter.isRead = false;
        }

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),

            Notification.countDocuments(filter),

            Notification.countDocuments({
                recipientId,
                isRead: false,
            }),
        ]);

        return res.status(200).json({
            success: true,
            notifications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            unreadCount,
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
        });
    }
};

// GET UNREAD COUNT
const getUnreadCount = async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({
            recipientId: getRecipientId(req),
            isRead: false,
        });

        return res.status(200).json({
            success: true,
            unreadCount,
        });
    } catch (error) {
        console.error("Unread count error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch unread count",
        });
    }
};

// MARK SINGLE AS READ
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID",
            });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: id,
                recipientId: getRecipientId(req),
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                },
            },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Mark notification read error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notification",
        });
    }
};

// MARK ALL AS READ
const markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            {
                recipientId: getRecipientId(req),
                isRead: false,
            },
            {
                $set: {
                    isRead: true,
                    readAt: new Date(),
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Mark all read error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notifications",
        });
    }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID",
            });
        }

        const notification = await Notification.findOneAndDelete({
            _id: id,
            recipientId: getRecipientId(req),
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted",
            deletedId: id,
        });
    } catch (error) {
        console.error("Delete notification error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete notification",
        });
    }
};

module.exports = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};