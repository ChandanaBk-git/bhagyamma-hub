const adminRepository =
  require("../repositories/admin.repository");

const User =
  require("../models/user.model");

const sellingPointService =
  require("./sellingPoint.service");

// ============================================
// DASHBOARD
// ============================================

const getDashboard = async () => {
  const [
    totalMembers,
    totalProducts,
    totalLayers,
    recentMembers,
  ] = await Promise.all([
    adminRepository.countMembers(),
    adminRepository.countProducts(),
    adminRepository.calculateTotalLayers(),
    adminRepository.recentMembers(),
  ]);

  return {
    totalMembers,
    totalProducts,
    totalLayers,
    recentMembers,
  };
};

// ============================================
// USER MANAGEMENT
// ============================================

const getAllUsers = async () => {
  return await adminRepository.getAllUsers();
};

const getUserById = async (id) => {
  return await adminRepository.getUserById(id);
};

// ============================================
// UPDATE USER
// ============================================
//
// BUSINESS RULES:
//
// 1. Admin changes payment:
//    Pending → Paid
//    → MembershipPayment flow
//    → +40 SP
//    → Active
//    → Joining commission
//
// 2. Admin changes sellingPoints:
//    <40 → 40+
//    → ProductPurchase activation
//    → DO NOT add another 40 SP
//    → Active
//    → Joining commission
//
// IMPORTANT:
// Admin-entered 40 SP must NOT create another 40 SP.
//
// ============================================

const updateUser = async (id, data) => {
  try {
    console.log("======================================");
    console.log("ADMIN UPDATE USER");
    console.log("User ID:", id);
    console.log("Incoming Data:", data);
    console.log("======================================");

    // ------------------------------------------
    // GET CURRENT USER BEFORE UPDATE
    // ------------------------------------------

    const existingUser =
      await User.findById(id);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const previousPaymentStatus =
      String(
        existingUser.paymentStatus || ""
      ).toLowerCase();

    const newPaymentStatus =
      String(
        data.paymentStatus ??
          existingUser.paymentStatus ??
          ""
      ).toLowerCase();

    const previousSellingPoints =
      Number(
        existingUser.sellingPoints || 0
      );

    // ------------------------------------------
    // NORMAL ADMIN UPDATE
    // ------------------------------------------

    const updatedUser =
      await adminRepository.updateUser(
        id,
        data
      );

    if (!updatedUser) {
      throw new Error(
        "User update failed"
      );
    }

    const updatedSellingPoints =
      Number(
        updatedUser.sellingPoints || 0
      );

    console.log(
      "Previous Payment Status:",
      previousPaymentStatus
    );

    console.log(
      "New Payment Status:",
      newPaymentStatus
    );

    console.log(
      "Previous Selling Points:",
      previousSellingPoints
    );

    console.log(
      "Updated Selling Points:",
      updatedSellingPoints
    );

    console.log(
      "Previous Membership Status:",
      existingUser.membershipStatus
    );

    console.log(
      "Current Membership Status:",
      updatedUser.membershipStatus
    );

    console.log(
      "Current Membership SP Awarded:",
      updatedUser.membershipSPAwarded
    );

    // ==========================================================
    // CASE 1
    // ADMIN UPDATED SELLING POINTS TO 40+
    // ==========================================================
    //
    // Example:
    //
    // Old SP = 20
    // New SP = 40
    //
    // OR:
    //
    // Old SP = 0
    // New SP = 40
    //
    // OR:
    //
    // Old SP = 30
    // New SP = 50
    //
    // This means the member has qualified through SP.
    //
    // IMPORTANT:
    //
    // We use ProductPurchase activation.
    //
    // ProductPurchase DOES NOT add another 40 SP.
    //
    // It only activates membership and generates
    // the joining commission.
    //
    // ==========================================================

    const adminUpdatedSellingPoints =
      Object.prototype.hasOwnProperty.call(
        data,
        "sellingPoints"
      );

    const shouldActivateFromSellingPoints =
      updatedUser.role === "MEMBER" &&
      adminUpdatedSellingPoints &&
      updatedSellingPoints >= 40 &&
      String(
        updatedUser.membershipStatus || ""
      ).toLowerCase() !== "active";

    if (
      shouldActivateFromSellingPoints
    ) {
      console.log(
        "======================================"
      );

      console.log(
        "SELLING POINT MEMBERSHIP ACTIVATION"
      );

      console.log(
        "Member:",
        updatedUser.userId
      );

      console.log(
        "Previous SP:",
        previousSellingPoints
      );

      console.log(
        "Current SP:",
        updatedSellingPoints
      );

      console.log(
        "Activation Method:",
        "ProductPurchase"
      );

      console.log(
        "Membership Amount:",
        "₹2,000"
      );

      console.log(
        "Membership SP:",
        "40"
      );

      console.log(
        "IMPORTANT: No additional 40 SP will be added."
      );

      console.log(
        "======================================"
      );

      const membershipResult =
        await sellingPointService.activateMembership(
          id,
          "ProductPurchase"
        );

      console.log(
        "======================================"
      );

      console.log(
        "SELLING POINT MEMBERSHIP ACTIVATED"
      );

      console.log(
        "Member:",
        membershipResult?.user?.userId ||
          membershipResult?.userId ||
          updatedUser.userId
      );

      console.log(
        "Selling Points:",
        membershipResult?.user?.sellingPoints ??
          membershipResult?.sellingPoints ??
          updatedSellingPoints
      );

      console.log(
        "Membership Status:",
        membershipResult?.user?.membershipStatus ??
          membershipResult?.membershipStatus
      );

      console.log(
        "Membership SP Awarded:",
        membershipResult?.user?.membershipSPAwarded ??
          membershipResult?.membershipSPAwarded
      );

      console.log(
        "Commission Created:",
        membershipResult?.commissionCreated
      );

      console.log(
        "======================================"
      );

      const finalUser =
        await User.findById(id);

      return finalUser;
    }

    // ==========================================================
    // CASE 2
    // MEMBERSHIP PAYMENT
    // ==========================================================
    //
    // This is ONLY used when the admin changes:
    //
    // Pending → Paid
    //
    // and sellingPoints was NOT the activation event.
    //
    // MembershipPayment may add 40 SP if it has not already
    // been awarded.
    //
    // ==========================================================

    const paymentJustBecamePaid =
      previousPaymentStatus !== "paid" &&
      newPaymentStatus === "paid";

    const needsMembershipPaymentProcessing =
      newPaymentStatus === "paid" &&
      updatedUser.role === "MEMBER" &&
      String(
        updatedUser.membershipStatus || ""
      ).toLowerCase() !== "active" &&
      updatedUser.membershipSPAwarded !== true;

    if (
      paymentJustBecamePaid ||
      needsMembershipPaymentProcessing
    ) {
      console.log(
        "======================================"
      );

      console.log(
        "PROCESSING MEMBERSHIP PAYMENT"
      );

      console.log(
        "Member:",
        updatedUser.userId
      );

      console.log(
        "Amount: ₹2,000"
      );

      console.log(
        "Expected SP: 40"
      );

      console.log(
        "======================================"
      );

      const membershipResult =
        await sellingPointService.syncPaidMembership(
          id
        );

      console.log(
        "======================================"
      );

      console.log(
        "MEMBERSHIP PAYMENT PROCESSED"
      );

      console.log(
        "Member:",
        membershipResult?.userId ||
          membershipResult?.user?.userId ||
          updatedUser.userId
      );

      console.log(
        "Selling Points:",
        membershipResult?.sellingPoints ??
          membershipResult?.user?.sellingPoints
      );

      console.log(
        "Membership Status:",
        membershipResult?.membershipStatus ??
          membershipResult?.user?.membershipStatus
      );

      console.log(
        "Membership SP Awarded:",
        membershipResult?.membershipSPAwarded ??
          membershipResult?.user?.membershipSPAwarded
      );

      console.log(
        "======================================"
      );

      const finalUser =
        await User.findById(id);

      return finalUser;
    }

    // ==========================================================
    // NORMAL UPDATE
    // ==========================================================

    console.log(
      "No membership activation required."
    );

    return updatedUser;

  } catch (error) {

    console.error(
      "======================================"
    );

    console.error(
      "ADMIN UPDATE USER ERROR"
    );

    console.error(error);

    console.error(
      "======================================"
    );

    throw error;
  }
};

