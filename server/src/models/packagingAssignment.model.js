const mongoose = require("mongoose");

const packagingAssignmentSchema =
    new mongoose.Schema(
        {
            /*
            ============================================
            ORDER
            ============================================
            */

            order: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
                required: true,
                unique: true,
                index: true,
            },

            /*
            ============================================
            PACKAGING STAFF
            ============================================
            */

            staff: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "PackagingStaff",
                default: null,
                index: true,
            },

            /*
            ============================================
            PACKAGING STATUS
            ============================================
            */

            status: {
                type: String,
                enum: [
                    "UNASSIGNED",
                    "ASSIGNED",
                    "PACKING",
                    "PACKED",
                    "READY_FOR_DISPATCH",
                ],
                default: "UNASSIGNED",
                index: true,
            },

            /*
            ============================================
            TIMESTAMPS
            ============================================
            */

            assignedAt: {
                type: Date,
                default: null,
            },

            packingStartedAt: {
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

            /*
            ============================================
            PACKAGING NOTES
            ============================================
            */

            notes: {
                type: String,
                trim: true,
                default: "",
            },

            /*
            ============================================
            COMPLETE ACTION HISTORY

            Admin / Packaging actions will be stored.
            ============================================
            */

            history: [
                {
                    action: {
                        type: String,
                        required: true,
                    },

                    byStaff: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "PackagingStaff",
                        default: null,
                    },

                    byAdmin: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        default: null,
                    },

                    note: {
                        type: String,
                        trim: true,
                        default: "",
                    },

                    at: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },
        {
            timestamps: true,
        }
    );

module.exports = mongoose.model(
    "PackagingAssignment",
    packagingAssignmentSchema
);