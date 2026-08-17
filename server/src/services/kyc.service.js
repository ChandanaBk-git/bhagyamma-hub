const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

// =====================================================
// ADD / UPDATE KYC DETAILS
// =====================================================

const updateKycDetails = async (userId, data) => {
    const {
        aadhaarNumber,
        panNumber,
    } = data;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    // -------------------------------------------------
    // Update Aadhaar Number
    // -------------------------------------------------

    if (aadhaarNumber !== undefined) {
        user.aadhaarNumber =
            String(aadhaarNumber).trim();
    }

    // -------------------------------------------------
    // Update PAN Number
    // -------------------------------------------------

    if (panNumber !== undefined) {
        user.panNumber =
            String(panNumber)
                .trim()
                .toUpperCase();
    }

    // -------------------------------------------------
    // KYC STATUS
    // -------------------------------------------------
    /*
     * Entering Aadhaar/PAN numbers alone does NOT
     * mean that KYC has been submitted.
     *
     * The member becomes Pending ONLY after:
     *
     * 1. Aadhaar document uploaded
     * 2. PAN document uploaded
     * 3. Bank Passbook uploaded
     *
     * Only ADMIN can make KYC Verified.
     */

    const allDocumentsUploaded =
        Boolean(user.aadhaarReceived) &&
        Boolean(user.panReceived) &&
        Boolean(user.bankPassbookReceived);

    if (
        allDocumentsUploaded &&
        user.kycStatus !== "Verified"
    ) {
        user.kycStatus = "Pending";
        user.isKycVerified = false;
        user.kycVerifiedOn = null;
    }

    await user.save();

    return user;
};

// =====================================================
// UPLOAD KYC DOCUMENTS
// =====================================================

const uploadKycDocuments = async (
    userId,
    files
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    // -------------------------------------------------
    // Check whether at least one file was received
    // -------------------------------------------------

    const hasFiles =
        Boolean(files?.aadhaar?.[0]) ||
        Boolean(files?.pan?.[0]) ||
        Boolean(files?.bankPassbook?.[0]);

    if (!hasFiles) {
        throw new ApiError(
            400,
            "Please upload at least one KYC document"
        );
    }

    // =================================================
    // AADHAAR DOCUMENT
    // =================================================

    if (files?.aadhaar?.[0]) {
        const file =
            files.aadhaar[0];

        user.aadhaarDocument = {
            fileName:
                file.originalname,

            filePath:
                file.path,

            uploadedAt:
                new Date(),
        };

        user.aadhaarReceived = true;
    }

    // =================================================
    // PAN DOCUMENT
    // =================================================

    if (files?.pan?.[0]) {
        const file =
            files.pan[0];

        user.panDocument = {
            fileName:
                file.originalname,

            filePath:
                file.path,

            uploadedAt:
                new Date(),
        };

        user.panReceived = true;
    }

    // =================================================
    // BANK PASSBOOK DOCUMENT
    // =================================================

    if (files?.bankPassbook?.[0]) {
        const file =
            files.bankPassbook[0];

        user.bankPassbookDocument = {
            fileName:
                file.originalname,

            filePath:
                file.path,

            uploadedAt:
                new Date(),
        };

        user.bankPassbookReceived = true;
    }

    // =================================================
    // CHECK ALL THREE DOCUMENTS
    // =================================================

    const allDocumentsUploaded =
        Boolean(user.aadhaarReceived) &&
        Boolean(user.panReceived) &&
        Boolean(user.bankPassbookReceived);

    // =================================================
    // KYC STATUS
    // =================================================

    if (
        allDocumentsUploaded &&
        user.kycStatus !== "Verified"
    ) {
        /*
         * All three documents are now available.
         *
         * Member:
         *     Upload all 3
         *          ↓
         *     Pending Review
         *
         * Admin:
         *     Approve
         *          ↓
         *     Verified
         *
         * Admin:
         *     Reject
         *          ↓
         *     Rejected
         */

        user.kycStatus = "Pending";

        user.isKycVerified = false;

        user.kycVerifiedOn = null;
    }

    await user.save();

    return user;
};

// =====================================================
// GET MY KYC
// =====================================================

const getMyKyc = async (userId) => {
    const user =
        await User.findById(userId)
            .select(
                "-password " +
                "-otp " +
                "-otpExpires " +
                "-otpPurpose " +
                "-passwordResetToken " +
                "-passwordResetExpires"
            );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    // -------------------------------------------------
    // Return KYC information
    // -------------------------------------------------

    return {
        aadhaarNumber:
            user.aadhaarNumber || "",

        panNumber:
            user.panNumber || "",

        kycStatus:
            user.kycStatus || "Pending",

        isKycVerified:
            Boolean(
                user.isKycVerified
            ),

        kycVerifiedOn:
            user.kycVerifiedOn || null,

        aadhaarReceived:
            Boolean(
                user.aadhaarReceived
            ),

        panReceived:
            Boolean(
                user.panReceived
            ),

        bankPassbookReceived:
            Boolean(
                user.bankPassbookReceived
            ),

        aadhaarDocument:
            user.aadhaarDocument || {
                fileName: "",
                filePath: "",
                uploadedAt: null,
            },

        panDocument:
            user.panDocument || {
                fileName: "",
                filePath: "",
                uploadedAt: null,
            },

        bankPassbookDocument:
            user.bankPassbookDocument || {
                fileName: "",
                filePath: "",
                uploadedAt: null,
            },
    };
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    updateKycDetails,
    uploadKycDocuments,
    getMyKyc,
};