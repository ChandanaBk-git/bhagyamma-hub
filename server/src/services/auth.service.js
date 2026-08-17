const User = require("../models/user.model");

const ApiError = require("../utils/ApiError");

const generateOTP = require("../utils/otp");

const sendEmail = require("../utils/sendEmail");

const bcrypt = require("bcryptjs");

const userRepository = require("../repositories/user.repository");

const {
    generateToken,
} = require("../utils/jwt");

const crypto = require("crypto");

const walletService = require("./wallet.service");


// =====================================================
// CONSTANTS
// =====================================================

const MANAGER_REFERRAL_CODE = "BHMANAGER001";


// =====================================================
// GENERATE USER ID
// =====================================================

const generateUserId = async () => {
    const count = await User.countDocuments();

    return `BH${String(count + 1).padStart(6, "0")}`;
};


// =====================================================
// GENERATE REFERRAL CODE
// =====================================================

const generateReferralCode = async () => {
    let code;
    let exists;

    do {
        code = crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase();

        exists = await userRepository.findByReferralCode(code);

    } while (exists);

    return code;
};


// =====================================================
// REGISTER
// =====================================================

const register = async (payload) => {

    const {
        name,
        email,
        mobile,
        password,
        referralCode,
    } = payload;


    // -------------------------------------------------
    // CLEAN VALUES
    // -------------------------------------------------

    const cleanName = String(name || "")
        .trim();

    const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();

    const cleanMobile = String(mobile || "")
        .replace(/\D/g, "");

    const enteredReferralCode = String(referralCode || "")
        .trim()
        .toUpperCase();


    // -------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------

    if (!cleanName) {
        throw new ApiError(
            400,
            "Name is required"
        );
    }


    if (
        cleanName.length < 3 ||
        cleanName.length > 50
    ) {
        throw new ApiError(
            400,
            "Name must be between 3 and 50 characters"
        );
    }


    if (!cleanEmail) {
        throw new ApiError(
            400,
            "Email is required"
        );
    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
        throw new ApiError(
            400,
            "Please enter a valid email address"
        );
    }


    if (
        !/^[6-9]\d{9}$/.test(cleanMobile)
    ) {
        throw new ApiError(
            400,
            "Please enter a valid 10-digit Indian mobile number"
        );
    }


    if (!password) {
        throw new ApiError(
            400,
            "Password is required"
        );
    }


    if (password.length < 8) {
        throw new ApiError(
            400,
            "Password must contain at least 8 characters"
        );
    }


    if (!/[A-Z]/.test(password)) {
        throw new ApiError(
            400,
            "Password must contain at least one uppercase letter"
        );
    }


    if (!/[a-z]/.test(password)) {
        throw new ApiError(
            400,
            "Password must contain at least one lowercase letter"
        );
    }


    if (!/[0-9]/.test(password)) {
        throw new ApiError(
            400,
            "Password must contain at least one number"
        );
    }


    if (
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
        throw new ApiError(
            400,
            "Password must contain at least one special character"
        );
    }


    if (!enteredReferralCode) {
        throw new ApiError(
            400,
            "Referral ID is required"
        );
    }


    // -------------------------------------------------
    // CHECK EMAIL
    // -------------------------------------------------

    const emailExists =
        await userRepository.findByEmail(cleanEmail);

    if (emailExists) {
        throw new ApiError(
            409,
            "Email already registered"
        );
    }


    // -------------------------------------------------
    // CHECK MOBILE
    // -------------------------------------------------

    const mobileExists =
        await userRepository.findByMobile(cleanMobile);

    if (mobileExists) {
        throw new ApiError(
            409,
            "Mobile number already registered"
        );
    }


    // -------------------------------------------------
    // REFERRAL VALIDATION
    // -------------------------------------------------

    let sponsorId = null;

    let sponsor = null;


    /*
     * DIRECT MANAGER
     *
     * BHMANAGER001 does not require
     * 40 SP.
     */

    if (
        enteredReferralCode === MANAGER_REFERRAL_CODE
    ) {

        sponsor =
            await userRepository.findByReferralCode(
                MANAGER_REFERRAL_CODE
            );


        if (!sponsor) {
            throw new ApiError(
                400,
                "Invalid Referral ID"
            );
        }


        sponsorId = sponsor._id;

    } else {

        /*
         * NORMAL SPONSOR
         */

        sponsor =
            await userRepository.findByReferralCode(
                enteredReferralCode
            );


        if (!sponsor) {
            throw new ApiError(
                400,
                "Invalid Referral ID"
            );
        }


        /*
         * Sponsor must have
         * at least 40 SP.
         */

        const sponsorSellingPoints =
            Number(
                sponsor.sellingPoints || 0
            );


        if (
            sponsorSellingPoints < 40
        ) {
            throw new ApiError(
                400,
                "Contact with your team leader to get the Referral code"
            );
        }


        sponsorId = sponsor._id;
    }


    // -------------------------------------------------
    // GENERATE USER ID
    // -------------------------------------------------

    const userId =
        await generateUserId();


    // -------------------------------------------------
    // GENERATE NEW REFERRAL CODE
    // -------------------------------------------------

    const newReferralCode =
        await generateReferralCode();


    // -------------------------------------------------
    // USER DATA
    // -------------------------------------------------

    const userData = {

        userId,

        name: cleanName,

        email: cleanEmail,

        mobile: cleanMobile,

        password,

        sponsorId,

        referralCode: newReferralCode,


        // -------------------------------------------------
        // MEMBERSHIP
        // -------------------------------------------------

        /*
         * Registration does NOT activate
         * business membership.
         */

        membershipStatus: "Pending",

        membershipActivationMethod: null,

        membershipActivatedAt: null,

        membershipSPAwarded: false,


        // -------------------------------------------------
        // PURCHASE / SP
        // -------------------------------------------------

        qualifyingPurchaseAmount: 0,

        sellingPoints: 0,

        pendingPurchaseAmount: 0,

        lifetimePurchase: 0,


        // -------------------------------------------------
        // ACCOUNT STATUS
        // -------------------------------------------------

        isActive: true,
    };


    // -------------------------------------------------
    // CREATE USER
    // -------------------------------------------------

    const user =
        await userRepository.create(userData);


    // -------------------------------------------------
    // CREATE WALLET
    // -------------------------------------------------

    await walletService.getWallet(
        user._id
    );


    // -------------------------------------------------
    // GENERATE JWT
    // -------------------------------------------------

    const token =
        generateToken(user);


    // -------------------------------------------------
    // REMOVE PASSWORD
    // -------------------------------------------------

    user.password = undefined;


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return {

        success: true,

        message:
            "Registration successful. Your membership is currently Pending. Complete the ₹2,000 membership qualification to activate it.",

        token,

        user,
    };
};


