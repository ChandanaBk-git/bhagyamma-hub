const mongoose = require("mongoose");

const User = require("../models/user.model");
const Order = require("../models/order.model");

const sellingPointTransactionRepository =
  require("../repositories/sellingPoint.repository");

const walletService =
  require("./wallet.service");

const commissionService =
  require("./commission.service");

/* ==========================================================================
   BUSINESS RULES
   ========================================================================== */

const SP_PER_BLOCK = 2;
const AMOUNT_PER_BLOCK = 100;

const MEMBERSHIP_AMOUNT = 2000;
const MEMBERSHIP_SP = 40;
const MEMBERSHIP_TARGET_SP = 40;

const SUPERVISOR_TARGET = 500;
const SUPERVISOR_BONUS = 1000;

/* ==========================================================================
   HELPERS
   ========================================================================== */

const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return number;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const isMembershipActive = (user) => {
  return (
    String(user?.membershipStatus || "")
      .trim()
      .toUpperCase() === "ACTIVE"
  );
};

/* ==========================================================================
   CALCULATE SELLING POINTS
   ========================================================================== */

/*
 * IMPORTANT:
 *
 * SP is calculated ONLY from product subtotal.
 *
 * Delivery charge is excluded.
 *
 * Example:
 *
 * subtotal       = ₹489
 * delivery       = ₹50
 * finalAmount    = ₹539
 *
 * SP calculation:
 *
 * ₹489 eligible
 * 4 complete blocks
 * 4 × 2 = 8 SP
 * ₹89 carry forward
 */

const calculateSellingPoints = (
  purchaseAmount,
  previousPendingAmount = 0
) => {
  const purchase = Math.max(
    0,
    toNumber(purchaseAmount)
  );

  const previousPending = Math.max(
    0,
    toNumber(previousPendingAmount)
  );

  const totalAmount =
    purchase + previousPending;

  const completeBlocks = Math.floor(
    totalAmount / AMOUNT_PER_BLOCK
  );

  const pointsEarned =
    completeBlocks * SP_PER_BLOCK;

  const pendingAmount =
    totalAmount % AMOUNT_PER_BLOCK;

  return {
    purchaseAmount: purchase,
    previousPendingAmount: previousPending,
    totalAmount,
    completeBlocks,
    pointsEarned,
    pendingAmount,
  };
};

/* ==========================================================================
   GET USER
   ========================================================================== */

