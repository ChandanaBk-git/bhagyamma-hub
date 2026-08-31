const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER
    // =====================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // =====================================================
    // AVAILABLE WALLET BALANCE
    //
    // Commission + Bonus credits increase this.
    // Withdrawals decrease this.
    // =====================================================

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // TOTAL COMMISSION
    //
    // Referral commission only.
    // SP is NOT included here.
    // =====================================================

    totalCommission: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // TOTAL BONUS
    //
    // Bonus/incentive only.
    // SP is NOT included here.
    // =====================================================

    totalBonus: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // TOTAL WITHDRAWN
    // =====================================================

    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // PENDING WITHDRAWAL
    // =====================================================

    pendingWithdrawal: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // WALLET STATUS
    // =====================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Wallet",
    walletSchema
  );