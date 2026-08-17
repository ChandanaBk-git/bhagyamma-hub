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
// ACTIVATE / SYNC PAID MEMBERSHIP
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

  if (
    String(user.paymentStatus || "").toLowerCase() !==
    "paid"
  ) {
    return user;
  }

  // ===================================================
  // MEMBERSHIP
  // ===================================================

  user.membershipStatus =
    "Active";

  user.membershipActivationMethod =
    "WelcomeKit";

  if (!user.membershipActivatedAt) {
    user.membershipActivatedAt =
      user.paymentDate || new Date();
  }

  // ===================================================
  // CHECK WHETHER HISTORY ALREADY EXISTS
  // ===================================================

  const membershipTransaction =
    await repository.findMembershipTransaction(
      user._id
    );

  // ===================================================
  // GIVE 40 SP ONLY IF NOT ALREADY AWARDED
  // ===================================================

  if (!user.membershipSPAwarded) {
    user.sellingPoints =
      (user.sellingPoints || 0) +
      MEMBERSHIP_SP;

    user.membershipSPAwarded =
      true;
  }

  // ===================================================
  // IMPORTANT:
  // CREATE HISTORY EVEN IF SP WAS ALREADY AWARDED
  // ===================================================

  if (!membershipTransaction) {
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
// ₹100 = 2 SP
//
// Example:
// ₹2,000 purchase = 40 SP
// ₹500 purchase = 10 SP
//
// Pending amounts below ₹100 are carried forward.
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

  const amount =
    Number(orderAmount) || 0;

  if (amount <= 0) {
    throw new Error(
      "Invalid order amount"
    );
  }

  // ===================================================
  // FIRST CHECK PAID MEMBERSHIP
  // ===================================================

  if (
    String(user.paymentStatus || "").toLowerCase() ===
      "paid" &&
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

    // Check whether membership history already exists
    const membershipTransaction =
      await repository.findMembershipTransaction(
        user._id
      );

    if (!membershipTransaction) {
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
  }

  // ===================================================
  // LIFETIME PRODUCT PURCHASE
  // ===================================================

  user.lifetimePurchase =
    (user.lifetimePurchase || 0) +
    amount;

  // ===================================================
  // PRODUCT SP CALCULATION
  // ===================================================

  const previousPending =
    Number(
      user.pendingPurchaseAmount || 0
    );

  const totalPurchase =
    previousPending +
    amount;

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

  if (
    user.paymentStatus !== "Paid" &&
    user.membershipStatus !== "Active" &&
    user.lifetimePurchase >=
      MEMBERSHIP_AMOUNT
  ) {
    user.membershipStatus =
      "Active";

    user.membershipActivationMethod =
      "ProductPurchase";

    user.membershipActivatedAt =
      new Date();

    // The ₹2,000 purchase has already generated
    // its 40 SP through the normal calculation.

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
  // SAVE USER
  // ===================================================

  await user.save();

  // ===================================================
  // PRODUCT PURCHASE TRANSACTION
  // ===================================================

  await repository.createTransaction({
    user: user._id,

    order: orderId,

    purchaseAmount:
      amount,

    pointsEarned:
      earnedPoints,

    pendingAmount:
      pendingAmount,

    lifetimePurchase:
      user.lifetimePurchase,

    transactionType:
      "ORDER_PURCHASE",

    remarks:
      earnedPoints > 0
        ? `${earnedPoints} Selling Points Earned`
        : "Purchase recorded. Selling Points pending.",
  });

  return user;
};

// =====================================================
// GET SELLING POINTS
// =====================================================

const getPoints = async (userId) => {
  // ===================================================
  // IMPORTANT
  // ===================================================
  //
  // This automatically repairs existing paid users:
  //
  // paymentStatus = Paid
  // membershipSPAwarded = true
  // history missing
  //
  // It will create the missing history WITHOUT
  // adding another 40 SP.
  // ===================================================

  const user =
    await syncPaidMembership(userId);

  const transactions =
    await repository.getTransactions(
      userId
    );

  const sellingPoints =
    user.sellingPoints || 0;

  return {
    sellingPoints,

    lifetimePurchase:
      user.lifetimePurchase || 0,

    pendingPurchaseAmount:
      user.pendingPurchaseAmount || 0,

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

    isSupervisor:
      user.isSupervisor ||
      false,

    discount50Available:
      user.discount50Available ||
      false,

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