
const mongoose = require("mongoose");

const financeExpenseSchema = new mongoose.Schema(
  {
    expenseNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0.01, "Expense amount must be greater than zero"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Packaging",
        "Shipping",
        "Inventory",
        "Marketing",
        "Rent",
        "Salaries",
        "Software",
        "Utilities",
        "Travel",
        "Maintenance",
        "Other",
      ],
    },

    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Bank", "UPI", "Card", "Other"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    receiptReference: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["RECORDED", "VOID"],
      default: "RECORDED",
      index: true,
    },

    voidReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    voidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    voidedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

financeExpenseSchema.index({
  expenseDate: -1,
  status: 1,
});

financeExpenseSchema.index({
  category: 1,
  expenseDate: -1,
});

module.exports = mongoose.model(
  "FinanceExpense",
  financeExpenseSchema
);
