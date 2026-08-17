const {
    register: registerService,
    login: loginService,
    getProfile: getProfileService,
} = require("../services/auth.service");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/auth.service");

// =====================================================
// REGISTER
// =====================================================

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {

    const result =
        await registerService(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Registration successful",
            result
        )
    );
});

// =====================================================
// LOGIN
// =====================================================

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {

    const result =
        await loginService(req.body);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            result
        )
    );
});

// =====================================================
// GET LOGGED-IN USER PROFILE
// =====================================================

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {

    /*
     * IMPORTANT:
     *
     * req.user.id
     * = MongoDB ObjectId
     *
     * req.user.userId
     * = Bhagyamma Hub custom ID
     *
     * Example:
     *
     * req.user.id     = 6a6daaa0573f7fd53a4dc547
     * req.user.userId = BH000008
     *
     * findById() must receive req.user.id.
     */

    const result =
        await getProfileService(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile fetched successfully",
            result
        )
    );
});

// =====================================================
// VERIFY OTP
// =====================================================

const verifyOtp = async (req, res, next) => {

    try {

        const result =
            await authService.verifyOtp(req.body);

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: result,
        });

    } catch (error) {

        next(error);

    }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res, next) => {

    try {

        const result =
            await authService.forgotPassword(req.body);

        return res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error) {

        next(error);

    }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res, next) => {

    try {

        const result =
            await authService.resetPassword(req.body);

        return res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error) {

        next(error);

    }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    register,
    login,
    getProfile,
    resetPassword,
    forgotPassword,
    verifyOtp,
};