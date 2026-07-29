const referralRepository = require("../repositories/referral.repository");
const ApiError = require("../utils/ApiError");

const getMyReferrals = async (userId) => {
    return await referralRepository.getDirectReferrals(userId);
};

const getReferralCount = async (userId) => {
    return await referralRepository.countDirectReferrals(userId);
};

const getReferralByCode = async (referralCode) => {

    const sponsor = await referralRepository.findByReferralCode(referralCode);

    if (!sponsor) {
        throw new ApiError(404, "Referral code not found");
    }

    return sponsor;
};

module.exports = {
    getMyReferrals,
    getReferralCount,
    getReferralByCode,
};