const mongoose = require("mongoose");

const financeAuditLogSchema = new mongoose.Schema(
  {
    expense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinanceExpense",
      required: true,
      index: true,
    },

    expenseNumber: {
      type: String,
      trim: true,
      default: "",
    },

    action: {
      type: String,
      enum: ["CREATED", "EDITED", "DELETED"],
      required: true,
      index: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    performedByRole: {
      type: String,
      default: "MANAGER",
      trim: true,
    },

    before: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    after: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    reason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

financeAuditLogSchema.index({ createdAt: -1 });
financeAuditLogSchema.index({
  action: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "FinanceAuditLog",
  financeAuditLogSchema
);