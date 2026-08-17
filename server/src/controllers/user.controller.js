const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const userService = require("../services/user.service");
const sellingPointService = require("../services/sellingPoint.service");

const getAllUsers = asyncHandler(async (req, res) => {

    const users = await userService.getAllUsers(req.query);

    res.json(
        new ApiResponse(
            200,
            "Users fetched successfully",
            users
        )
    );

});

const updateUser = asyncHandler(async (req, res) => {

    const user = await userService.updateUser(
        req.params.id,
        req.body
    );

    res.json(
        new ApiResponse(
            200,
            "User updated successfully",
            user
        )
    );
});

const updateMyProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateMyProfile(
        req.user.id,
        req.body
    );

    res.json(
        new ApiResponse(
            200,
            "Profile updated successfully",
            user
        )
    );
});

const deleteUser = asyncHandler(async (req, res) => {

    const user = await userService.deleteUser(req.params.id);

    res.json(
        new ApiResponse(
            200,
            "User deleted successfully",
            user
        )
    );
});

const getUserStats = asyncHandler(async (req, res) => {

    const stats = await userService.getUserStats();

    res.json(
        new ApiResponse(
            200,
            "User statistics fetched successfully",
            stats
        )
    );
});

const getMyProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user.id);

    res.status(200).json(
        new ApiResponse(200, user, "Profile fetched successfully")
    );
});

/* -------------------------------------------------------------------------- */
/*                               My Network                                   */
/* -------------------------------------------------------------------------- */

const getMyNetwork = asyncHandler(async (req, res) => {

    const network = await userService.getMyNetwork(req.user.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "My network fetched successfully",
            network
        )
    );

});

const getUserById = asyncHandler(async (req, res) => {

    const user = await userService.getUserById(req.params.id);

    res.json(
        new ApiResponse(
            200,
            "User fetched successfully",
            user
        )
    );

});

const getReferralTree = asyncHandler(async (req, res) => {
    const tree = await userService.getReferralTree(req.user.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Referral tree fetched successfully",
            tree
        )
    );
});
const getDashboard = async (req, res, next) => {
    try {
        const dashboard = await userService.getDashboard(req.user.id);

        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};

const getSellingPoints = asyncHandler(async (req, res) => {

    const data =
        await sellingPointService.getPoints(
            req.user._id
        );

    res.status(200).json({
        success: true,
        data,
    });

});

module.exports = {
    getAllUsers,
    getUserById,
    getReferralTree,
    updateUser,
    updateMyProfile,
    deleteUser,
    getUserStats,
    getMyProfile,

        // Network
    getMyNetwork,
    getDashboard,
    getSellingPoints,
};