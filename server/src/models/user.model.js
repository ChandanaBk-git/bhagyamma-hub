const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        // ==========================================
        // BASIC USER INFORMATION
        // ==========================================
        userId: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            sparse: true,
            default: undefined,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        // ==========================================
        // ROLE
        // ==========================================
        role: {
            type: String,
            enum: [
                "SUPER_ADMIN",
                "MANAGER",
                "SUPERVISOR",
                "MEMBER",
            ],
            default: "MEMBER",
        },

        // ==========================================
        // REFERRAL / MLM RELATIONSHIP
        // ==========================================
        referralCode: {
            type: String,
            unique: true,
            trim: true,
            uppercase: true,
        },
        sponsorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },
        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },

        // ==========================================
        // PERSONAL INFORMATION
        // ==========================================
        gender: {
            type: String,
            enum: [
                "Male",
                "Female",
                "Other",
            ],
            default: null,
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },

        // ==========================================
        // ADDRESS INFORMATION
        // ==========================================
        address: {
            type: String,
            trim: true,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        },
        state: {
            type: String,
            trim: true,
            default: "",
        },
        pincode: {
            type: String,
            trim: true,
            default: "",
        },
        country: {
            type: String,
            trim: true,
            default: "India",
        },

        // ==========================================
        // KYC INFORMATION
        // ==========================================
        aadhaarNumber: {
            type: String,
            trim: true,
            default: "",
        },
        panNumber: {
            type: String,
            trim: true,
            uppercase: true,
            default: "",
        },
        kycStatus: {
            type: String,
            enum: [
                "Pending",
                "Verified",
                "Rejected",
            ],
            default: "Pending",
        },
        kycVerifiedOn: {
            type: Date,
            default: null,
        },

        // ==========================================
        // BANK INFORMATION
        // ==========================================
        bankName: {
            type: String,
            trim: true,
            default: "",
        },
        accountHolderName: {
            type: String,
            trim: true,
            default: "",
        },
        accountNumber: {
            type: String,
            trim: true,
            default: "",
        },
        ifscCode: {
            type: String,
            trim: true,
            uppercase: true,
            default: "",
        },
        branch: {
            type: String,
            trim: true,
            default: "",
        },

        // ==========================================
        // MLM / PACKAGE INFORMATION
        // ==========================================
        packageName: {
            type: String,
            trim: true,
            default: "",
        },
        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
            ],
            default: "Pending",
        },
        welcomeKitStatus: {
            type: String,
            enum: [
                "Pending",
                "Dispatched",
            ],
            default: "Pending",
        },
        welcomeKitReceived: {
            type: Boolean,
            default: false,
        },

        // ==========================================
        // MEMBERSHIP ACTIVATION
        // ==========================================
        membershipStatus: {
            type: String,
            enum: [
                "Pending",
                "Active",
                "Suspended",
            ],
            default: "Pending",
        },
        membershipActivationMethod: {
            type: String,
            enum: [
                "WelcomeKit",
                "ProductPurchase",
                null,
            ],
            default: null,
        },
        membershipActivatedAt: {
            type: Date,
            default: null,
        },
        membershipSPAwarded: {
            type: Boolean,
            default: false,
        },

        // ==========================================
        // QUALIFYING PURCHASE
        // ==========================================
        qualifyingPurchaseAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        // ==========================================
        // WALLET
        // ==========================================
        walletBalance: {
            type: Number,
            default: 0,
            min: 0,
        },

        // ==========================================
        // SELLING POINTS
        // ==========================================
        /*
         * SP = Selling Points.
         *
         * This is the ONLY source of truth for SP.
         *
         * Do NOT use spBalance.
         */
        sellingPoints: {
            type: Number,
            default: 0,
            min: 0,
        },
        pendingPurchaseAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        lifetimePurchase: {
            type: Number,
            default: 0,
            min: 0,
        },

        // ==========================================
        // ACCOUNT STATUS
        // ==========================================
        isActive: {
            type: Boolean,
            default: true,
        },
        isKycVerified: {
            type: Boolean,
            default: false,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },

        // ==========================================
        // KYC DOCUMENTS
        // ==========================================
        aadhaarDocument: {
            fileName: {
                type: String,
                default: "",
            },
            filePath: {
                type: String,
                default: "",
            },
            uploadedAt: {
                type: Date,
                default: null,
            },
        },
        panDocument: {
            fileName: {
                type: String,
                default: "",
            },
            filePath: {
                type: String,
                default: "",
            },
            uploadedAt: {
                type: Date,
                default: null,
            },
        },
        bankPassbookDocument: {
            fileName: {
                type: String,
                default: "",
            },
            filePath: {
                type: String,
                default: "",
            },
            uploadedAt: {
                type: Date,
                default: null,
            },
        },

        // ==========================================
        // LOGIN INFORMATION
        // ==========================================
        lastLogin: {
            type: Date,
            default: null,
        },
        passwordChangedAt: {
            type: Date,
            default: null,
        },

        // ==========================================
        // PASSWORD RESET
        // ==========================================
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },

        // ==========================================
        // OTP
        // ==========================================
        otp: {
            type: String,
            select: false,
        },
        otpExpires: {
            type: Date,
            select: false,
        },
        otpPurpose: {
            type: String,
            enum: [
                "LOGIN",
                "FORGOT_PASSWORD",
            ],
            default: null,
            select: false,
        },

        // ==========================================
        // DOCUMENT SUBMISSION STATUS
        // ==========================================
        aadhaarReceived: {
            type: Boolean,
            default: false,
        },
        panReceived: {
            type: Boolean,
            default: false,
        },
        bankPassbookReceived: {
            type: Boolean,
            default: false,
        },

        // ==========================================
        // PAYMENT INFORMATION
        // ==========================================
        paymentDate: {
            type: Date,
            default: null,
        },

        // ==========================================
        // ADMIN INFORMATION
        // ==========================================
        adminNotes: {
            type: String,
            trim: true,
            default: "",
        },

        // ==========================================
        // SUPERVISOR INFORMATION
        // ==========================================
        isSupervisor: {
            type: Boolean,
            default: false,
        },
        supervisorDate: {
            type: Date,
            default: null,
        },

        // ==========================================
        // DISCOUNT
        // ==========================================
        discount50Available: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// ==================================================
// PASSWORD HASHING
// ==================================================

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(
        this.password,
        10
    );
});

// ==================================================
// COMPARE PASSWORD
// ==================================================

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(
        password,
        this.password
    );
};

// ==================================================
// INDEXES
// ==================================================

// userSchema.index({
//     sponsorId: 1,
// });

// userSchema.index({
//     managerId: 1,
// });

// ==================================================
// JSON TRANSFORM
// ==================================================

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.otp;
        delete ret.otpExpires;
        delete ret.otpPurpose;
        delete ret.__v;
        return ret;
    },
});

// ==================================================
// MODEL
// ==================================================

module.exports = mongoose.model(
    "User",
    userSchema
);