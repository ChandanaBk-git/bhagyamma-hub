const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },

        balance: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalCredit: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalDebit: {
            type: Number,
            default: 0,
            min: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "wallets", // Optional
    }
);

module.exports = mongoose.model("Wallet", walletSchema);