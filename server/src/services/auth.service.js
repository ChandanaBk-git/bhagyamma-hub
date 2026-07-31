const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const generateOTP = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

const userRepository = require("../repositories/user.repository");
const { generateToken } = require("../utils/jwt");
const crypto = require("crypto");
const walletService = require("./wallet.service");

const generateUserId = async () => {
    const count = await User.countDocuments();

    return `BH${String(count + 1).padStart(6, "0")}`;
};

const generateReferralCode = async () => {
    let code;
    let exists;

    do {
        code = crypto.randomBytes(4).toString("hex").toUpperCase();
        exists = await userRepository.findByReferralCode(code);
    } while (exists);

    return code;
};

const register = async (payload) => {
    const {
        name,
        email,
        mobile,
        password,
        referralCode,
    } = payload;

    // Check if email already exists (only if email is provided)
    if (email) {
        const emailExists = await userRepository.findByEmail(email);

        if (emailExists) {
            throw new ApiError(409, "Email already registered");
        }
    }

    // Check if mobile already exists
    const mobileExists = await userRepository.findByMobile(mobile);

    if (mobileExists) {
        throw new ApiError(409, "Mobile number already registered");
    }

    // Validate referral code
    let sponsorId = null;

    if (referralCode) {
        const sponsor = await userRepository.findByReferralCode(referralCode);

        if (!sponsor) {
            throw new ApiError(400, "Invalid referral code");
        }

        sponsorId = sponsor._id;
    }

    // Generate User ID & Referral Code
    const userId = await generateUserId();
    const newReferralCode = await generateReferralCode();

    // Prepare user data
    const userData = {
        userId,
        name,
        mobile,
        password,
        sponsorId,
        referralCode: newReferralCode,
    };

    // Save email only if provided
    if (email && email.trim() !== "") {
        userData.email = email.trim().toLowerCase();
    }

    // Create user
    const user = await userRepository.create(userData);

    // Create wallet
    await walletService.createWallet(user._id);

    // Generate JWT
    const token = generateToken(user);

    // Remove sensitive data
    user.password = undefined;

    return {
        success: true,
        message: "Registration successful",
        token,
        user,
    };
};
const login = async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isActive) {
        throw new ApiError(403, "Your account is inactive");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Update last login
    await userRepository.updateById(user._id, {
        lastLogin: new Date(),
    });

    // Generate JWT
    const token = generateToken(user);

    // Remove sensitive fields
    user.password = undefined;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;

    return {
        success: true,
        message: "Login successful",
        token,
        user,
    };
};
const verifyOtp = async ({ email, otp }) => {

const user = await userRepository.findByEmailWithOtp(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.otpPurpose !== "LOGIN") {
    throw new ApiError(400, "Invalid OTP purpose");
}
if (!user.otpExpires || user.otpExpires < new Date()) {
    throw new ApiError(400, "OTP expired");
}
await userRepository.clearOtp(email);

await userRepository.updateById(user._id, {
    lastLogin: new Date(),
});

const token = generateToken(user);

user.password = undefined;
user.otp = undefined;
user.otpExpires = undefined;
user.otpPurpose = undefined;

    return {
        token,
        user,
    };
};
const getProfile = async (userId) => {

    const user = await userRepository.findById(userId);

    if (!user)
        throw new ApiError(404, "User not found");

    return user;
};
const forgotPassword = async ({ email }) => {
    const user = await userRepository.findByEmailWithOtp(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.isActive) {
    throw new ApiError(403, "Account is inactive");
}

    const otp = generateOTP();

    await userRepository.updateOtp(
        email,
        otp,
        new Date(Date.now() + 5 * 60 * 1000),
        "FORGOT_PASSWORD"
    );

    await sendEmail(
        email,
        "Bhagyamma Hub Password Reset OTP",
        `
        <h2>Bhagyamma Hub</h2>

        <p>Hello <b>${user.name}</b>,</p>

        <p>Your Password Reset OTP is</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 5 minutes.</p>
        `
    );

    return {
        message: "OTP sent successfully",
    };
};

const resetPassword = async ({
    email,
    otp,
    password,
}) => {

    const user = await userRepository.findByEmailWithOtp(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (user.otpPurpose !== "FORGOT_PASSWORD") {
    throw new ApiError(400, "Invalid OTP purpose");
}
    if (!user.otpExpires || user.otpExpires < new Date()) {
        throw new ApiError(400, "OTP expired");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRepository.updatePassword(
        email,
        hashedPassword
    );

    return {
        message: "Password updated successfully",
    };
};
const resendOtp = async ({ email }) => {

    const user = await userRepository.findByEmailWithOtp(email);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otp = generateOTP();

    await userRepository.updateOtp(
        email,
        otp,
        new Date(Date.now() + 5 * 60 * 1000),
        "LOGIN"
    );

    await sendEmail(
        email,
        "Bhagyamma Hub OTP",
        `
        <h2>Your OTP</h2>

        <h1>${otp}</h1>

        <p>Valid for 5 minutes.</p>
        `
    );

    return {
        message: "OTP resent successfully",
    };
};
module.exports = {
    register,
    login,
    getProfile,
    verifyOtp,
    forgotPassword,
resetPassword,
resendOtp,
};