const getUserForSellingPoints = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!isValidObjectId(userId)) {
    throw new Error(`Invalid user ID: ${userId}`);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/* ==========================================================================
   GET ORDER
   ========================================================================== */

const getOrderForSellingPoints = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  if (!isValidObjectId(orderId)) {
    throw new Error(`Invalid order ID: ${orderId}`);
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

/* ==========================================================================
   CHECK ORDER PAID
   ========================================================================== */

const isOrderPaid = (order) => {
  if (!order) {
    return false;
  }

  return (
    String(order.paymentStatus || "")
      .trim()
      .toUpperCase() === "PAID"
  );
};

/* ==========================================================================
   GET SP ELIGIBLE PURCHASE AMOUNT
   ========================================================================== */

/*
 * NEVER include delivery charge here.
 *
 * ₹489 + ₹50 delivery = ₹539 paid
 *
 * SP eligible = ₹489
 */

const getQualifyingPurchaseAmount = (order) => {
  if (!order) {
    return 0;
  }

  const subtotal = toNumber(
    order.subtotal,
    NaN
  );

  if (
    Number.isFinite(subtotal) &&
    subtotal > 0
  ) {
    return subtotal;
  }

  const finalAmount = toNumber(
    order.finalAmount,
    0
  );

  const deliveryCharge = toNumber(
    order.deliveryCharge,
    0
  );

  return Math.max(
    0,
    finalAmount - deliveryCharge
  );
};

/* ==========================================================================
   PROCESS ORDER SELLING POINTS
   ========================================================================== */

const updateSellingPoints = async (
  userId,
  orderAmount,
  orderId
) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!orderId) {
    throw new Error(
      "Order ID is required for product SP processing."
    );
  }

  const amount = Number(orderAmount) || 0;

  if (amount <= 0) {
    throw new Error("Invalid order amount.");
  }

  const user =
    await getUserForSellingPoints(userId);

  const userRole =
    String(user.role || "")
      .trim()
      .toUpperCase();

  /* ------------------------------------------------------------------------
     DUPLICATE CHECK
     ------------------------------------------------------------------------ */

  const existingTransaction =
    await sellingPointTransactionRepository
      .findOrderTransaction(
        user._id,
        orderId
      );

  if (existingTransaction) {
    console.log(
      "SP SKIPPED: ORDER ALREADY PROCESSED",
      orderId.toString()
    );

    return await User.findById(
      user._id
    );
  }

  /* ------------------------------------------------------------------------
     PREVIOUS VALUES
     ------------------------------------------------------------------------ */

  const previousPending =
    Math.max(
      0,
      toNumber(
        user.pendingPurchaseAmount,
        0
      )
    );

  const previousLifetimePurchase =
    Math.max(
      0,
      toNumber(
        user.lifetimePurchase,
        0
      )
    );

  const previousSellingPoints =
    Math.max(
      0,
      toNumber(
        user.sellingPoints,
        0
      )
    );

  /* ------------------------------------------------------------------------
     SP CALCULATION
     ------------------------------------------------------------------------ */

  const calculation =
    calculateSellingPoints(
      amount,
      previousPending
    );

  const {
    pointsEarned,
    pendingAmount,
    totalAmount,
  } = calculation;

  const newLifetimePurchase =
    previousLifetimePurchase +
    amount;

  console.log(
    "======================================"
  );

  console.log(
    "PROCESSING SELLING POINTS"
  );

  console.log(
    "User:",
    user._id.toString()
  );

  console.log(
    "Role:",
    userRole
  );

  console.log(
    "Order:",
    orderId.toString()
  );

  console.log(
    "SP Eligible Purchase:",
    `₹${amount}`
  );

  console.log(
    "Delivery Charge:",
    "EXCLUDED"
  );

  console.log(
    "Previous Carry:",
    `₹${previousPending}`
  );

  console.log(
    "Total SP Calculation:",
    `₹${totalAmount}`
  );

  console.log(
    "SP Earned:",
    pointsEarned
  );

  console.log(
    "New Carry:",
    `₹${pendingAmount}`
  );

  console.log(
    "======================================"
  );

  /* ------------------------------------------------------------------------
     UPDATE USER
     ------------------------------------------------------------------------ */

  const updatedUser =
    await User.findByIdAndUpdate(
      user._id,
      {
        $inc: {
          sellingPoints:
            pointsEarned,

          lifetimePurchase:
            amount,
        },

        $set: {
          pendingPurchaseAmount:
            pendingAmount,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!updatedUser) {
    throw new Error(
      "Failed to update user Selling Points."
    );
  }

  /* ------------------------------------------------------------------------
     CREATE SP TRANSACTION
     ------------------------------------------------------------------------ */

  try {
    await sellingPointTransactionRepository
      .createTransaction({
        user: user._id,

        order: orderId,

        /*
         * This is the PRODUCT amount used for SP.
         *
         * Delivery is not included.
         */

        purchaseAmount: amount,

        previousPendingAmount:
          previousPending,

        totalAmount:
          totalAmount,

        completedBlocks:
          calculation.completeBlocks,

        eligibleAmount:
          calculation.completeBlocks *
          AMOUNT_PER_BLOCK,

        spRate:
          SP_PER_BLOCK,

        amountPerBlock:
          AMOUNT_PER_BLOCK,

        sellingPointsBefore:
          previousSellingPoints,

        pointsEarned:
          pointsEarned,

        sellingPointsAfter:
          Number(
            updatedUser.sellingPoints || 0
          ),

        pendingAmount:
          pendingAmount,

        lifetimePurchase:
          newLifetimePurchase,

        transactionType:
          "ORDER_PURCHASE",

        remarks:
          pointsEarned > 0
            ? `${pointsEarned} Selling Points Earned`
            : "Purchase recorded. Selling Points pending.",
      });
  } catch (error) {
    const duplicate =
      await sellingPointTransactionRepository
        .findOrderTransaction(
          user._id,
          orderId
        );

    if (duplicate) {
      await User.findByIdAndUpdate(
        user._id,
        {
          $inc: {
            sellingPoints:
              -pointsEarned,

            lifetimePurchase:
              -amount,
          },

          $set: {
            pendingPurchaseAmount:
              previousPending,
          },
        }
      );

      return await User.findById(
        user._id
      );
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        $inc: {
          sellingPoints:
            -pointsEarned,

          lifetimePurchase:
            -amount,
        },

        $set: {
          pendingPurchaseAmount:
            previousPending,
        },
      }
    );

    throw error;
  }

  /* ------------------------------------------------------------------------
     UPDATE ORDER SP
     ------------------------------------------------------------------------ */

  await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        sellingPoints:
          pointsEarned,

        sellingPointsProcessed:
          true,

        sellingPointsProcessedAt:
          new Date(),
      },
    },
    {
      new: true,
    }
  );

  /* ------------------------------------------------------------------------
     MEMBERSHIP ACTIVATION
     ------------------------------------------------------------------------ */

  let currentUser =
    await User.findById(
      user._id
    );

  if (
    currentUser &&
    !isMembershipActive(
      currentUser
    ) &&
    Number(
      currentUser.sellingPoints || 0
    ) >= MEMBERSHIP_TARGET_SP
  ) {
    const activation =
      await activateMembership(
        currentUser._id,
        "ProductPurchase",
        {
          orderId,
        }
      );

    currentUser =
      activation.user;
  }

  /* ------------------------------------------------------------------------
     SUPERVISOR PROMOTION
     ------------------------------------------------------------------------ */

  currentUser =
    await applySupervisorPromotion(
      currentUser._id
    );

  return currentUser;
};

