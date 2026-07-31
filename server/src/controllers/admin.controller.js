const adminService = require("../services/admin.service");

// ==========================================
// Dashboard
// ==========================================

const getDashboard = async (req, res, next) => {

    try {

        const dashboard =
            await adminService.getDashboard();

        res.status(200).json({

            success: true,

            message: "Dashboard fetched successfully",

            data: dashboard,

        });

    } catch (error) {

        next(error);

    }

};

// ==========================================
// Get All Users
// ==========================================

const getAllUsers = async (req, res, next) => {

    try {

        const users =
            await adminService.getAllUsers();

        res.status(200).json({

            success: true,

            count: users.length,

            data: users,

        });

    } catch (error) {

        next(error);

    }

};

// ==========================================
// Get User By ID
// ==========================================

const getUserById = async (req, res, next) => {

    try {

        const user =
            await adminService.getUserById(
                req.params.id
            );

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found",

            });

        }

        res.status(200).json({

            success: true,

            data: user,

        });

    } catch (error) {

        next(error);

    }

};

// ==========================================
// Update User Details
// ==========================================

const updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateUser(
      req.params.id,
      req.body
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
// ==========================================
// Activate / Deactivate User
// ==========================================

const updateUserStatus = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await adminService.updateUserStatus(

                req.params.id,

                req.body.isActive

            );

        res.status(200).json({

            success: true,

            message: "User status updated",

            data: user,

        });

    } catch (error) {

        next(error);

    }

};

// ==========================================
// Change User Role
// ==========================================

const updateUserRole = async (
    req,
    res,
    next
) => {

    try {

        const user =
            await adminService.updateUserRole(

                req.params.id,

                req.body.role

            );

        res.status(200).json({

            success: true,

            message: "Role updated successfully",

            data: user,

        });

    } catch (error) {

        next(error);

    }

};

// ==========================================
// Delete User
// ==========================================

const deleteUser = async (
    req,
    res,
    next
) => {

    try {

        await adminService.deleteUser(
            req.params.id
        );

        res.status(200).json({

            success: true,

            message: "User deleted successfully",

        });

    } catch (error) {

        next(error);

    }

};

const getReferralTree = async (req, res, next) => {
  try {
    const tree =
      await adminService.getReferralTree();

    res.status(200).json({
      success: true,
      data: tree,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {

    getDashboard,

    getAllUsers,

    getUserById,

    updateUser,

    updateUserStatus,

    updateUserRole,

    deleteUser,

    getReferralTree,

};