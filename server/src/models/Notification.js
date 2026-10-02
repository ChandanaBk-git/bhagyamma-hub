const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "SUPERVISOR",
        "MEMBER",
        "PACKAGING",
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
      default: "NORMAL",
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    referenceType: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    eventId: {
      type: String,
      default: null,
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Notification listing
notificationSchema.index({
  recipientId: 1,
  createdAt: -1,
});

// Unread count
notificationSchema.index({
  recipientId: 1,
  isRead: 1,
});

// Prevent duplicate notifications for the same event
notificationSchema.index(
  {
    recipientId: 1,
    eventId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      eventId: { $type: "string" },
    },
  }
);

// Automatically remove expired notifications
notificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = Notification;