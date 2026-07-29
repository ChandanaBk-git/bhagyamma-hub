const adminRepository = require("../repositories/admin.repository");

// ============================================
// DASHBOARD
// ============================================

const getDashboard = async () => {

    const [
        totalUsers,
        totalManagers,
        totalMembers,
        totalSupervisors,
        activeUsers,
        totalCommissionPaid,
        totalWalletBalance,
        totalSellingPoints,
        recentUsers,
        recentCommissions,
    ] = await Promise.all([

        adminRepository.countUsers(),

        adminRepository.countManagers(),

        adminRepository.countMembers(),

        adminRepository.countSupervisors(),

        adminRepository.countActiveUsers(),

        adminRepository.totalCommissionPaid(),

        adminRepository.totalWalletBalance(),

        adminRepository.totalSellingPoints(),

        adminRepository.recentUsers(),

        adminRepository.recentCommissions(),

    ]);

    return {

        totalUsers,

        totalManagers,

        totalMembers,

        totalSupervisors,

        activeUsers,

        totalCommissionPaid,

        totalWalletBalance,

        totalSellingPoints,

        recentUsers,

        recentCommissions,

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

const updateUserStatus = async (id, isActive) => {

    return await adminRepository.updateUserStatus(
        id,
        isActive
    );

};

const updateUserRole = async (id, role) => {

    return await adminRepository.updateUserRole(
        id,
        role
    );

};

const deleteUser = async (id) => {

    return await adminRepository.deleteUser(id);

};

module.exports = {

    // Dashboard
    getDashboard,

    // User Management
    getAllUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
    deleteUser,

};