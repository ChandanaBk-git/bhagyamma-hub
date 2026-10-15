const mongoose = require("mongoose");

const membershipPaymentRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 2000,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING_VERIFICATION", "VERIFIED", "REJECTED"],
      default: "PENDING_VERIFICATION",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank", "UPI", "Card", "Other"],
      default: "Other",
    },
    paymentReference: {
      type: String,
      trim: true,
      default: "",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    evidenceDescription: {
      type: String,
      trim: true,
      default: "",
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verificationNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "MembershipPaymentRecord",
  membershipPaymentRecordSchema
);