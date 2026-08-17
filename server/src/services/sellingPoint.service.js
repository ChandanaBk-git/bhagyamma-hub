const User = require("../models/user.model");

const repository =
  require("../repositories/sellingPoint.repository");

const walletService =
  require("./wallet.service");

// =====================================================
// CONSTANTS
// =====================================================

const MEMBERSHIP_AMOUNT = 2000;

const MEMBERSHIP_SP = 40;

const SP_PER_HUNDRED = 2;

const SUPERVISOR_TARGET = 500;

// =====================================================
// ACTIVATE PAID MEMBERSHIP
// =====================================================
//
// This function checks the EXISTING paymentStatus
// stored in MongoDB.
//
// If paymentStatus === "Paid":
//
//      membershipStatus = Active
//      membershipActivationMethod = WelcomeKit
//      sellingPoints += 40
//
// It gives the 40 SP ONLY ONCE.
//
// =====================================================

const syncPaidMembership = async (userId) => {

  const user =
    await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // ===================================================
  // ONLY PAID USERS
  // ===================================================

  if (user.paymentStatus !== "Paid") {
    return user;
  }

  // ===================================================
  // MEMBERSHIP
  // ===================================================

  user.membershipStatus = "Active";

  user.membershipActivationMethod =
    "WelcomeKit";

  if (!user.membershipActivatedAt) {
    user.membershipActivatedAt =
      user.paymentDate || new Date();
  }

  // ===================================================
  // GIVE 40 SP ONLY ONCE
  // ===================================================

  if (!user.membershipSPAwarded) {

    user.sellingPoints =
      (user.sellingPoints || 0) +
      MEMBERSHIP_SP;

    user.membershipSPAwarded = true;

    await repository.createTransaction({

      user: user._id,

      order: null,

      purchaseAmount:
        MEMBERSHIP_AMOUNT,

      pointsEarned:
        MEMBERSHIP_SP,

      pendingAmount:
        user.pendingPurchaseAmount || 0,

      lifetimePurchase:
        user.lifetimePurchase || 0,

      transactionType:
        "MEMBERSHIP_PAYMENT",

      remarks:
        "₹2,000 membership payment received. 40 Selling Points awarded.",

    });
  }

  await user.save();

  return user;
};

// =====================================================
// UPDATE SELLING POINTS FROM PRODUCT PURCHASE
// =====================================================
//
// PRODUCT PURCHASE RULE:
//
// ₹100 = 2 SP
//
// Product purchases also count toward the ₹2,000
// product-membership qualification.
//
// =====================================================

