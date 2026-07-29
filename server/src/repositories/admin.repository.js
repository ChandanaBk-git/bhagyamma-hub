const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Commission = require("../models/commission.model");

// ============================================
// DASHBOARD
// ============================================

const countUsers = () =>
    User.countDocuments();

const countManagers = () =>
    User.countDocuments({
        role: "MANAGER",
    });

const countMembers = () =>
    User.countDocuments({
        role: "MEMBER",
    });

const countSupervisors = () =>
    User.countDocuments({
        role: "SUPERVISOR",
    });

const countActiveUsers = () =>
    User.countDocuments({
        isActive: true,
    });

const totalCommissionPaid = async () => {

    const result = await Commission.aggregate([
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount",
                },
            },
        },
    ]);

    return result[0]?.total || 0;
};

const totalWalletBalance = async () => {

    const result = await Wallet.aggregate([
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$balance",
                },
            },
        },
    ]);

    return result[0]?.total || 0;
};

const totalSellingPoints = async () => {

    const result = await User.aggregate([
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$spBalance",
                },
            },
        },
    ]);

    return result[0]?.total || 0;
};

const recentUsers = () =>
    User.find()
        .select("name role createdAt")
        .sort({ createdAt: -1 })
        .limit(5);

const recentCommissions = () =>
    Commission.find()
        .populate("fromUser", "name")
        .populate("toUser", "name")
        .sort({ createdAt: -1 })
        .limit(5);

// ============================================
// USER MANAGEMENT
// ============================================

const getAllUsers = () =>
    User.find()
        .select("-password")
        .sort({ createdAt: -1 });

const getUserById = (id) =>
    User.findById(id)
        .select("-password");

const updateUserStatus = (id, isActive) =>
    User.findByIdAndUpdate(
        id,
        { isActive },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");

const updateUserRole = (id, role) =>
    User.findByIdAndUpdate(
        id,
        { role },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");

const deleteUser = (id) =>
    User.findByIdAndDelete(id);

module.exports = {

    // Dashboard
    countUsers,
    countManagers,
    countMembers,
    countSupervisors,
    countActiveUsers,
    totalCommissionPaid,
    totalWalletBalance,
    totalSellingPoints,
    recentUsers,
    recentCommissions,

    // User Management
    getAllUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
    deleteUser,

};