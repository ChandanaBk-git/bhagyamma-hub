const adminRepository = require("../repositories/admin.repository");

// ============================================
// DASHBOARD
// ============================================

const getDashboard = async () => {
  const [
    totalMembers,
    totalProducts,
    totalLayers,
    recentMembers,
  ] = await Promise.all([
    adminRepository.countMembers(),
    adminRepository.countProducts(),
    adminRepository.calculateTotalLayers(),
    adminRepository.recentMembers(),
  ]);

  return {
    totalMembers,
    totalProducts,
    totalLayers,
    recentMembers,
  };
};

// ============================================
// USER MANAGEMENT
// ============================================

const getAllUsers = async () => {
  return await adminRepository.getAllUsers();
};

const getUserById = async (id) => {
  return await adminRepository.getUserById(id);
};
const updateUser = async (id, data) => {
  return await adminRepository.updateUser(id, data);
};
const updateUserStatus = async (id, isActive) => {
  return await adminRepository.updateUserStatus(id, isActive);
};

const updateUserRole = async (id, role) => {
  return await adminRepository.updateUserRole(id, role);
};

const deleteUser = async (id) => {
  return await adminRepository.deleteUser(id);
};

// ============================================
// REFERRAL TREE
// ============================================

const buildTree = (users, parentId = null) => {
  return users
    .filter((user) => {
      if (parentId === null) {
        return user.sponsorId === null;
      }

      return (
        user.sponsorId &&
        user.sponsorId.toString() === parentId.toString()
      );
    })
    .map((user) => ({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      referralCode: user.referralCode,
      role: user.role,
      sponsorId: user.sponsorId,
      createdAt: user.createdAt,
      children: buildTree(users, user._id),
    }));
};

const getReferralTree = async () => {
  const users = await adminRepository.getAllUsersWithSponsor();

  // Find the Manager
  const manager = users.find(
    (user) => user.role === "MANAGER"
  );

  if (!manager) {
    return [];
  }

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

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Dashboard
  getDashboard,

  // User Management
  getAllUsers,
  getUserById,
    updateUser,
  updateUserStatus,
  updateUserRole,
  deleteUser,

  // Referral Tree
  getReferralTree,
};