/* ==========================================================================
   MEMBERSHIP ACTIVATION
   ========================================================================== */

const activateMembership = async (
  userId,
  method = "ProductPurchase",
  options = {}
) => {
  const user =
    await User.findById(
      userId
    );

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  if (
    isMembershipActive(
      user
    )
  ) {
    return {
      user,
      newlyActivated: false,
      commissionCreated: false,
    };
  }

  if (
    method !==
      "MembershipPayment" &&
    method !==
      "ProductPurchase"
  ) {
    throw new Error(
      "Invalid membership activation method."
    );
  }

  /* ------------------------------------------------------------------------
     MEMBERSHIP PAYMENT
     ------------------------------------------------------------------------ */

  if (
    method ===
    "MembershipPayment"
  ) {
    const existingMembershipTransaction =
      await sellingPointTransactionRepository
        .findMembershipTransaction(
          user._id
        );

    if (
      !user.membershipSPAwarded
    ) {
      user.sellingPoints =
        Number(
          user.sellingPoints || 0
        ) + MEMBERSHIP_SP;

      user.membershipSPAwarded =
        true;
    }

    user.membershipStatus =
      "Active";

    user.membershipActivationMethod =
      "MembershipPayment";

    user.membershipActivatedAt =
      new Date();

    user.paymentStatus =
      "Paid";

    user.paymentDate =
      new Date();

    await user.save();

    /* ----------------------------------------------------------------------
       MEMBERSHIP TRANSACTION
       ---------------------------------------------------------------------- */

    if (
      !existingMembershipTransaction
    ) {
      try {
        await sellingPointTransactionRepository
          .createTransaction({
            user: user._id,

            order:
              options.orderId ||
              null,

            purchaseAmount:
              MEMBERSHIP_AMOUNT,

            pointsEarned:
              MEMBERSHIP_SP,

            pendingAmount:
              Number(
                user.pendingPurchaseAmount ||
                  0
              ),

            lifetimePurchase:
              Number(
                user.lifetimePurchase ||
                  0
              ),

            transactionType:
              "MEMBERSHIP_PAYMENT",

            remarks:
              "₹2,000 membership payment received. 40 Selling Points awarded.",
          });
      } catch (error) {
        const duplicate =
          await sellingPointTransactionRepository
            .findMembershipTransaction(
              user._id
            );

        if (duplicate) {
          return {
            user:
              await User.findById(
                user._id
              ),

            newlyActivated:
              false,

            commissionCreated:
              false,
          };
        }

        throw error;
      }
    }
  }

  /* ------------------------------------------------------------------------
     PRODUCT PURCHASE MEMBERSHIP
     ------------------------------------------------------------------------ */

  else {
    if (
      Number(
        user.sellingPoints || 0
      ) <
      MEMBERSHIP_TARGET_SP
    ) {
      return {
        user,
        newlyActivated: false,
        commissionCreated: false,
      };
    }

    /*
     * Product purchase already generated
     * the SP.
     *
     * Do NOT add another 40 SP.
     */

    user.membershipSPAwarded =
      true;

    user.membershipStatus =
      "Active";

    user.membershipActivationMethod =
      "ProductPurchase";

    user.membershipActivatedAt =
      new Date();

    await user.save();

    const existingActivation =
      await sellingPointTransactionRepository
        .findMembershipTransaction(
          user._id
        );

    if (
      !existingActivation
    ) {
      await sellingPointTransactionRepository
        .createTransaction({
          user: user._id,

          order:
            options.orderId ||
            null,

          purchaseAmount: 0,

          pointsEarned: 0,

          pendingAmount:
            Number(
              user.pendingPurchaseAmount ||
                0
            ),

          lifetimePurchase:
            Number(
              user.lifetimePurchase ||
                0
            ),

          transactionType:
            "MEMBERSHIP_ACTIVATED",

          remarks:
            "Membership activated after reaching 40 Selling Points.",
        });
    }
  }

  /* ------------------------------------------------------------------------
     JOINING COMMISSION
     ------------------------------------------------------------------------ */

  if (
    user.sponsorId
  ) {
    await commissionService
      .distributeCommission(
        user._id,

        user.sponsorId,

        MEMBERSHIP_AMOUNT,

        options.orderId ||
          null
      );
  }

  const finalUser =
    await applySupervisorPromotion(
      user._id
    );

  return {
    user: finalUser,

    newlyActivated: true,

    commissionCreated:
      Boolean(
        user.sponsorId
      ),
  };
};

