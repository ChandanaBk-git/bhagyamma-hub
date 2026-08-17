const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER
    // =====================================================

    /*
     * Guest orders do not have a user.
     *
     * Guest:
     * userId = null
     *
     * Member:
     * userId = ObjectId
     */

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

      enum: [
        "GUEST",
        "MEMBER",
      ],

      required: true,

      default: "MEMBER",

      index: true,
    },

    // =====================================================
    // GUEST CUSTOMER INFORMATION
    // =====================================================

    /*
     * These fields are required for guest orders.
     *
     * Mobile is especially important because later
     * the customer can register and claim previous
     * purchases after mobile OTP verification.
     */

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

    /*
     * Later, after mobile OTP verification:
     *
     * GUEST ORDER
     *      ↓
     * verified mobile
     *      ↓
     * MEMBER USER
     *
     * membershipLinked prevents the same guest order
     * from being claimed/counting twice.
     */

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
        "PACKED",
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

      enum: [
        "PHONEPE",
        "COD",
      ],

      default: "PHONEPE",
    },

    paymentStatus: {
      type: String,

      enum: [
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
      ],

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

    packedAt: {
      type: Date,

      default: null,
    },

    shippedAt: {
      type: Date,

      default: null,
    },

    deliveredAt: {
      type: Date,

      default: null,
    },

    cancelledAt: {
      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);