const updateSellingPoints = async (
  userId,
  orderAmount,
  orderId
) => {

  const user =
    await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // ===================================================
  // FIRST CHECK PAID MEMBERSHIP
  // ===================================================
  //
  // If the person already paid ₹2,000, make sure
  // their 40 SP exists.
  //
  // This is particularly useful for your EXISTING
  // MongoDB users whose paymentStatus is already Paid.
  //
  // ===================================================

  if (
    user.paymentStatus === "Paid" &&
    !user.membershipSPAwarded
  ) {

    user.membershipStatus =
      "Active";

    user.membershipActivationMethod =
      "WelcomeKit";

    user.membershipActivatedAt =
      user.paymentDate ||
      new Date();

    user.sellingPoints =
      (user.sellingPoints || 0) +
      MEMBERSHIP_SP;

    user.membershipSPAwarded =
      true;

    await repository.createTransaction({

      user: user._id,

      order: null,

      purchaseAmount:
        MEMBERSHIP_AMOUNT,

      pointsEarned:
        MEMBERSHIP_SP,

      pendingAmount:
        user.pendingPurchaseAmount || 0,

      lifetimePurchase:
        user.lifetimePurchase || 0,

      transactionType:
        "MEMBERSHIP_PAYMENT",

      remarks:
        "₹2,000 membership payment received. 40 Selling Points awarded.",

    });
  }

  // ===================================================
  // LIFETIME PRODUCT PURCHASE
  // ===================================================

  user.lifetimePurchase =
    (user.lifetimePurchase || 0) +
    orderAmount;

  // ===================================================
  // PRODUCT SP
  //
  // ₹100 = 2 SP
  // ===================================================

  const totalPurchase =
    (user.pendingPurchaseAmount || 0) +
    orderAmount;

  const completedHundreds =
    Math.floor(
      totalPurchase / 100
    );

  const earnedPoints =
    completedHundreds *
    SP_PER_HUNDRED;

  const pendingAmount =
    totalPurchase % 100;

  // ===================================================
  // ADD PRODUCT SP
  // ===================================================

  user.sellingPoints =
    (user.sellingPoints || 0) +
    earnedPoints;

  user.pendingPurchaseAmount =
    pendingAmount;

  // ===================================================
  // PRODUCT PURCHASE MEMBERSHIP QUALIFICATION
  // ===================================================
  //
  // If the person DID NOT pay ₹2,000,
  // cumulative PRODUCT purchases of ₹2,000
  // activate membership.
  //
  // ===================================================

  if (
    user.paymentStatus !== "Paid" &&
    user.membershipStatus !== "Active" &&
    user.lifetimePurchase >= MEMBERSHIP_AMOUNT
  ) {

    user.membershipStatus =
      "Active";

    user.membershipActivationMethod =
      "ProductPurchase";

    user.membershipActivatedAt =
      new Date();

    // =================================================
    // SAFETY
    // =================================================
    //
    // ₹2,000 product purchase already produces
    // exactly 40 SP through the calculation above.
    //
    // Therefore DO NOT add another 40 SP here.
    //
    // =================================================

    user.membershipSPAwarded =
      true;

    await repository.createTransaction({

      user: user._id,

      order: orderId,

      purchaseAmount:
        0,

      pointsEarned:
        0,

      pendingAmount:
        pendingAmount,

      lifetimePurchase:
        user.lifetimePurchase,

      transactionType:
        "MEMBERSHIP_ACTIVATED",

      remarks:
        "Membership activated through ₹2,000 qualifying product purchases.",

    });
  }

  // ===================================================
  // SUPERVISOR PROMOTION
  // ===================================================

  if (
    user.sellingPoints >=
      SUPERVISOR_TARGET &&
    !user.isSupervisor
  ) {

    user.isSupervisor =
      true;

    user.role =
      "SUPERVISOR";

    user.supervisorDate =
      new Date();

    user.discount50Available =
      true;

    // =================================================
    // DIRECT SPONSOR REWARD
    // =================================================

    if (user.sponsorId) {

      const sponsor =
        await User.findById(
          user.sponsorId
        );

      if (sponsor) {

        await walletService.creditWallet(

          sponsor._id,

          1000,

          "Direct Downline Supervisor Reward",

          user._id.toString()

        );
      }
    }

    // =================================================
    // SUPERVISOR TRANSACTION
    // =================================================

    await repository.createTransaction({

      user: user._id,

      order: orderId,

      purchaseAmount:
        0,

      pointsEarned:
        0,

      pendingAmount:
        pendingAmount,

      lifetimePurchase:
        user.lifetimePurchase,

      transactionType:
        "SUPERVISOR",

      remarks:
        "Promoted to Supervisor",

    });
  }

  // ===================================================
  // SAVE
  // ===================================================

  await user.save();

  // ===================================================
  // PRODUCT PURCHASE TRANSACTION
  // ===================================================

  await repository.createTransaction({

    user: user._id,

    order: orderId,

    purchaseAmount:
      orderAmount,

    pointsEarned:
      earnedPoints,

    pendingAmount:
      pendingAmount,

    lifetimePurchase:
      user.lifetimePurchase,

    transactionType:
      "ORDER_PURCHASE",

    remarks:
      "Selling Points Earned",

  });

  return user;
};

// =====================================================
// GET SELLING POINTS
// =====================================================

const getPoints = async (
  userId
) => {

  // ===================================================
  // IMPORTANT
  // ===================================================
  //
  // Before displaying SP, check whether this is an
  // existing user who already has paymentStatus = Paid.
  //
  // This allows your CURRENT MongoDB users to receive
  // their missing 40 SP.
  //
  // ===================================================

  let user =
    await syncPaidMembership(userId);

  const transactions =
    await repository.getTransactions(
      userId
    );

  const sellingPoints =
    user.sellingPoints || 0;

  return {

    // =================================================
    // SELLING POINTS
    // =================================================

    sellingPoints,

    // =================================================
    // PURCHASE INFORMATION
    // =================================================

    lifetimePurchase:
      user.lifetimePurchase || 0,

    pendingPurchaseAmount:
      user.pendingPurchaseAmount || 0,

    // =================================================
    // MEMBERSHIP
    // =================================================

    paymentStatus:
      user.paymentStatus ||
      "Pending",

    membershipStatus:
      user.membershipStatus ||
      "Pending",

    membershipActivationMethod:
      user.membershipActivationMethod ||
      null,

    membershipSPAwarded:
      user.membershipSPAwarded ||
      false,

    // =================================================
    // SUPERVISOR
    // =================================================

    isSupervisor:
      user.isSupervisor ||
      false,

    discount50Available:
      user.discount50Available ||
      false,

    // =================================================
    // TARGET
    // =================================================

    target:
      SUPERVISOR_TARGET,

    remaining:
      Math.max(
        SUPERVISOR_TARGET -
          sellingPoints,
        0
      ),

    progress:
      Math.min(
        (
          sellingPoints /
          SUPERVISOR_TARGET
        ) * 100,
        100
      ),

    // =================================================
    // TRANSACTIONS
    // =================================================

    transactions,

  };
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  updateSellingPoints,

  syncPaidMembership,

  getPoints,

};