// ============================================
// UPDATE USER STATUS
// ============================================

const updateUserStatus = async (
  id,
  isActive
) => {
  return await adminRepository.updateUserStatus(
    id,
    isActive
  );
};

// ============================================
// UPDATE USER ROLE
// ============================================

const updateUserRole = async (
  id,
  role
) => {
  return await adminRepository.updateUserRole(
    id,
    role
  );
};

// ============================================
// DELETE USER
// ============================================

const deleteUser = async (id) => {
  return await adminRepository.deleteUser(
    id
  );
};

// ============================================
// REFERRAL TREE
// ============================================

const buildTree = (
  users,
  parentId = null
) => {
  return users
    .filter((user) => {

      if (parentId === null) {
        return user.sponsorId === null;
      }

      return (
        user.sponsorId &&
        user.sponsorId.toString() ===
          parentId.toString()
      );
    })
    .map((user) => ({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      referralCode: user.referralCode,
      role: user.role,
      sponsorId: user.sponsorId,
      createdAt: user.createdAt,

      children:
        buildTree(
          users,
          user._id
        ),
    }));
};

const getReferralTree = async () => {

  const users =
    await adminRepository.getAllUsersWithSponsor();

  // Find the Manager
  const manager =
    users.find(
      (user) =>
        user.role === "MANAGER"
    );

  if (!manager) {
    return [];
  }

  return [
    {
      _id: manager._id,
      userId: manager.userId,
      name: manager.name,
      referralCode:
        manager.referralCode,
      role: manager.role,
      sponsorId:
        manager.sponsorId,
      createdAt:
        manager.createdAt,

      children:
        buildTree(
          users,
          manager._id
        ),
    },
  ];
};

// ============================================
// EXPORTS
// ============================================

module.exports = {

  // Dashboard
  getDashboard,

  // User Management
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  updateUserRole,
  deleteUser,

  // Referral Tree
  getReferralTree,
};