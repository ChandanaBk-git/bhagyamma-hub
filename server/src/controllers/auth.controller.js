const {
    register: registerService,
    login: loginService,
    getProfile: getProfileService,
} = require("../services/auth.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/auth.service");
/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
    const result = await registerService(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Registration successful",
            result
        )
    );
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
    const result = await loginService(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            result
        )
    );
});

/**
 * @desc    Get Logged-in User Profile
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
    const result = await getProfileService(req.user.userId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile fetched successfully",
            result
        )
    );
});

const verifyOtp = async (req, res, next) => {
    try {

        const result = await authService.verifyOtp(req.body);

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};
const forgotPassword = async (req, res, next) => {
    try {

        const result = await authService.forgotPassword(req.body);

        return res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error) {
        next(error);
    }
};
const resetPassword = async (req, res, next) => {
    try {

        const result = await authService.resetPassword(req.body);

        return res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error) {
        next(error);
    }
};
module.exports = {
    register,
    login,
    getProfile,
    resetPassword,
    forgotPassword,
    verifyOtp,
};