// =====================================================
// LOGIN
// =====================================================

const login = async ({
    email,
    password,
}) => {

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
        await userRepository.findByEmail(
            cleanEmail
        );


    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    // -------------------------------------------------
    // CHECK ACCOUNT STATUS
    // -------------------------------------------------

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Your account is inactive"
        );
    }


    // -------------------------------------------------
    // CHECK PASSWORD
    // -------------------------------------------------

    const isMatch =
        await user.comparePassword(
            password
        );


    if (!isMatch) {
        throw new ApiError(
            401,
            "Invalid credentials"
        );
    }


    // -------------------------------------------------
    // UPDATE LAST LOGIN
    // -------------------------------------------------

    await userRepository.updateById(
        user._id,
        {
            lastLogin: new Date(),
        }
    );


    // -------------------------------------------------
    // GENERATE TOKEN
    // -------------------------------------------------

    const token =
        generateToken(user);


    // -------------------------------------------------
    // REMOVE SENSITIVE DATA
    // -------------------------------------------------

    user.password = undefined;

    user.otp = undefined;

    user.otpExpires = undefined;

    user.otpPurpose = undefined;


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return {

        success: true,

        message:
            "Login successful",

        token,

        user,
    };
};


// =====================================================
// VERIFY OTP
// =====================================================

const verifyOtp = async ({
    email,
    otp,
}) => {

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    const user =
        await userRepository.findByEmailWithOtp(
            cleanEmail
        );


    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    // -------------------------------------------------
    // CHECK OTP
    // -------------------------------------------------

    if (
        user.otp !== otp
    ) {
        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }


    // -------------------------------------------------
    // CHECK OTP PURPOSE
    // -------------------------------------------------

    if (
        user.otpPurpose !== "LOGIN"
    ) {
        throw new ApiError(
            400,
            "Invalid OTP purpose"
        );
    }


    // -------------------------------------------------
    // CHECK OTP EXPIRATION
    // -------------------------------------------------

    if (
        !user.otpExpires ||
        user.otpExpires < new Date()
    ) {
        throw new ApiError(
            400,
            "OTP expired"
        );
    }


    // -------------------------------------------------
    // CLEAR OTP
    // -------------------------------------------------

    await userRepository.clearOtp(
        cleanEmail
    );


    // -------------------------------------------------
    // UPDATE LAST LOGIN
    // -------------------------------------------------

    await userRepository.updateById(
        user._id,
        {
            lastLogin: new Date(),
        }
    );


    // -------------------------------------------------
    // GENERATE TOKEN
    // -------------------------------------------------

    const token =
        generateToken(user);


    // -------------------------------------------------
    // REMOVE SENSITIVE DATA
    // -------------------------------------------------

    user.password = undefined;

    user.otp = undefined;

    user.otpExpires = undefined;

    user.otpPurpose = undefined;


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return {

        success: true,

        message:
            "OTP verified successfully",

        token,

        user,
    };
};


