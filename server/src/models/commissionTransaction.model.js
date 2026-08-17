const mongoose = require("mongoose");

const commissionTransactionSchema =
new mongoose.Schema(
{
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },

    level: {
        type: Number,
        required: true,
    },

    percentage: {
        type: Number,
        required: true,
    },

    joiningAmount: {
        type: Number,
        required: true,
    },

    commissionAmount: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PAID",
    },

    remarks: String,

},
{
    timestamps:true,
});

module.exports =
mongoose.model(
"CommissionTransaction",
commissionTransactionSchema
);