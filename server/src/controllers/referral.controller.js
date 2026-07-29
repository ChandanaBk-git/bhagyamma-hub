const referralService = require("../services/referral.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getMyReferrals = asyncHandler(async (req, res) => {

    const referrals = await referralService.getMyReferrals(req.user.userId);

    res.status(200).json(
        new ApiResponse(
            200,
            "Direct referrals fetched successfully",
            referrals
        )
    );
});

const getReferralCount = asyncHandler(async (req, res) => {

    const count = await referralService.getReferralCount(req.user.userId);

    res.status(200).json(
        new ApiResponse(
            200,
            "Referral count fetched successfully",
            {
                totalDirectReferrals: count,
            }
        )
    );
});

module.exports = {
    getMyReferrals,
    getReferralCount,
};