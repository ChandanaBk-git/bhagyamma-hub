const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        orderNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        subtotal: {
            type: Number,
            required: true,
            default: 0,
        },

        discount: {
            type: Number,
            default: 0,
        },

        walletAmount: {
            type: Number,
            default: 0,
        },

        finalAmount: {
            type: Number,
            required: true,
        },

        sellingPoints: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "PLACED",
                "CONFIRMED",
                "PACKED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PLACED",
        },

        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "PAID",
                "FAILED",
            ],
            default: "PAID",
        },

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

module.exports = mongoose.model("Order", orderSchema);