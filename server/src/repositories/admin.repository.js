const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");
const Commission = require("../models/commissionTransaction.model");
const Product = require("../models/product");
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
const countProducts = () =>
  Product.countDocuments();

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

const recentMembers = () =>
  User.find({ role: "MEMBER" })
    .select(
      "userId name referralCode mobile createdAt paymentStatus kycStatus welcomeKitStatus"
    )
    .sort({ createdAt: -1 })
    .limit(20);

    const calculateTotalLayers = async () => {
  const users = await User.find().select("_id sponsorId");

  let maxDepth = 0;

  const getDepth = (userId) => {
    let depth = 1;

    let current = users.find(
      (u) => u._id.toString() === userId.toString()
    );

    while (current && current.sponsorId) {
      depth++;

      current = users.find(
        (u) =>
          u._id.toString() ===
          current.sponsorId.toString()
      );
    }

    return depth;
  };

  users.forEach((user) => {
    const depth = getDepth(user._id);

    if (depth > maxDepth) {
      maxDepth = depth;
    }
  });

  return maxDepth;
};

const recentCommissions = () =>
  Commission.find()
    .populate("fromUser", "name")
    .populate("toUser", "name")
    .sort({ createdAt: -1 })
    .limit(5);

// ============================================
// REFERRAL TREE
// ============================================

const getAllUsersWithSponsor = () =>
  User.find()
    .select(
      "_id userId name referralCode sponsorId role createdAt"
    )
    .lean();

// ============================================
// USER MANAGEMENT
// ============================================

const getAllUsers = () =>
  User.find()
    .select("-password")
    .sort({ createdAt: -1 });

const updateUser = (id, data) =>
  User.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

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

// ============================================
// EXPORTS
// ============================================

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
  recentMembers,
  recentCommissions,
  countProducts,
  calculateTotalLayers,

  // Referral Tree
  getAllUsersWithSponsor,

  // User Management
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};