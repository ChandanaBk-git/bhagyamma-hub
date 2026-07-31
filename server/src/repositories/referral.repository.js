const User = require("../models/user.model");

const findByReferralCode = (referralCode) => {
    return User.findOne({ referralCode });
};

const findById = (id) => {
    return User.findById(id);
};

const getDirectReferrals = (userId) => {
    return User.find({
        sponsorId: userId,
    }).select("-password");
};

const countDirectReferrals = (userId) => {
    return User.countDocuments({
        sponsorId: userId,
    });
};

module.exports = {
    findByReferralCode,
    findById,
    getDirectReferrals,
    countDirectReferrals,
};