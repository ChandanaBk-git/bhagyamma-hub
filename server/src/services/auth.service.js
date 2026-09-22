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

const orderService = require("./order.service");

const MANAGER_REFERRAL_CODE = "BHMANAGER001";

const PackagingStaff = require("../models/packagingStaff.model");

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

        exists =
            await userRepository.findByReferralCode(
                code
            );

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

    const cleanName =
        String(name || "").trim();

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();

    const cleanMobile =
        String(mobile || "")
            .replace(/\D/g, "");

    const enteredReferralCode =
        String(referralCode || "")
            .trim()
            .toUpperCase();


    // -------------------------------------------------
    // VALIDATION
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
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            cleanEmail
        )
    ) {
        throw new ApiError(
            400,
            "Please enter a valid email address"
        );
    }

    if (
        !/^[6-9]\d{9}$/.test(
            cleanMobile
        )
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
        !/[!@#$%^&*(),.?":{}|<>]/.test(
            password
        )
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
        await userRepository.findByEmail(
            cleanEmail
        );

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
        await userRepository.findByMobile(
            cleanMobile
        );

    if (mobileExists) {
        throw new ApiError(
            409,
            "Mobile number already registered"
        );
    }


    // -------------------------------------------------
    // REFERRAL
    // -------------------------------------------------

    let sponsorId = null;
    let sponsor = null;

    if (
        enteredReferralCode ===
        MANAGER_REFERRAL_CODE
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
    // USER ID / REFERRAL CODE
    // -------------------------------------------------

    const userId =
        await generateUserId();

    const newReferralCode =
        await generateReferralCode();


    // -------------------------------------------------
    // USER DATA
    // -------------------------------------------------

    const userData = {

        userId,

        name:
            cleanName,

        email:
            cleanEmail,

        mobile:
            cleanMobile,

        password,

        sponsorId,

        referralCode:
            newReferralCode,

        membershipStatus:
            "Pending",

        membershipActivationMethod:
            null,

        membershipActivatedAt:
            null,

        membershipSPAwarded:
            false,

        qualifyingPurchaseAmount:
            0,

        sellingPoints:
            0,

        pendingPurchaseAmount:
            0,

        lifetimePurchase:
            0,

        isActive:
            true,
    };


    // -------------------------------------------------
    // CREATE USER
    // -------------------------------------------------

    let user =
        await userRepository.create(
            userData
        );


    // -------------------------------------------------
    // CREATE WALLET
    // -------------------------------------------------

    await walletService.getWallet(
        user._id
    );


    // =================================================
    // GUEST ORDER RECOVERY
    // =================================================

    let recoveredGuestOrders = {

        claimedCount:
            0,

        totalPurchaseAmount:
            0,

        sellingPoints:
            Number(
                user.sellingPoints || 0
            ),

        pendingPurchaseAmount:
            Number(
                user.pendingPurchaseAmount || 0
            ),

        lifetimePurchase:
            Number(
                user.lifetimePurchase || 0
            ),

        qualifyingPurchaseAmount:
            Number(
                user.qualifyingPurchaseAmount || 0
            ),

        membershipStatus:
            user.membershipStatus ||
            "Pending",

        membershipActivated:
            false,
    };


    try {

        if (
            orderService &&
            typeof
                orderService.claimGuestOrdersForMember ===
            "function"
        ) {

            recoveredGuestOrders =
                await orderService.claimGuestOrdersForMember(
                    user._id,
                    cleanMobile
                );

        } else {

            console.warn(
                "Guest order recovery function is not available."
            );
        }

    } catch (guestClaimError) {

        console.error(
            "GUEST ORDER RECOVERY ERROR:",
            guestClaimError
        );
    }


    // -------------------------------------------------
    // GET FINAL USER
    // -------------------------------------------------

    user =
        await User.findById(
            user._id
        );

    if (!user) {
        throw new ApiError(
            500,
            "User account could not be loaded after registration"
        );
    }


    // -------------------------------------------------
    // TOKEN
    // -------------------------------------------------

    const token =
        generateToken(
            user
        );


    // -------------------------------------------------
    // REMOVE PASSWORD
    // -------------------------------------------------

    user.password =
        undefined;


    // -------------------------------------------------
    // MESSAGE
    // -------------------------------------------------

    let responseMessage =
        "Registration successful. Your membership is currently Pending. Complete the ₹2,000 membership qualification to activate it.";


    if (
        recoveredGuestOrders &&
        Number(
            recoveredGuestOrders.claimedCount || 0
        ) > 0
    ) {

        if (
            recoveredGuestOrders.membershipActivated
        ) {

            responseMessage =
                "Registration successful. Your previous guest orders have been linked to your account and your membership is now Active.";

        } else {

            responseMessage =
                "Registration successful. Your previous guest orders have been linked to your account.";
        }
    }


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return {

        success:
            true,

        message:
            responseMessage,

        token,

        user,

        guestOrderRecovery: {

            claimedCount:
                Number(
                    recoveredGuestOrders
                        ?.claimedCount || 0
                ),

            totalPurchaseAmount:
                Number(
                    recoveredGuestOrders
                        ?.totalPurchaseAmount || 0
                ),

            sellingPoints:
                Number(
                    recoveredGuestOrders
                        ?.sellingPoints ||
                    user.sellingPoints ||
                    0
                ),

            pendingPurchaseAmount:
                Number(
                    recoveredGuestOrders
                        ?.pendingPurchaseAmount ||
                    user.pendingPurchaseAmount ||
                    0
                ),

            lifetimePurchase:
                Number(
                    recoveredGuestOrders
                        ?.lifetimePurchase ||
                    user.lifetimePurchase ||
                    0
                ),

            qualifyingPurchaseAmount:
                Number(
                    recoveredGuestOrders
                        ?.qualifyingPurchaseAmount ||
                    user.qualifyingPurchaseAmount ||
                    0
                ),

            membershipStatus:
                recoveredGuestOrders
                    ?.membershipStatus ||
                user.membershipStatus ||
                "Pending",

            membershipActivated:
                Boolean(
                    recoveredGuestOrders
                        ?.membershipActivated ||
                    String(
                        user.membershipStatus ||
                        ""
                    )
                        .trim()
                        .toUpperCase() ===
                    "ACTIVE"
                ),
        },
    };
};


// =====================================================
// LOGIN
// =====================================================

// =====================================================
// COMMON LOGIN
// USER + PACKAGING STAFF
// =====================================================
// =====================================================
// LOGIN
// COMMON LOGIN
// USER + PACKAGING STAFF
// =====================================================

const login = async ({
    identifier,
    email,
    password,
}) => {

    // =================================================
    // VALIDATION
    // =================================================

    const loginIdentifier =
        String(
            identifier ||
            email ||
            ""
        ).trim();

    if (!loginIdentifier) {
        throw new ApiError(
            400,
            "Email or Login ID is required"
        );
    }

    if (!password) {
        throw new ApiError(
            400,
            "Password is required"
        );
    }


    // =================================================
    // 1. CHECK NORMAL USER BY EMAIL
    // =================================================

    const cleanEmail =
        loginIdentifier.toLowerCase();

    const user =
        await userRepository.findByEmail(
            cleanEmail
        );


    // =================================================
    // NORMAL USER FOUND
    // =================================================

    if (user) {

        if (!user.isActive) {
            throw new ApiError(
                403,
                "Your account is inactive"
            );
        }


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


        // ---------------------------------------------
        // UPDATE LAST LOGIN
        // ---------------------------------------------

        await userRepository.updateById(
            user._id,
            {
                lastLogin:
                    new Date(),
            }
        );


        // ---------------------------------------------
        // GUEST ORDER RECOVERY
        // ---------------------------------------------

        try {

            if (
                orderService &&
                typeof
                    orderService
                        .claimGuestOrdersForMember ===
                    "function"
            ) {

                await orderService
                    .claimGuestOrdersForMember(
                        user._id,
                        String(
                            user.mobile || ""
                        ).replace(
                            /\D/g,
                            ""
                        )
                    );

            } else {

                console.warn(
                    "Guest order recovery function is not available during login."
                );
            }

        } catch (
            guestClaimError
        ) {

            console.error(
                "GUEST ORDER RECOVERY ERROR DURING LOGIN:",
                guestClaimError
            );
        }


        // ---------------------------------------------
        // GET UPDATED USER
        // ---------------------------------------------

        const updatedUser =
            await User.findById(
                user._id
            );


        if (!updatedUser) {

            throw new ApiError(
                500,
                "User account could not be loaded after login"
            );
        }


        // ---------------------------------------------
        // GENERATE NORMAL USER TOKEN
        // ---------------------------------------------

        const token =
            generateToken(
                updatedUser
            );


        // ---------------------------------------------
        // REMOVE SENSITIVE DATA
        // ---------------------------------------------

        updatedUser.password =
            undefined;

        updatedUser.otp =
            undefined;

        updatedUser.otpExpires =
            undefined;

        updatedUser.otpPurpose =
            undefined;


        return {

            success: true,

            message:
                "Login successful",

            token,

            user:
                updatedUser,
        };
    }


    // =================================================
    // 2. USER NOT FOUND
    //    CHECK PACKAGING STAFF
    // =================================================

    const cleanLoginId =
        loginIdentifier.toUpperCase();


    const packagingStaff =
        await PackagingStaff
            .findOne({
                loginId:
                    cleanLoginId,
            })
            .select("+password");


    // =================================================
    // PACKAGING STAFF FOUND
    // =================================================

    if (packagingStaff) {

        if (!packagingStaff.isActive) {

            throw new ApiError(
                403,
                "Packaging account is inactive"
            );
        }


        // ---------------------------------------------
        // CHECK PASSWORD
        // ---------------------------------------------

        const isMatch =
            await packagingStaff
                .comparePassword(
                    password
                );


        if (!isMatch) {

            throw new ApiError(
                401,
                "Invalid credentials"
            );
        }


        // ---------------------------------------------
        // UPDATE LAST LOGIN
        // ---------------------------------------------

        packagingStaff.lastLoginAt =
            new Date();

        await packagingStaff.save();


        // ---------------------------------------------
        // GENERATE PACKAGING TOKEN
        // ---------------------------------------------

        const token =
            generateToken({

                _id:
                    packagingStaff._id,

                id:
                    packagingStaff._id,

                role:
                    "PACKAGING",

                userId:
                    packagingStaff.loginId,

                packagingStaffId:
                    packagingStaff._id,

                loginId:
                    packagingStaff.loginId,
            });


        // ---------------------------------------------
        // PACKAGING USER RESPONSE
        // ---------------------------------------------

        return {

            success: true,

            message:
                "Login successful",

            token,

user: {
    id: packagingStaff._id,
    _id: packagingStaff._id,

    packagingStaffId: packagingStaff._id,

    loginId: packagingStaff.loginId,

    name: packagingStaff.name,

    role: "PACKAGING",

    branchId: packagingStaff.branchId,

    branchName: packagingStaff.branchName,

    branchMemberNumber:
        packagingStaff.branchMemberNumber,

    isActive:
        packagingStaff.isActive,

    createdAt:
        packagingStaff.createdAt,

    lastLoginAt:
        packagingStaff.lastLoginAt,
},
        };
    }


    // =================================================
    // 3. NOTHING FOUND
    // =================================================

    throw new ApiError(
        401,
        "Invalid credentials"
    );
};


// =====================================================
// VERIFY LOGIN OTP
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


    if (
        user.otp !== otp
    ) {
        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }


    if (
        user.otpPurpose !==
        "LOGIN"
    ) {
        throw new ApiError(
            400,
            "Invalid OTP purpose"
        );
    }


    if (
        !user.otpExpires ||
        user.otpExpires < new Date()
    ) {
        throw new ApiError(
            400,
            "OTP expired"
        );
    }


    await userRepository.clearOtp(
        cleanEmail
    );


    await userRepository.updateById(
        user._id,
        {
            lastLogin:
                new Date(),
        }
    );


    const token =
        generateToken(
            user
        );


    user.password =
        undefined;

    user.otp =
        undefined;

    user.otpExpires =
        undefined;

    user.otpPurpose =
        undefined;


    return {

        success:
            true,

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
// EMAIL FORGOT PASSWORD
// =====================================================

const forgotPassword = async ({
    email,
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


    if (!user.isActive) {
        throw new ApiError(
            403,
            "Account is inactive"
        );
    }


    const otp =
        generateOTP();


    await userRepository.updateOtp(
        cleanEmail,
        otp,
        new Date(
            Date.now() +
            5 * 60 * 1000
        ),
        "FORGOT_PASSWORD"
    );


    await sendEmail(
        cleanEmail,
        "Bhagyamma Hub Password Reset OTP",
        "<h2>Bhagyamma Hub</h2>" +
        "<p>Hello <b>" + user.name + "</b>,</p>" +
        "<p>Your Password Reset OTP is:</p>" +
        "<h1>" + otp + "</h1>" +
        "<p>This OTP is valid for 5 minutes.</p>"
    );


    return {

        success:
            true,

        message:
            "OTP sent successfully",
    };
};

// =====================================================
// SEND MOBILE OTP
// DEVELOPMENT MODE
// =====================================================

const sendMobileResetOtp = async ({
    mobile,
}) => {

    const cleanMobile =
        String(mobile || "")
            .replace(/\D/g, "");


    if (
        !/^[6-9]\d{9}$/.test(
            cleanMobile
        )
    ) {
        throw new ApiError(
            400,
            "Please enter a valid 10-digit Indian mobile number"
        );
    }


    const user =
        await userRepository.findByMobileWithOtp(
            cleanMobile
        );

    if (!user) {
        throw new ApiError(
            404,
            "No account found with this mobile number"
        );
    }


    if (!user.isActive) {
        throw new ApiError(
            403,
            "Account is inactive"
        );
    }


    const otp =
        generateOTP();


    const otpExpires =
        new Date(
            Date.now() +
            5 * 60 * 1000
        );


    // -------------------------------------------------
    // CLEAR ANY OLD RESET TOKEN
    // -------------------------------------------------

    await userRepository.updateById(
        user._id,
        {
            passwordResetToken:
                undefined,

            passwordResetExpires:
                undefined,
        }
    );


    // -------------------------------------------------
    // SAVE OTP
    // -------------------------------------------------

    await userRepository.updateOtp(
        cleanMobile,
        otp,
        otpExpires,
        "FORGOT_PASSWORD"
    );


    // -------------------------------------------------
    // DEVELOPMENT TERMINAL LOG
    // -------------------------------------------------

    console.log(
        "=============================================="
    );

    console.log(
        "PASSWORD RESET OTP"
    );

    console.log(
        "User:",
        user.name
    );

    console.log(
        "Mobile:",
        cleanMobile
    );

    console.log(
        "OTP:",
        otp
    );

    console.log(
        "Expires:",
        otpExpires
    );

    console.log(
        "=============================================="
    );


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return {

        success:
            true,

        message:
            "OTP generated successfully.",

        mobile:
            cleanMobile,

        // ---------------------------------------------
        // DEVELOPMENT ONLY
        // This allows ForgotPassword.jsx to show
        // the OTP inside the MUI Dialog.
        // ---------------------------------------------
        ...(process.env.NODE_ENV !== "production"
            ? {
                developmentOtp:
                    otp,
            }
            : {}),
    };
};


// =====================================================
// VERIFY MOBILE RESET OTP
// DEVELOPMENT MODE
// =====================================================

const verifyResetOtp = async ({
    mobile,
    otp,
}) => {

    const cleanMobile =
        String(mobile || "")
            .replace(/\D/g, "");

    const cleanOtp =
        String(otp || "")
            .trim();


    if (
        !/^[6-9]\d{9}$/.test(
            cleanMobile
        )
    ) {
        throw new ApiError(
            400,
            "Please enter a valid mobile number"
        );
    }


    if (
        !/^\d{4,6}$/.test(
            cleanOtp
        )
    ) {
        throw new ApiError(
            400,
            "Please enter a valid OTP"
        );
    }


    const user =
        await userRepository.findByMobileWithOtp(
            cleanMobile
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    if (
        String(user.otp || "") !==
        cleanOtp
    ) {
        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }


    if (
        user.otpPurpose !==
        "FORGOT_PASSWORD"
    ) {
        throw new ApiError(
            400,
            "Invalid OTP purpose"
        );
    }


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
    // GENERATE TEMPORARY RESET TOKEN
    // -------------------------------------------------

    const resetToken =
        crypto
            .randomBytes(32)
            .toString("hex");


    const resetTokenExpires =
        new Date(
            Date.now() +
            10 * 60 * 1000
        );


    // -------------------------------------------------
    // SAVE RESET TOKEN
    // -------------------------------------------------

    await userRepository.updateById(
        user._id,
        {
            passwordResetToken:
                resetToken,

            passwordResetExpires:
                resetTokenExpires,

            otp:
                undefined,

            otpExpires:
                undefined,

            otpPurpose:
                undefined,
        }
    );


    // -------------------------------------------------
    // IMPORTANT
    // -------------------------------------------------
    // NO JWT IS GENERATED HERE.
    //
    // This token is ONLY for password reset.
    // It cannot be used as a login token.
    // -------------------------------------------------

    return {

        success:
            true,

        message:
            "OTP verified successfully",

        mobile:
            cleanMobile,

        resetToken,

        expiresIn:
            10 * 60,

        verified:
            true,
    };
};


// =====================================================
// RESET PASSWORD
// MOBILE + RESET TOKEN
// =====================================================

const resetPassword = async ({
    mobile,
    resetToken,
    password,
    confirmPassword,
}) => {

    const cleanMobile =
        String(mobile || "")
            .replace(/\D/g, "");

    const cleanResetToken =
        String(resetToken || "")
            .trim();


    // -------------------------------------------------
    // MOBILE VALIDATION
    // -------------------------------------------------

    if (
        !/^[6-9]\d{9}$/.test(
            cleanMobile
        )
    ) {
        throw new ApiError(
            400,
            "Please enter a valid 10-digit Indian mobile number"
        );
    }


    // -------------------------------------------------
    // RESET TOKEN
    // -------------------------------------------------

    if (!cleanResetToken) {
        throw new ApiError(
            400,
            "Password reset authorization is required"
        );
    }


    // -------------------------------------------------
    // PASSWORD
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
        !/[!@#$%^&*(),.?":{}|<>]/.test(
            password
        )
    ) {
        throw new ApiError(
            400,
            "Password must contain at least one special character"
        );
    }


    // -------------------------------------------------
    // CONFIRM PASSWORD
    // -------------------------------------------------

    if (
        password !==
        confirmPassword
    ) {
        throw new ApiError(
            400,
            "Passwords do not match"
        );
    }


    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
        await User.findOne({
            mobile:
                cleanMobile,

        })
            .select(
                "+passwordResetToken +passwordResetExpires"
            );


    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }


    // -------------------------------------------------
    // VERIFY RESET TOKEN
    // -------------------------------------------------

    if (
        !user.passwordResetToken ||
        user.passwordResetToken !==
        cleanResetToken
    ) {
        throw new ApiError(
            400,
            "Invalid password reset authorization"
        );
    }


    // -------------------------------------------------
    // CHECK RESET TOKEN EXPIRY
    // -------------------------------------------------

    if (
        !user.passwordResetExpires ||
        user.passwordResetExpires < new Date()
    ) {
        throw new ApiError(
            400,
            "Password reset authorization has expired. Please request a new OTP."
        );
    }


    // -------------------------------------------------
    // HASH NEW PASSWORD
    // -------------------------------------------------

// -------------------------------------------------
// UPDATE PASSWORD
// -------------------------------------------------
// Do NOT hash here.
// user.model.js automatically hashes the password
// before saving.

user.password =
    password;

user.passwordChangedAt =
    new Date();
    // -------------------------------------------------
    // CLEAR RESET AUTHORIZATION
    // -------------------------------------------------

    user.passwordResetToken =
        undefined;

    user.passwordResetExpires =
        undefined;

    user.otp =
        undefined;

    user.otpExpires =
        undefined;

    user.otpPurpose =
        undefined;


    await user.save();


    return {

        success:
            true,

        message:
            "Password updated successfully. Please login with your new password.",
    };
};


// =====================================================
// RESEND LOGIN OTP
// =====================================================

const resendOtp = async ({
    email,
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


    if (!user.isActive) {
        throw new ApiError(
            403,
            "Account is inactive"
        );
    }


    const otp =
        generateOTP();


    await userRepository.updateOtp(
        cleanEmail,
        otp,
        new Date(
            Date.now() +
            5 * 60 * 1000
        ),
        "LOGIN"
    );


    await sendEmail(
        cleanEmail,
        "Bhagyamma Hub OTP",
        "<h2>Bhagyamma Hub</h2>" +
        "<p>Your OTP is:</p>" +
        "<h1>" + otp + "</h1>" +
        "<p>This OTP is valid for 5 minutes.</p>"
    );


    return {

        success:
            true,

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

    sendMobileResetOtp,

    verifyResetOtp,

    resetPassword,

    resendOtp,
};