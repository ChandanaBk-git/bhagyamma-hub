const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const userService = require("../services/user.service");

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


module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats,
    getMyProfile,
};