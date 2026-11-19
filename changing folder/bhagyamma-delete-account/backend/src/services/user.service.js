const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");
const walletService = require("./wallet.service");
const commissionRepository = require("../repositories/commission.repository");
const sellingPointService = require("./sellingPoint.service");
const orderRepository = require("../repositories/order.repository");
const referralRepository = require("../repositories/referral.repository");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const PhonePeCheckoutSession = require("../models/phonePeCheckoutSession.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (query) => {
    return await userRepository.getAll(query);
};

// =====================================================
// GET USER BY MONGODB ID
// =====================================================

const getUserById = async (id) => {
    const user = await userRepository.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

// =====================================================
// UPDATE USER - ADMIN
// =====================================================

const updateUser = async (id, data) => {
    const user = await userRepository.updateById(id, data);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

// =====================================================
// UPDATE MY PROFILE - LOGGED IN USER
// =====================================================

const updateMyProfile = async (id, data) => {

    /*
     * IMPORTANT
     *
     * Only profile-related fields are allowed here.
     *
     * We intentionally DO NOT allow users to modify:
     *
     * - userId
     * - role
     * - sponsorId
     * - managerId
     * - walletBalance
     * - spBalance
     * - isActive
     * - isKycVerified
     * - kycStatus
     * - kycVerifiedOn
     * - paymentStatus
     * - welcomeKitStatus
     * - sellingPoints
     * - lifetimePurchase
     * - discount50Available
     */

    const allowedFields = {};

    // =================================================
    // PERSONAL INFORMATION
    // =================================================

    if (data.name !== undefined) {
        allowedFields.name = String(data.name).trim();
    }

    if (data.mobile !== undefined) {
        allowedFields.mobile = String(data.mobile).trim();
    }

    if (data.gender !== undefined) {
        allowedFields.gender = data.gender;
    }

    if (data.dateOfBirth !== undefined) {
        allowedFields.dateOfBirth = data.dateOfBirth;
    }

    // =================================================
    // ADDRESS INFORMATION
    // =================================================

    if (data.address !== undefined) {
        allowedFields.address = String(data.address).trim();
    }

    if (data.city !== undefined) {
        allowedFields.city = String(data.city).trim();
    }

    if (data.state !== undefined) {
        allowedFields.state = String(data.state).trim();
    }

    if (data.pincode !== undefined) {
        allowedFields.pincode = String(data.pincode).trim();
    }

    if (data.country !== undefined) {
        allowedFields.country = String(data.country).trim();
    }

    // =================================================
    // BANK INFORMATION
    // =================================================

    if (data.bankName !== undefined) {
        allowedFields.bankName = String(data.bankName).trim();
    }

    if (data.accountHolderName !== undefined) {
        allowedFields.accountHolderName =
            String(data.accountHolderName).trim();
    }

    if (data.accountNumber !== undefined) {
        allowedFields.accountNumber =
            String(data.accountNumber).trim();
    }

    if (data.ifscCode !== undefined) {
        allowedFields.ifscCode =
            String(data.ifscCode).trim().toUpperCase();
    }

    if (data.branch !== undefined) {
        allowedFields.branch =
            String(data.branch).trim();
    }

    // =================================================
    // KYC DOCUMENT INFORMATION
    // =================================================

    if (data.aadhaarNumber !== undefined) {
        allowedFields.aadhaarNumber =
            String(data.aadhaarNumber).trim();
    }

    if (data.panNumber !== undefined) {
        allowedFields.panNumber =
            String(data.panNumber).trim().toUpperCase();
    }

    // =================================================
    // NOTHING TO UPDATE
    // =================================================

    if (Object.keys(allowedFields).length === 0) {
        return await getUserById(id);
    }

    // =================================================
    // UPDATE DATABASE
    // =================================================

    const updatedUser = await userRepository.updateById(
        id,
        allowedFields
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return updatedUser;
};

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (id) => {

    const user = await userRepository.softDelete(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

// =====================================================
// MEMBER SELF-SERVICE ACCOUNT DELETION
// =====================================================

const deleteMyMemberAccount = async (userId, currentPassword) => {
    if (!currentPassword || typeof currentPassword !== "string") {
        throw new ApiError(400, "Enter your current password to delete the account");
    }

    // Load the password explicitly because the schema hides it by default.
    const user = await User.findById(userId).select("+password role isActive");

    if (!user || !user.isActive) {
        throw new ApiError(404, "Active account not found");
    }

    // This endpoint is strictly for MEMBER accounts. Supervisors/admins/managers
    // must use their designated account-management process.
    if (user.role !== "MEMBER") {
        throw new ApiError(403, "Only member accounts can be deleted here");
    }

    const passwordMatches = await user.comparePassword(currentPassword);
    if (!passwordMatches) {
        throw new ApiError(401, "Current password is incorrect");
    }

    const deletedAt = new Date();
    const id = String(user._id);
    const replacementPassword = crypto.randomBytes(48).toString("hex");
    const passwordHash = await bcrypt.hash(replacementPassword, 10);

    // Preserve financial, order, commission, referral and SP records for
    // accounting/audit purposes. Remove the member's directly identifying data.
    await User.findByIdAndUpdate(user._id, {
        $set: {
            name: "Deleted Member",
            email: `deleted-${id}@deleted.invalid`,
            mobile: `deleted-${id}`,
            password: passwordHash,
            referralCode: `DELETED-${id}`,
            gender: null,
            dateOfBirth: null,
            address: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            aadhaarNumber: "",
            panNumber: "",
            bankName: "",
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
            branch: "",
            adminNotes: "",
            aadhaarDocument: { fileName: "", filePath: "", uploadedAt: null },
            panDocument: { fileName: "", filePath: "", uploadedAt: null },
            bankPassbookDocument: { fileName: "", filePath: "", uploadedAt: null },
            isActive: false,
            deletedAt,
            passwordChangedAt: deletedAt,
            otp: undefined,
            otpExpires: undefined,
            otpPurpose: undefined,
            passwordResetToken: undefined,
            passwordResetExpires: undefined,
        },
    }, { new: true, runValidators: true });

    // Cart is disposable; completed checkout/order and financial records are not.
    await Cart.deleteOne({ userId: user._id });

    // Stop only unfinished checkouts. Completed payment records are retained.
    await PhonePeCheckoutSession.updateMany(
        { userId: user._id, status: { $in: ["PENDING", "PROCESSING"] } },
        { $set: { status: "EXPIRED", checkoutData: null, registrationData: null } }
    );

    return { deleted: true, deletedAt };
};

// =====================================================
// USER STATISTICS
// =====================================================

const getUserStats = async () => {
    return await userRepository.getStats();
};

// =====================================================
// MY NETWORK
// =====================================================

const getMyNetwork = async (userId) => {

    const currentUser =
        await userRepository.findById(userId);

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    const network =
        await userRepository.buildNetworkTree(userId);

    return {
        currentUser,
        network,
    };
};

// =====================================================
// REFERRAL TREE
// =====================================================

const getReferralTree = async (userId) => {
    return await userRepository.buildNetworkTree(userId);
};

// =====================================================
// DASHBOARD
// =====================================================

const getDashboard = async (userId) => {

    // -------------------------------------------------
    // Member Details
    // -------------------------------------------------

    const member =
        await userRepository.findById(userId);

    if (!member) {
        throw new ApiError(404, "User not found");
    }

    // -------------------------------------------------
    // Wallet
    // -------------------------------------------------

    const wallet =
        await walletService.getWallet(userId);

    // -------------------------------------------------
    // Commission History
    // -------------------------------------------------

    const commissions =
        await commissionRepository.findByUser(userId);

    const totalCommission =
        commissions.reduce(
            (sum, item) =>
                sum + (item.commissionAmount || 0),
            0
        );

    // -------------------------------------------------
    // Selling Points
    // -------------------------------------------------

    const sellingPoints =
        await sellingPointService.getPoints(userId);

    // -------------------------------------------------
    // Orders
    // -------------------------------------------------

    const orders =
        await orderRepository.findByUser(userId);

    // -------------------------------------------------
    // Referrals
    // -------------------------------------------------

    const referrals =
        await referralRepository.findBySponsor(userId);

    // -------------------------------------------------
    // Dashboard Summary
    // -------------------------------------------------

const summary = {

    walletBalance:
        Number(wallet?.balance || 0),

    totalCommission:
        Number(wallet?.totalCommission || 0),
        
        totalWithdrawn:
            wallet?.totalWithdrawn || 0,

        sellingPoints:
            sellingPoints?.sellingPoints || 0,

        lifetimePurchase:
            sellingPoints?.lifetimePurchase || 0,

        currentRank:
            member.isSupervisor
                ? "SUPERVISOR"
                : "MEMBER",


supervisorTarget: 500,

remainingTarget: Math.max(
    500 - Number(sellingPoints?.sellingPoints || 0),
    0
),


        totalOrders:
            orders.length,

        totalReferrals:
            referrals.length,
    };

    return {

        member,

        wallet,

        summary,

        recentCommissions:
            commissions.slice(0, 5),

        recentOrders:
            orders.slice(0, 5),

        sellingPoints,
    };
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    updateMyProfile,
    deleteUser,
    deleteMyMemberAccount,
    getUserStats,
    getMyNetwork,
    getReferralTree,
    getDashboard,
};