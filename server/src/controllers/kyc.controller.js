const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const kycService = require("../services/kyc.service");

// =====================================================
// GET MY KYC
// =====================================================

/**
 * @desc    Get logged-in user's KYC information
 * @route   GET /api/v1/kyc/me
 * @access  Private
 */

const getMyKyc = asyncHandler(async (req, res) => {
    const result =
        await kycService.getMyKyc(
            req.user.id
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            "KYC details fetched successfully",
            result
        )
    );
});

// =====================================================
// ADD / UPDATE KYC DETAILS
// =====================================================

/**
 * @desc    Add or update Aadhaar/PAN details
 * @route   PUT /api/v1/kyc/me
 * @access  Private
 */

const updateKycDetails = asyncHandler(
    async (req, res) => {

        const result =
            await kycService.updateKycDetails(
                req.user.id,
                req.body
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "KYC details saved successfully",
                result
            )
        );
    }
);

// =====================================================
// UPLOAD KYC DOCUMENTS
// =====================================================

/**
 * @desc    Upload Aadhaar, PAN and Bank Passbook PDFs
 * @route   POST /api/v1/kyc/documents
 * @access  Private
 */

const uploadKycDocuments = asyncHandler(
    async (req, res) => {

        const result =
            await kycService.uploadKycDocuments(
                req.user.id,
                req.files
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "KYC documents uploaded successfully",
                result
            )
        );
    }
);

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    getMyKyc,
    updateKycDetails,
    uploadKycDocuments,
};