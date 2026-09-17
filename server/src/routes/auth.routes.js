const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

const {
    registerValidation,
    loginValidation,
} = require("../validations/auth.validation");

const validate = require("../middleware/validate.middleware");

const {
    protect,
} = require("../middleware/auth.middleware");

// Register
router.post(
    "/register",
    registerValidation,
    validate,
    authController.register
);

// Login (Email + Password → Send OTP)
router.post(
    "/login",
    loginValidation,
    validate,
    authController.login
);

// Verify OTP
router.post(
    "/verify-otp",
    authController.verifyOtp
);

// Forgot Password
router.post(
    "/forgot-password",
    authController.forgotPassword
);

// Reset Password
router.post(
    "/reset-password",
    authController.resetPassword
);

// Mobile Forgot Password - Send OTP
router.post(
    "/forgot-password-mobile",
    authController.sendMobileResetOtp
);

// Mobile Forgot Password - Verify OTP
router.post(
    "/verify-reset-otp",
    authController.verifyResetOtp
);

// User Profile
router.get(
    "/profile",
    protect,
    authController.getProfile
);

router.post(
  "/forgot-password-mobile",
  authController.sendMobileResetOtp
);

router.post(
  "/verify-reset-otp",
  authController.verifyResetOtp
);

module.exports = router;