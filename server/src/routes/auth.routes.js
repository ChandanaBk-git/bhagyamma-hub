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

// ===============================
// REGISTER
// ===============================

router.post(
    "/register",
    registerValidation,
    validate,
    authController.register
);

// ===============================
// LOGIN
// Email + Password → Send OTP
// ===============================

router.post(
    "/login",
    loginValidation,
    validate,
    authController.login
);

// ===============================
// VERIFY LOGIN OTP
// ===============================

router.post(
    "/verify-otp",
    authController.verifyOtp
);

// ===============================
// FORGOT PASSWORD
// ===============================

router.post(
    "/forgot-password",
    authController.forgotPassword
);

// ===============================
// RESET PASSWORD
// ===============================

router.post(
    "/reset-password",
    authController.resetPassword
);

// ===============================
// MOBILE FORGOT PASSWORD
// ===============================

router.post(
    "/forgot-password-mobile",
    authController.sendMobileResetOtp
);

// ===============================
// VERIFY RESET OTP
// ===============================

router.post(
    "/verify-reset-otp",
    authController.verifyResetOtp
);

// ===============================
// USER PROFILE
// ===============================

router.get(
    "/profile",
    protect,
    authController.getProfile
);

module.exports = router;