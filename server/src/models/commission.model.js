const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserMembership",
      required: true,
    },

    level: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["MANAGER", "LEVEL"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS"],
      default: "SUCCESS",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Commission", commissionSchema);