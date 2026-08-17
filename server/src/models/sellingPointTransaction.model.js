const mongoose = require("mongoose");

const sellingPointTransactionSchema =
  new mongoose.Schema(
    {
      // =====================================================
      // USER
      // =====================================================

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // =====================================================
      // ORDER
      // =====================================================

      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
      },

      // =====================================================
      // PURCHASE AMOUNT
      // =====================================================

      purchaseAmount: {
        type: Number,
        required: true,
        min: 0,
      },

      // =====================================================
      // SP EARNED
      // =====================================================

      pointsEarned: {
        type: Number,
        required: true,
        min: 0,
      },

      // =====================================================
      // PENDING AMOUNT
      // =====================================================

      pendingAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      // =====================================================
      // LIFETIME PURCHASE
      // =====================================================

      lifetimePurchase: {
        type: Number,
        default: 0,
        min: 0,
      },

      // =====================================================
      // TRANSACTION TYPE
      // =====================================================

      transactionType: {
        type: String,

        enum: [
          "ORDER_PURCHASE",

          "MEMBERSHIP_PAYMENT",

          "MEMBERSHIP_ACTIVATED",

          "SUPERVISOR",

          "SUPERVISOR_REWARD",
        ],

        default: "ORDER_PURCHASE",
      },

      // =====================================================
      // REMARKS
      // =====================================================

      remarks: {
        type: String,
        trim: true,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "SellingPointTransaction",
    sellingPointTransactionSchema
  );