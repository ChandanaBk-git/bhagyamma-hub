
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER
    // =====================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // =====================================================
    // ORDER TYPE
    // =====================================================

    orderType: {
      type: String,
      enum: ["GUEST", "MEMBER"],
      required: true,
      default: "MEMBER",
      index: true,
    },

    // =====================================================
    // GUEST CUSTOMER INFORMATION
    // =====================================================

    customerName: {
      type: String,
      trim: true,
      default: "",
    },

    customerMobile: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // =====================================================
    // GUEST ORDER LINKING
    // =====================================================

    membershipLinked: {
      type: Boolean,
      default: false,
      index: true,
    },

    linkedAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // GUEST PHONEPE PAYMENT ACCESS
    // =====================================================

    // Store only the hash of the guest access token.
    // Never store or expose the original token here.
    guestPaymentTokenHash: {
      type: String,
      default: null,
      select: false,
    },

    // Guest payment access expires after the time
    // established by the service layer.
    guestPaymentTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    // =====================================================
    // ORDER NUMBER
    // =====================================================

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    // =====================================================
    // PRICING
    // =====================================================

    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    walletAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // =====================================================
    // SELLING POINTS
    // =====================================================

    /*
     * Guest orders do not have a User document yet.
     * Store their SP calculation on the order so it can
     * be recovered if they later register.
     */

    spPreviousCarryForward: {
      type: Number,
      default: 0,
      min: 0,
    },

    spCalculationTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    spCompletedBlocks: {
      type: Number,
      default: 0,
      min: 0,
    },

    spEligibleAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    spCarryForward: {
      type: Number,
      default: 0,
      min: 0,
    },

    sellingPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    sellingPointsProcessed: {
      type: Boolean,
      default: false,
      index: true,
    },

    sellingPointsProcessedAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // ORDER STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PACKING",
        "PACKED",
        "READY_FOR_DISPATCH",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
      index: true,
    },

    // =====================================================
    // PAYMENT
    // =====================================================

    paymentMethod: {
      type: String,
      enum: ["PHONEPE", "COD"],
      default: "PHONEPE",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },

    // =====================================================
    // PHONEPE
    // =====================================================

    merchantOrderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    phonePeOrderId: {
      type: String,
      default: null,
    },

    phonePeTransactionId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // DELIVERY DETAILS
    // =====================================================

    deliveryDetails: {
      name: {
        type: String,
        trim: true,
        default: "",
      },

      mobile: {
        type: String,
        trim: true,
        default: "",
      },

      address: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        default: "",
      },

      state: {
        type: String,
        trim: true,
        default: "",
      },

      pincode: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // =====================================================
    // TIMESTAMPS
    // =====================================================

    placedAt: {
      type: Date,
      default: Date.now,
    },

    confirmedAt: {
      type: Date,
      default: null,
    },

    // Packaging timestamps
    packingAt: {
      type: Date,
      default: null,
    },

    packedAt: {
      type: Date,
      default: null,
    },

    readyForDispatchAt: {
      type: Date,
      default: null,
    },

    // Delivery timestamps
    shippedAt: {
      type: Date,
      default: null,
    },

    outForDeliveryAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    // Cancellation
    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