/* ==========================================================================
   SYNC PAID MEMBERSHIP
   ========================================================================== */

const syncPaidMembership = async (
  userId,
  orderId = null
) => {
  const user =
    await User.findById(
      userId
    );

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  if (
    String(
      user.paymentStatus ||
        ""
    )
      .trim()
      .toUpperCase() !==
    "PAID"
  ) {
    return user;
  }

  if (
    isMembershipActive(
      user
    )
  ) {
    return user;
  }

  const result =
    await activateMembership(
      userId,
      "MembershipPayment",
      {
        orderId,
      }
    );

  return result.user;
};

/* ==========================================================================
   SUPERVISOR PROMOTION
   ========================================================================== */

const applySupervisorPromotion =
  async (
    userId
  ) => {
    const user =
      await User.findById(
        userId
      );

    if (!user) {
      throw new Error(
        "User not found."
      );
    }

    if (
      Number(
        user.sellingPoints || 0
      ) <
      SUPERVISOR_TARGET
    ) {
      return user;
    }

    if (
      user.isSupervisor ===
      true
    ) {
      return user;
    }

    user.isSupervisor =
      true;

    user.role =
      "SUPERVISOR";

    user.supervisorDate =
      new Date();

    user.discount50Available =
      true;

    await user.save();

    /* ------------------------------------------------------------------------
       SPONSOR BONUS
       ------------------------------------------------------------------------ */

    if (
      user.sponsorId
    ) {
      const sponsor =
        await User.findById(
          user.sponsorId
        );

      if (sponsor) {
        await walletService.creditBonus(
          sponsor._id,

          SUPERVISOR_BONUS,

          "Direct Downline Supervisor Bonus",

          `SUPERVISOR:${user._id}`
        );
      }
    }

    /* ------------------------------------------------------------------------
       SUPERVISOR TRANSACTION
       ------------------------------------------------------------------------ */

    try {
      await sellingPointTransactionRepository
        .createTransaction({
          user: user._id,

          order: null,

          purchaseAmount: 0,

          pointsEarned: 0,

          pendingAmount:
            Number(
              user.pendingPurchaseAmount ||
                0
            ),

          lifetimePurchase:
            Number(
              user.lifetimePurchase ||
                0
            ),

          transactionType:
            "SUPERVISOR",

          remarks:
            "Promoted to Supervisor after reaching 500 SP. Direct sponsor received ₹1,000 bonus.",
        });
    } catch (error) {
      if (
        error &&
        error.code === 11000
      ) {
        return user;
      }

      throw error;
    }

    return user;
  };

