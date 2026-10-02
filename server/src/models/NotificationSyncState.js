const mongoose = require("mongoose");

const notificationSyncStateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "notification-sync",
    },

    lastSuccessfulAt: {
      type: Date,
      default: null,
    },

    lastRunAt: {
      type: Date,
      default: null,
    },

    lastError: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const NotificationSyncState =
  mongoose.models.NotificationSyncState ||
  mongoose.model(
    "NotificationSyncState",
    notificationSyncStateSchema
  );

module.exports = NotificationSyncState;