// =====================================================
// GET PROFILE
// =====================================================

const getProfile = async (
    userId
) => {

    const user =
        await userRepository.findById(
            userId
        );


    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    return user;
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async ({
    email,
}) => {

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
        await userRepository.findByEmailWithOtp(
            cleanEmail
        );


    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    // -------------------------------------------------
    // CHECK ACCOUNT
    // -------------------------------------------------

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Account is inactive"
        );
    }


    // -------------------------------------------------
    // GENERATE OTP
    // -------------------------------------------------

    const otp =
        generateOTP();


    // -------------------------------------------------
    // SAVE OTP
    // -------------------------------------------------

    await userRepository.updateOtp(

        cleanEmail,

        otp,

        new Date(
            Date.now() +
            5 * 60 * 1000
        ),

        "FORGOT_PASSWORD"
    );


    // -------------------------------------------------
    // SEND EMAIL
    // -------------------------------------------------

    await sendEmail(

        cleanEmail,

        "Bhagyamma Hub Password Reset OTP",

        `
        <h2>Bhagyamma Hub</h2>

        <p>Hello <b>${user.name}</b>,</p>

        <p>Your Password Reset OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 5 minutes.</p>
        `
    );


    return {

        success: true,

        message:
            "OTP sent successfully",
    };
};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async ({
    email,
    otp,
    password,
}) => {

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    // -------------------------------------------------
    // BASIC PASSWORD VALIDATION
    // -------------------------------------------------

    if (!password) {
        throw new ApiError(
            400,
            "Password is required"
        );
    }


    if (password.length < 8) {
        throw new ApiError(
            400,
            "Password must contain at least 8 characters"
        );
    }


    if (!/[A-Z]/.test(password)) {
        throw new ApiError(
            400,
            "Password must contain at least one uppercase letter"
        );
    }


    if (!/[a-z]/.test(password)) {
        throw new ApiError(
            400,
            "Password must contain at least one lowercase letter"
        );
    }


    if (!/[0-9]/.test(password)) {
        throw new ApiError(
            400,
            "Password must contain at least one number"
        );
    }


    if (
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
        throw new ApiError(
            400,
            "Password must contain at least one special character"
        );
    }


    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
        await userRepository.findByEmailWithOtp(
            cleanEmail
        );


    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    // -------------------------------------------------
    // CHECK OTP
    // -------------------------------------------------

    if (
        user.otp !== otp
    ) {
        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }


    // -------------------------------------------------
    // CHECK OTP PURPOSE
    // -------------------------------------------------

    if (
        user.otpPurpose !== "FORGOT_PASSWORD"
    ) {
        throw new ApiError(
            400,
            "Invalid OTP purpose"
        );
    }


    // -------------------------------------------------
    // CHECK OTP EXPIRATION
    // -------------------------------------------------

    if (
        !user.otpExpires ||
        user.otpExpires < new Date()
    ) {
        throw new ApiError(
            400,
            "OTP expired"
        );
    }


    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );


    // -------------------------------------------------
    // UPDATE PASSWORD
    // -------------------------------------------------

    await userRepository.updatePassword(
        cleanEmail,
        hashedPassword
    );


    // -------------------------------------------------
    // CLEAR OTP
    // -------------------------------------------------

    await userRepository.clearOtp(
        cleanEmail
    );


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return {

        success: true,

        message:
            "Password updated successfully",
    };
};


// =====================================================
// RESEND OTP
// =====================================================

const resendOtp = async ({
    email,
}) => {

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
        await userRepository.findByEmailWithOtp(
            cleanEmail
        );


    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    // -------------------------------------------------
    // CHECK ACCOUNT
    // -------------------------------------------------

    if (!user.isActive) {
        throw new ApiError(
            403,
            "Account is inactive"
        );
    }


    // -------------------------------------------------
    // GENERATE OTP
    // -------------------------------------------------

    const otp =
        generateOTP();


    // -------------------------------------------------
    // SAVE OTP
    // -------------------------------------------------

    await userRepository.updateOtp(

        cleanEmail,

        otp,

        new Date(
            Date.now() +
            5 * 60 * 1000
        ),

        "LOGIN"
    );


    // -------------------------------------------------
    // SEND EMAIL
    // -------------------------------------------------

    await sendEmail(

        cleanEmail,

        "Bhagyamma Hub OTP",

        `
        <h2>Bhagyamma Hub</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 5 minutes.</p>
        `
    );


    return {

        success: true,

        message:
            "OTP resent successfully",
    };
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    register,

    login,

    getProfile,

    verifyOtp,

    forgotPassword,

    resetPassword,

    resendOtp,
};