/* ==========================================================================
   ENRICH TRANSACTIONS WITH ORDER DETAILS
   ========================================================================== */

/*
 * THIS IS THE IMPORTANT PART FOR YOUR UI.
 *
 * Stored transaction:
 *
 * purchaseAmount = 489
 *
 * Related order:
 *
 * subtotal       = 489
 * deliveryCharge = 50
 * finalAmount    = 539
 *
 * Returned to frontend:
 *
 * purchaseAmount    = 539  ← ACTUAL AMOUNT PAID
 * deliveryCharge    = 50
 * spEligibleAmount  = 489  ← SP CALCULATION
 *
 * Therefore UI can show:
 *
 * Purchase Amount          ₹539
 * Delivery Charge           ₹50
 * SP Eligible Amount       ₹489
 * SP Rate              ₹100 = 2 SP
 * Selling Points Earned      8 SP
 * Remaining Carry Forward   ₹89
 *
 * Delivery charge is excluded from SP.
 */

const enrichTransactionsWithOrders =
  async (
    transactions = []
  ) => {
    if (
      !Array.isArray(
        transactions
      )
    ) {
      return [];
    }

    return await Promise.all(
      transactions.map(
        async (
          transaction
        ) => {
          const transactionObject =
            typeof transaction.toObject ===
            "function"
              ? transaction.toObject()
              : {
                  ...transaction,
                };

          /*
           * Membership transaction:
           *
           * order = null
           */

          if (
            !transactionObject.order
          ) {
            return transactionObject;
          }

          let order =
            null;

          try {
            const orderId =
              transactionObject
                .order?._id ||
              transactionObject.order;

            if (
              orderId &&
              isValidObjectId(
                orderId
              )
            ) {
              order =
                await Order.findById(
                  orderId
                ).lean();
            }
          } catch (error) {
            console.error(
              "SP ORDER DETAILS ERROR:",
              error
            );
          }

          if (order) {
            transactionObject.order =
              order;

            /* --------------------------------------------------------------
               DELIVERY CHARGE
               -------------------------------------------------------------- */

            const deliveryCharge =
              toNumber(
                order.deliveryCharge,
                0
              );

            transactionObject.deliveryCharge =
              deliveryCharge;

            /* --------------------------------------------------------------
               PRODUCT SUBTOTAL
               -------------------------------------------------------------- */

            const subtotal =
              toNumber(
                order.subtotal,
                0
              );

            transactionObject.subtotal =
              subtotal;

            /* --------------------------------------------------------------
               ACTUAL PURCHASE AMOUNT
               -------------------------------------------------------------- */

            /*
             * IMPORTANT:
             *
             * Purchase Amount shown in history
             * means the total amount customer paid.
             *
             * ₹489 product
             * + ₹50 delivery
             * = ₹539
             */

            transactionObject.purchaseAmount =
              subtotal +
              deliveryCharge;

            /* --------------------------------------------------------------
               FINAL AMOUNT
               -------------------------------------------------------------- */

            transactionObject.finalAmount =
              toNumber(
                order.finalAmount,
                subtotal +
                  deliveryCharge
              );

            /* --------------------------------------------------------------
               SP ELIGIBLE AMOUNT
               -------------------------------------------------------------- */

            /*
             * SP uses ONLY product subtotal.
             */

            transactionObject.spEligibleAmount =
              subtotal;

            /* --------------------------------------------------------------
               DELIVERY EXCLUSION FLAG
               -------------------------------------------------------------- */

            transactionObject
              .deliveryChargeExcluded =
              true;

            /* --------------------------------------------------------------
               ORDER NUMBER
               -------------------------------------------------------------- */

            transactionObject.orderNumber =
              order.orderNumber ||
              transactionObject.orderNumber ||
              "";

            /*
             * Keep points from transaction/order.
             */

            transactionObject.pointsEarned =
              toNumber(
                transactionObject.pointsEarned ??
                  order.sellingPoints ??
                  0
              );

            /*
             * Explicitly calculate/display
             * the amount remaining after
             * complete ₹100 blocks.
             *
             * This uses SP eligible amount,
             * NOT final amount.
             */

            const previousCarry =
              toNumber(
                transactionObject
                  .previousPendingAmount ??
                  0
              );

            const calculation =
              calculateSellingPoints(
                subtotal,
                previousCarry
              );

            transactionObject
              .calculationTotal =
              calculation.totalAmount;

            transactionObject
              .calculationEligibleAmount =
              calculation.completeBlocks *
              AMOUNT_PER_BLOCK;

            transactionObject
              .calculationRemainingCarry =
              calculation.pendingAmount;
          } else {
            /*
             * Order may have been deleted.
             */

            transactionObject.deliveryCharge =
              0;

            transactionObject
              .deliveryChargeExcluded =
              true;

            transactionObject.spEligibleAmount =
              toNumber(
                transactionObject.purchaseAmount,
                0
              );
          }

          return transactionObject;
        }
      )
    );
  };

