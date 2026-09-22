const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* -------------------------------------------------------------------------- */
/*                         PACKAGING STAFF SCHEMA                             */
/* -------------------------------------------------------------------------- */

const packagingStaffSchema = new mongoose.Schema(
    {
        /* ------------------------------------------------------------------ */
        /* BASIC DETAILS                                                       */
        /* ------------------------------------------------------------------ */

        name: {
            type: String,
            required: true,
            trim: true,
        },

        loginId: {
            type: String,
            required: true,
            unique: true,
            index: true,
            uppercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        /* ------------------------------------------------------------------ */
        /* ROLE                                                                */
        /* ------------------------------------------------------------------ */

        role: {
            type: String,
            default: "PACKAGING",
            immutable: true,
        },

        /* ------------------------------------------------------------------ */
        /* ACCOUNT STATUS                                                      */
        /* ------------------------------------------------------------------ */

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        /* ------------------------------------------------------------------ */
        /* BRANCH DETAILS                                                      */
        /* ------------------------------------------------------------------ */

        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            default: null,
            index: true,
        },

        branchName: {
            type: String,
            trim: true,
            default: null,
        },

        /*
         * Human-readable member/employee number
         * assigned to the staff member within the branch.
         *
         * Example:
         * BM_001
         * DVG-PKG-001
         */
        branchMemberNumber: {
            type: String,
            trim: true,
            default: null,
            index: true,
        },

        /* ------------------------------------------------------------------ */
        /* CREATED BY                                                          */
        /* ------------------------------------------------------------------ */

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        /* ------------------------------------------------------------------ */
        /* LOGIN ACTIVITY                                                      */
        /* ------------------------------------------------------------------ */

        lastLoginAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

/* -------------------------------------------------------------------------- */
/*                              PASSWORD HASHING                              */
/* -------------------------------------------------------------------------- */

packagingStaffSchema.pre(
    "save",
    async function () {
        if (!this.isModified("password")) {
            return;
        }

        this.password =
            await bcrypt.hash(
                this.password,
                12
            );
    }
);

/* -------------------------------------------------------------------------- */
/*                           PASSWORD COMPARISON                              */
/* -------------------------------------------------------------------------- */

packagingStaffSchema.methods.comparePassword =
    function (password) {
        return bcrypt.compare(
            password,
            this.password
        );
    };

/* -------------------------------------------------------------------------- */
/*                              MODEL EXPORT                                  */
/* -------------------------------------------------------------------------- */

module.exports = mongoose.model(
    "PackagingStaff",
    packagingStaffSchema
);