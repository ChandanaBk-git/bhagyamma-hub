const User = require("../models/user.model");

/* -------------------------------------------------------------------------- */
/*                               Find Methods                                 */
/* -------------------------------------------------------------------------- */

const findById = (id) => {
    return User.findById(id).select("-password");
};

const findByEmail = (email) => {
    return User.findOne({ email });
};

const findByMobile = (mobile) => {
    return User.findOne({ mobile });
};

const findByUserId = (userId) => {
    return User.findOne({ userId }).select("-password");
};

const findByReferralCode = (referralCode) => {
    return User.findOne({ referralCode });
};

/* -------------------------------------------------------------------------- */
/*                               Create User                                  */
/* -------------------------------------------------------------------------- */

const create = (payload) => {
    return User.create(payload);
};

/* -------------------------------------------------------------------------- */
/*                               Update User                                  */
/* -------------------------------------------------------------------------- */

const updateById = (id, payload) => {
    return User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).select("-password");
};

const updateByEmail = (email, payload) => {
    return User.findOneAndUpdate({ email }, payload, {
        new: true,
        runValidators: true,
    }).select("-password");
};

/* -------------------------------------------------------------------------- */
/*                               Delete User                                  */
/* -------------------------------------------------------------------------- */

const deleteById = (id) => {
    return User.findByIdAndDelete(id);
};

/* -------------------------------------------------------------------------- */
/*                               Exists                                       */
/* -------------------------------------------------------------------------- */

const exists = (filter) => {
    return User.exists(filter);
};

/* -------------------------------------------------------------------------- */
/*                               Find All                                     */
/* -------------------------------------------------------------------------- */

const findAll = (filter = {}, options = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
    } = options;

    return User.find(filter)
        .select("-password")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
};

module.exports = {
    findById,
    findByEmail,
    findByMobile,
    findByUserId,
    findByReferralCode,
    create,
    updateById,
    updateByEmail,
    deleteById,
    exists,
    findAll,
};