/* ==========================================================================
   GET SELLING POINTS
   ========================================================================== */

const getPoints =
  async (
    userId
  ) => {
    const user =
      await User.findById(
        userId
      );

    if (!user) {
      throw new Error(
        "User not found."
      );
    }

    const rawTransactions =
      await sellingPointTransactionRepository
        .getTransactions(
          userId
        );

    const transactions =
      await enrichTransactionsWithOrders(
        rawTransactions
      );

    const sellingPoints =
      Number(
        user.sellingPoints || 0
      );

    return {
      sellingPoints,

      lifetimePurchase:
        Number(
          user.lifetimePurchase ||
            0
        ),

      pendingPurchaseAmount:
        Number(
          user.pendingPurchaseAmount ||
            0
        ),

      paymentStatus:
        user.paymentStatus ||
        "Pending",

      membershipStatus:
        user.membershipStatus ||
        "Pending",

      membershipActivationMethod:
        user.membershipActivationMethod ||
        null,

      membershipActivatedAt:
        user.membershipActivatedAt ||
        null,

      membershipSPAwarded:
        user.membershipSPAwarded ||
        false,

      referralCode:
        user.referralCode ||
        "",

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
          ) *
            100,
          100
        ),

      transactions,
    };
  };

/* ==========================================================================
   GET ONE ORDER TRANSACTION
   ========================================================================== */

const getOrderTransaction =
  async (
    userId,
    orderId
  ) => {
    if (
      !userId ||
      !orderId
    ) {
      return null;
    }

    const transaction =
      await sellingPointTransactionRepository
        .findOrderTransaction(
          userId,
          orderId
        );

    if (!transaction) {
      return null;
    }

    const enriched =
      await enrichTransactionsWithOrders(
        [transaction]
      );

    return (
      enriched[0] ||
      null
    );
  };

/* ==========================================================================
   GET USER SELLING POINT TRANSACTIONS
   ========================================================================== */

const getUserSellingPointTransactions =
  async (
    userId
  ) => {
    if (!userId) {
      throw new Error(
        "User ID is required"
      );
    }

    const transactions =
      await sellingPointTransactionRepository
        .getTransactions(
          userId
        );

    return await enrichTransactionsWithOrders(
      transactions
    );
  };

/* ==========================================================================
   GET USER ORDER SELLING POINT TRANSACTIONS
   ========================================================================== */

const getUserOrderSellingPointTransactions =
  async (
    userId
  ) => {
    if (!userId) {
      throw new Error(
        "User ID is required"
      );
    }

    const transactions =
      await sellingPointTransactionRepository
        .getUserOrderTransactions(
          userId
        );

    return await enrichTransactionsWithOrders(
      transactions
    );
  };

/* ==========================================================================
   EXPORTS
   ========================================================================== */

module.exports = {
  SP_PER_BLOCK,

  AMOUNT_PER_BLOCK,

  calculateSellingPoints,

  updateSellingPoints,

  processOrderSellingPoints:
    updateSellingPoints,

  syncPaidMembership,

  activateMembership,

  applySupervisorPromotion,

  getPoints,

  getOrderTransaction,

  getUserSellingPointTransactions,

  getUserOrderSellingPointTransactions,

  isOrderPaid,

  getQualifyingPurchaseAmount,
};