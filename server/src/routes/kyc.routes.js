const express = require("express");

const router = express.Router();

const kycController = require("../controllers/kyc.controller");

const {
    protect,
} = require("../middleware/auth.middleware");

const kycUpload = require("../middleware/kycUpload.middleware");

// =====================================================
// GET MY KYC
// =====================================================

router.get(
    "/me",
    protect,
    kycController.getMyKyc
);

// =====================================================
// ADD / UPDATE KYC DETAILS
// =====================================================

router.put(
    "/me",
    protect,
    kycController.updateKycDetails
);

// =====================================================
// UPLOAD KYC DOCUMENTS
// =====================================================

router.post(
    "/documents",
    protect,
    kycUpload.fields([
        {
            name: "aadhaar",
            maxCount: 1,
        },
        {
            name: "pan",
            maxCount: 1,
        },
        {
            name: "bankPassbook",
            maxCount: 1,
        },
    ]),
    kycController.uploadKycDocuments
);

module.exports = router;