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

// ================================
// Dashboard Helper
// ================================

const findBySponsor = (userId) => {
    return User.find({
        sponsorId: userId,
    }).select("-password");
};

module.exports = {
    findByReferralCode,
    findById,
    getDirectReferrals,
    countDirectReferrals,
    findBySponsor,
};