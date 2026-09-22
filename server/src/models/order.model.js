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
     * These fields are especially important for GUEST orders.
     *
     * Guest orders do not have a User document yet.
     *
     * Therefore the SP calculation must be stored directly
     * on the order so that it can later be recovered when
     * the customer registers using the same mobile number.
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

      /*
       * Complete customer order flow:
       *
       * PLACED
       *    ↓
       * CONFIRMED
       *    ↓
       * PACKING
       *    ↓
       * PACKED
       *    ↓
       * READY_FOR_DISPATCH
       *    ↓
       * SHIPPED
       *    ↓
       * OUT_FOR_DELIVERY
       *    ↓
       * DELIVERED
       *
       * CANCELLED can happen according to the
       * cancellation rules in the order service.
       */

      enum: [
        "PLACED",
        "CONFIRMED",

        // Packaging stages
        "PACKING",
        "PACKED",
        "READY_FOR_DISPATCH",

        // Delivery stages
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",

        // Cancellation
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