const mongoose = require("mongoose");

/* ==========================================================================
   SELLING POINT TRANSACTION SCHEMA
   ========================================================================== */

const sellingPointTransactionSchema = new mongoose.Schema(
  {
    /* ----------------------------------------------------------------------
       USER
       ---------------------------------------------------------------------- */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ----------------------------------------------------------------------
       ORDER
       ---------------------------------------------------------------------- */

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },

    /* ----------------------------------------------------------------------
       PURCHASE AMOUNT
       ---------------------------------------------------------------------- */

    purchaseAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       PREVIOUS PENDING / CARRY FORWARD
       ---------------------------------------------------------------------- */

    previousPendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       TOTAL AMOUNT USED FOR CALCULATION
       ---------------------------------------------------------------------- */

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       COMPLETE ₹100 BLOCKS
       ---------------------------------------------------------------------- */

    completedBlocks: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       ELIGIBLE AMOUNT
       ---------------------------------------------------------------------- */

    eligibleAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       SELLING POINT RATE
       ---------------------------------------------------------------------- */

    spRate: {
      type: Number,
      default: 2,
      min: 0,
    },

    amountPerBlock: {
      type: Number,
      default: 100,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       SELLING POINTS BEFORE TRANSACTION
       ---------------------------------------------------------------------- */

    sellingPointsBefore: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       SELLING POINTS EARNED
       ---------------------------------------------------------------------- */

    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       SELLING POINTS AFTER TRANSACTION
       ---------------------------------------------------------------------- */

    sellingPointsAfter: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       PENDING / CARRY FORWARD AFTER TRANSACTION
       ---------------------------------------------------------------------- */

    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       LIFETIME PURCHASE AFTER TRANSACTION
       ---------------------------------------------------------------------- */

    lifetimePurchase: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ----------------------------------------------------------------------
       TRANSACTION TYPE
       ---------------------------------------------------------------------- */

    transactionType: {
      type: String,
      enum: [
        "MEMBERSHIP_PAYMENT",
        "ORDER_PURCHASE",
        "MEMBERSHIP_ACTIVATED",
        "SUPERVISOR",
        "SUPERVISOR_REWARD",
      ],
      required: true,
      index: true,
    },

    /* ----------------------------------------------------------------------
       REMARKS
       ---------------------------------------------------------------------- */

    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ==========================================================================
   DUPLICATE ORDER PROTECTION
   ========================================================================== */

sellingPointTransactionSchema.index(
  {
    user: 1,
    order: 1,
    transactionType: 1,
  },
  {
    unique: true,

    partialFilterExpression: {
      transactionType: "ORDER_PURCHASE",
      order: {
        $type: "objectId",
      },
    },
  }
);

/* ==========================================================================
   USER HISTORY INDEX
   ========================================================================== */

sellingPointTransactionSchema.index({
  user: 1,
  transactionType: 1,
  createdAt: -1,
});

/* ==========================================================================
   ORDER INDEX
   ========================================================================== */

sellingPointTransactionSchema.index({
  order: 1,
  transactionType: 1,
  createdAt: -1,
});

/* ==========================================================================
   MODEL
   ========================================================================== */

const SellingPointTransaction =
  mongoose.model(
    "SellingPointTransaction",
    sellingPointTransactionSchema
  );

module.exports =
  SellingPointTransaction;