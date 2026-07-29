const { body } = require("express-validator");

/* -------------------------------------------------------------------------- */
/*                               Register Validation                          */
/* -------------------------------------------------------------------------- */

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Name must be between 3 and 50 characters"),

    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Valid email is required"),

    body("mobile")
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit mobile number"),

    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain at least one special character"),

    body("referralCode")
        .optional()
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Invalid referral code"),
];

/* -------------------------------------------------------------------------- */
/*                                 Login Validation                           */
/* -------------------------------------------------------------------------- */

const loginValidation = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

/* -------------------------------------------------------------------------- */
/*                           Forgot Password Validation                       */
/* -------------------------------------------------------------------------- */

const forgotPasswordValidation = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Valid email is required"),
];

/* -------------------------------------------------------------------------- */
/*                           Reset Password Validation                        */
/* -------------------------------------------------------------------------- */

const resetPasswordValidation = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Valid email is required"),

    body("otp")
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")
        .isNumeric()
        .withMessage("OTP must contain only numbers"),

    body("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?\":{}|<>]/)
        .withMessage("Password must contain at least one special character"),
];

/* -------------------------------------------------------------------------- */
/*                           Change Password Validation                       */
/* -------------------------------------------------------------------------- */

const changePasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .trim()
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain at least one special character"),
];

/* -------------------------------------------------------------------------- */
/*                            Change Email Validation                         */
/* -------------------------------------------------------------------------- */

const changeEmailValidation = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Valid email is required"),
];

/* -------------------------------------------------------------------------- */
/*                           Change Mobile Validation                         */
/* -------------------------------------------------------------------------- */

const changeMobileValidation = [
    body("mobile")
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit mobile number"),
];

const verifyOtpValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("otp")
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")
        .isNumeric()
        .withMessage("OTP must contain only numbers"),
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
        verifyOtpValidation, 
    changeEmailValidation,
    changeMobileValidation,
};