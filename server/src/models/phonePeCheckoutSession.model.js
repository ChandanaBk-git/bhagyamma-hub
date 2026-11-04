
const mongoose = require("mongoose");

const phonePeCheckoutSessionSchema = new mongoose.Schema(
  {
    merchantOrderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    sessionType: {
      type: String,
      required: true,
      enum: ["PRODUCT", "MEMBERSHIP"],
    },

    // Store only the hash of the checkout access token.
    sessionTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    // Amount in paise, as required by PhonePe.
    amountPaise: {
      type: Number,
      required: true,
      min: 1,
    },

    // Product checkout details: items, customer, address, totals, etc.
    checkoutData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Temporary membership registration details.
    registrationData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      select: false,
    },

    // Existing member ID for member product checkout or activation.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
        "EXPIRED",
      ],
      default: "PENDING",
      required: true,
    },

    phonePeState: {
      type: String,
      default: null,
    },

    phonePeOrderId: {
      type: String,
      default: null,
    },

    phonePeTransactionId: {
      type: String,
      default: null,
    },

    // Created only after verified payment succeeds.
    createdOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    // Created only after verified membership payment succeeds.
    createdUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove expired temporary sessions.
phonePeCheckoutSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
  "PhonePeCheckoutSession",
  phonePeCheckoutSessionSchema
);
