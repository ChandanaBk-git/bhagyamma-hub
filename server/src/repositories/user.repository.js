const User = require("../models/user.model");
/* -------------------------------------------------------------------------- */
/*                                Find Methods                                */
/* -------------------------------------------------------------------------- */
// Find by Mongo ID
const findById = (id) =>
    User.findById(id)
        .populate(
            "sponsorId",
            "userId name referralCode sellingPoints membershipStatus role"
        )
        .populate(
            "managerId",
            "userId name referralCode role"
        )
        .select("-password");
// Find by Custom User ID
const findByUserId = (userId) =>
    User.findOne({ userId })
        .select("-password");
// Find by Email
const findByEmail = (email) =>
    User.findOne({
        email: email.toLowerCase().trim(),
    }).select("+password");
// Find by Mobile
const findByMobile = (mobile) =>
    User.findOne({ mobile });
// =====================================================
// FIND USER BY REFERRAL CODE
// =====================================================
// This function only finds the user.
// Referral eligibility such as:
// - Manager exemption
// - 40 SP requirement
// - Membership requirement
// is handled by auth.service.js.
const findByReferralCode = (referralCode) => {
    return User.findOne({
        referralCode: referralCode
            ?.trim()
            .toUpperCase(),
        isActive: true,
    }).select("-password");
};
// Check if document exists
const exists = (filter) =>
    User.exists(filter);
/* -------------------------------------------------------------------------- */
/*                               Create Methods                               */
/* -------------------------------------------------------------------------- */
const create = (data) =>
    User.create(data);
/* -------------------------------------------------------------------------- */
/*                               Update Methods                               */
/* -------------------------------------------------------------------------- */
// Update by Mongo ID
const updateById = (id, data) =>
    User.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate(
            "sponsorId",
            "userId name referralCode sellingPoints membershipStatus role"
        )
        .select("-password");
// Update by Email
const updateByEmail = (email, data) =>
    User.findOneAndUpdate(
        {
            email: email.toLowerCase().trim(),
        },
        data,
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");
// Update by Custom User ID
const updateByUserId = (userId, data) =>
    User.findOneAndUpdate(
        { userId },
        data,
        {
            new: true,
            runValidators: true,
        }
    ).select("-password");
/* -------------------------------------------------------------------------- */
/*                               Delete Methods                               */
/* -------------------------------------------------------------------------- */
// Soft Delete
const softDelete = (id) =>
    User.findByIdAndUpdate(
        id,
        {
            isActive: false,
        },
        {
            new: true,
        }
    ).select("-password");
/* -------------------------------------------------------------------------- */
/*                           SELLING POINT METHODS                            */
/* -------------------------------------------------------------------------- */
// SP = sellingPoints
// DO NOT use spBalance.
const addSellingPoints = async (
    userId,
    points
) => {
    return await User.findByIdAndUpdate(
        userId,
        {
            $inc: {
                sellingPoints: points,
            },
        },
        {
            new: true,
        }
    ).select("-password");
};
const promoteToSupervisor = async (
    userId
) => {
    return await User.findByIdAndUpdate(
        userId,
        {
            role: "SUPERVISOR",
        },
        {
            new: true,
        }
    ).select("-password");
};
/* -------------------------------------------------------------------------- */
/*                              List / Pagination                             */
/* -------------------------------------------------------------------------- */
const getAll = ({
    page = 1,
    limit = 10,
    search = "",
    role,
    isActive,
}) => {
    const filter = {};
    if (search) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                mobile: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                userId: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                referralCode: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }
    if (role) {
        filter.role = role;
    }
    if (typeof isActive === "boolean") {
        filter.isActive = isActive;
    }
    return User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
};
/* -------------------------------------------------------------------------- */
/*                                   Count                                    */
/* -------------------------------------------------------------------------- */
const count = (filter = {}) =>
    User.countDocuments(filter);
const getStats = async () => {
    const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        kycVerified,
        kycPending,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({
            isActive: true,
        }),
        User.countDocuments({
            isActive: false,
        }),
        User.countDocuments({
            isKycVerified: true,
        }),
        User.countDocuments({
            isKycVerified: false,
        }),
    ]);
    return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        kycVerified,
        kycPending,
    };
};
/* -------------------------------------------------------------------------- */
/*                              OTP METHODS                                   */
/* -------------------------------------------------------------------------- */
const findByEmailWithOtp = (email) =>
    User.findOne({
        email: email.toLowerCase().trim(),
    }).select(
        "+password +otp +otpExpires +otpPurpose"
    );
const updateOtp = (
    email,
    otp,
    otpExpires,
    otpPurpose
) =>
    User.findOneAndUpdate(
        {
            email: email.toLowerCase().trim(),
        },
        {
            otp,
            otpExpires,
            otpPurpose,
        },
        {
            new: true,
        }
    );
const clearOtp = (email) =>
    User.findOneAndUpdate(
        {
            email: email.toLowerCase().trim(),
        },
        {
            $unset: {
                otp: "",
                otpExpires: "",
                otpPurpose: "",
            },
        },
        {
            new: true,
        }
    );
const updatePassword = (
    email,
    password
) =>
    User.findOneAndUpdate(
        {
            email: email.toLowerCase().trim(),
        },
        {
            password,
            $unset: {
                otp: "",
                otpExpires: "",
                otpPurpose: "",
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );
/* -------------------------------------------------------------------------- */
/*                        Recursive Network Builder                           */
/* -------------------------------------------------------------------------- */
const buildNetworkTree = async (
    parentId
) => {
    const members = await User.find({
        sponsorId: parentId,
        isActive: true,
    })
        .select(
            `
            userId
            name
            email
            mobile
            referralCode
            role
            sellingPoints
            membershipStatus
            createdAt
            sponsorId
            `
        )
        .sort({
            createdAt: 1,
        })
        .lean();
    for (const member of members) {
        member.children =
            await buildNetworkTree(
                member._id
            );
    }
    return members;
};
/* -------------------------------------------------------------------------- */
/*                                  Exports                                   */
/* -------------------------------------------------------------------------- */
module.exports = {
    findById,
    findByUserId,
    findByEmail,
    findByMobile,
    findByReferralCode,
    findByEmailWithOtp,
    exists,
    create,
    updateById,
    updateByEmail,
    updateByUserId,
    updateOtp,
    clearOtp,
    updatePassword,
    softDelete,
    getAll,
    count,
    getStats,
    addSellingPoints,
    promoteToSupervisor,
    buildNetworkTree,
};