const User = require("../models/user.model");

/* ==========================================================================
   FIND METHODS
   ========================================================================== */

/**
 * Find user by MongoDB ObjectId
 */
const findById = (id) => {
  return User.findById(id)
    .populate(
      "sponsorId",
      "userId name referralCode sellingPoints membershipStatus role"
    )
    .populate(
      "managerId",
      "userId name referralCode role"
    )
    .select("-password");
};

/**
 * Find user by custom BH user ID
 */
const findByUserId = (userId) => {
  return User.findOne({
    userId,
  }).select("-password");
};

/**
 * Find user by email
 *
 * Password is explicitly selected because login/password
 * related operations need access to it.
 */
const findByEmail = (email) => {
  return User.findOne({
    email: email?.toLowerCase().trim(),
  }).select("+password");
};

/**
 * Find user by mobile
 */
const findByMobile = (mobile) => {
  return User.findOne({
    mobile: String(mobile).trim(),
  }).select("-password");
};

/**
 * Find active user by referral code
 */
const findByReferralCode = (referralCode) => {
  return User.findOne({
    referralCode: referralCode?.trim().toUpperCase(),
    isActive: true,
  }).select("-password");
};

/**
 * Check whether a user exists
 */
const exists = (filter) => {
  return User.exists(filter);
};


/* ==========================================================================
   CREATE
   ========================================================================== */

/**
 * Create a new user
 */
const create = (data) => {
  return User.create(data);
};


/* ==========================================================================
   UPDATE METHODS
   ========================================================================== */

/**
 * Update user by MongoDB ObjectId
 */
const updateById = (id, data) => {
  return User.findByIdAndUpdate(
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
    .populate(
      "managerId",
      "userId name referralCode role"
    )
    .select("-password");
};

/**
 * Update user by email
 */
const updateByEmail = (email, data) => {
  return User.findOneAndUpdate(
    {
      email: email?.toLowerCase().trim(),
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};

/**
 * Update user by custom BH user ID
 */
const updateByUserId = (userId, data) => {
  return User.findOneAndUpdate(
    {
      userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};


/* ==========================================================================
   SOFT DELETE
   ========================================================================== */

/**
 * Soft delete / deactivate user
 */
const softDelete = (id) => {
  return User.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },
    {
      new: true,
    }
  ).select("-password");
};


/* ==========================================================================
   SELLING POINT METHODS
   ========================================================================== */

/**
 * Add Selling Points to a user
 *
 * IMPORTANT:
 *
 * The project uses:
 *
 *     sellingPoints
 *
 * NOT:
 *
 *     spBalance
 *
 * This method is intentionally kept as an atomic $inc operation.
 *
 * Therefore two simultaneous purchases cannot accidentally
 * overwrite each other's SP balance.
 */
const addSellingPoints = async (userId, points) => {
  if (!userId) {
    throw new Error("User ID is required to add Selling Points");
  }

  const numericPoints = Number(points);

  if (
    !Number.isFinite(numericPoints) ||
    numericPoints <= 0
  ) {
    throw new Error("Selling Points must be greater than zero");
  }

  return await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        sellingPoints: numericPoints,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};


/**
 * Promote member to supervisor
 */
const promoteToSupervisor = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      role: "SUPERVISOR",
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};


/* ==========================================================================
   USER LIST / PAGINATION
   ========================================================================== */

const getAll = ({
  page = 1,
  limit = 10,
  search = "",
  role,
  isActive,
} = {}) => {
  const filter = {};

  /* ------------------------------------------------------------------------
     Search
     ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------
     Role filter
     ------------------------------------------------------------------------ */

  if (role) {
    filter.role = role;
  }

  /* ------------------------------------------------------------------------
     Active filter
     ------------------------------------------------------------------------ */

  if (typeof isActive === "boolean") {
    filter.isActive = isActive;
  }

  return User.find(filter)
    .select("-password")
    .sort({
      createdAt: -1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};


/* ==========================================================================
   COUNT
   ========================================================================== */

const count = (filter = {}) => {
  return User.countDocuments(filter);
};


/* ==========================================================================
   USER STATISTICS
   ========================================================================== */

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


/* ==========================================================================
   OTP METHODS
   ========================================================================== */

/**
 * Find user by email including OTP fields
 */
const findByEmailWithOtp = (email) => {
  return User.findOne({
    email: email?.toLowerCase().trim(),
  }).select(
    "+password +otp +otpExpires +otpPurpose"
  );
};


/**
 * Update OTP
 */
const updateOtp = (
  email,
  otp,
  otpExpires,
  otpPurpose
) => {
  return User.findOneAndUpdate(
    {
      email: email?.toLowerCase().trim(),
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
};


/**
 * Clear OTP
 */
const clearOtp = (email) => {
  return User.findOneAndUpdate(
    {
      email: email?.toLowerCase().trim(),
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
};


/**
 * Update password and clear OTP
 */
const updatePassword = (
  email,
  password
) => {
  return User.findOneAndUpdate(
    {
      email: email?.toLowerCase().trim(),
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
};


/* ==========================================================================
   REFERRAL NETWORK TREE
   ========================================================================== */

/**
 * Recursively build the user's referral network.
 */
const buildNetworkTree = async (parentId) => {
  const members = await User.find({
    sponsorId: parentId,
    isActive: true,
  })
    .select(`
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
    `)
    .sort({
      createdAt: 1,
    })
    .lean();

  for (const member of members) {
    member.children = await buildNetworkTree(
      member._id
    );
  }

  return members;
};


/* ==========================================================================
   EXPORTS
   ========================================================================== */

module.exports = {
  /* Find */
  findById,
  findByUserId,
  findByEmail,
  findByMobile,
  findByReferralCode,
  exists,

  /* Create */
  create,

  /* Update */
  updateById,
  updateByEmail,
  updateByUserId,

  /* Delete */
  softDelete,

  /* Lists / Stats */
  getAll,
  count,
  getStats,

  /* Selling Points */
  addSellingPoints,
  promoteToSupervisor,

  /* OTP */
  findByEmailWithOtp,
  updateOtp,
  clearOtp,
  updatePassword,

  /* Referral Tree */
  buildNetworkTree,
};