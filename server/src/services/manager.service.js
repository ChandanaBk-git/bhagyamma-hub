const User = require("../models/user.model");

// ===============================
// Get Complete Downline
// ===============================

const getDownline = (users, parentId, result = []) => {
  const children = users.filter(
    (user) =>
      user.sponsorId &&
      user.sponsorId.toString() === parentId.toString()
  );

  children.forEach((child) => {
    result.push(child);
    getDownline(users, child._id, result);
  });

  return result;
};

// ===============================
// Build Tree
// ===============================

const buildTree = (users, parentId) => {
  return users
    .filter(
      (user) =>
        user.sponsorId &&
        user.sponsorId.toString() === parentId.toString()
    )
    .map((user) => ({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      referralCode: user.referralCode,
      role: user.role,
      sponsorId: user.sponsorId,
      createdAt: user.createdAt,
      children: buildTree(users, user._id),
    }));
};

// ===============================
// Dashboard
// ===============================

const getDashboard = async (managerId) => {
  const users = await User.find();

  const downline = getDownline(users, managerId);

  const recentMembers = [...downline]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  const calculateLevels = (parentId) => {
    const children = users.filter(
      (user) =>
        user.sponsorId &&
        user.sponsorId.toString() === parentId.toString()
    );

    if (!children.length) return 1;

    return (
      1 +
      Math.max(
        ...children.map((child) =>
          calculateLevels(child._id)
        )
      )
    );
  };

  return {
    totalMembers: downline.length,
    totalLayers: calculateLevels(managerId),
    recentMembers,
  };
};

// ===============================
// Members
// ===============================

const getMembers = async (managerId) => {
  const users = await User.find();

  return getDownline(users, managerId);
};

// ===============================
// Member Details
// ===============================

const getMemberById = async (id) => {
  return await User.findById(id);
};

// ===============================
// Referral Tree
// ===============================

const getReferralTree = async (managerId) => {
  const users = await User.find();

  const manager = await User.findById(managerId);

  return [
    {
      _id: manager._id,
      userId: manager.userId,
      name: manager.name,
      referralCode: manager.referralCode,
      role: manager.role,
      sponsorId: manager.sponsorId,
      createdAt: manager.createdAt,
      children: buildTree(users, manager._id),
    },
  ];
};

// ===============================
// Profile
// ===============================

const getProfile = async (managerId) => {
  return await User.findById(managerId).select(
    "-password"
  );
};

module.exports = {
  getDashboard,
  getMembers,
  getMemberById,
  getReferralTree,
  getProfile,
};