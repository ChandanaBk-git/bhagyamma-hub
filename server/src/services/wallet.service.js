const repository =
  require("../repositories/wallet.repository");

const WalletTransaction =
  require("../models/walletTransaction.model");

const walletTransactionRepository =
  require("../repositories/walletTransaction.repository");

const commissionRepository =
  require("../repositories/commission.repository");

const withdrawRepository =
  require("../repositories/withdraw.repository");


// =====================================================
// CREATE EMPTY WALLET
// =====================================================

const createEmptyWallet = async (
  userId
) => {

  return await repository.createWallet({
    user: userId,

    balance: 0,

    totalCommission: 0,

    totalBonus: 0,

    totalWithdrawn: 0,

    pendingWithdrawal: 0,

    isActive: true,
  });

};


// =====================================================
// GET OR CREATE WALLET
// =====================================================

const getOrCreateWallet = async (
  userId
) => {

  let wallet =
    await repository.findWalletByUser(
      userId
    );


  if (!wallet) {

    try {

      wallet =
        await createEmptyWallet(
          userId
        );

    } catch (error) {

      // Another simultaneous request may have
      // created the wallet first.

      if (
        error &&
        error.code === 11000
      ) {

        wallet =
          await repository.findWalletByUser(
            userId
          );

      } else {

        throw error;

      }

    }

  }


  if (!wallet) {

    throw new Error(
      "Unable to create or find wallet."
    );

  }


  return wallet;

};


// =====================================================
// GET WALLET
// =====================================================
//
// READ ONLY with respect to wallet money.
//
// It synchronizes pending withdrawal amount only.
//
// It does NOT:
// - calculate SP
// - create commission
// - create bonus
// - recalculate balance
//
// =====================================================

const getWallet = async (
  userId
) => {

  const wallet =
    await getOrCreateWallet(
      userId
    );


  // ===================================================
  // PENDING WITHDRAWAL
  // ===================================================

  const withdrawals =
    await withdrawRepository.findByUser(
      userId
    );


  const pendingWithdrawal =
    withdrawals
      .filter(
        (item) =>
          String(
            item.status || ""
          ).toUpperCase() ===
          "PENDING"
      )
      .reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.amount || 0
          ),
        0
      );


  wallet.pendingWithdrawal =
    pendingWithdrawal;


  await repository.saveWallet(
    wallet
  );


  return wallet;

};


// =====================================================
// FIND EXISTING CREDIT
// =====================================================
//
// Used for idempotency.
//
// Example:
//
// JOINING:USER123:L1
//
// If this reference already exists,
// DO NOT credit the wallet again.
//
// =====================================================

const findExistingCredit =
  async (
    userId,
    reference
  ) => {

    if (
      !userId ||
      !reference
    ) {

      return null;

    }


    return await WalletTransaction.findOne({

      userId,

      reference,

      type:
        "CREDIT",

    }).sort({

      createdAt: -1,

    });

  };


// =====================================================
// INTERNAL WALLET CREDIT
// =====================================================
//
// ONLY COMMISSION and BONUS reach here.
//
// SP NEVER reaches wallet.
//
// =====================================================

const creditWalletInternal =
  async (
    userId,
    amount,
    description,
    reference = "",
    type = "BONUS"
  ) => {

    const creditAmount =
      Number(
        amount || 0
      );


    // =================================================
    // VALIDATE USER
    // =================================================

    if (!userId) {

      throw new Error(
        "User ID is required for wallet credit."
      );

    }


    // =================================================
    // VALIDATE AMOUNT
    // =================================================

    if (
      !Number.isFinite(
        creditAmount
      ) ||
      creditAmount <= 0
    ) {

      throw new Error(
        "Invalid wallet credit amount"
      );

    }


    // =================================================
    // VALIDATE TYPE
    // =================================================

    if (
      type !== "COMMISSION" &&
      type !== "BONUS"
    ) {

      throw new Error(
        `Invalid wallet credit type: ${type}`
      );

    }


    // =================================================
    // IDEMPOTENCY CHECK
    // =================================================
    //
    // Only use this when a real reference exists.
    //
    // Commission:
    //
    // JOINING:<memberId>:L1
    //
    // Bonus:
    //
    // SUPERVISOR:<memberId>
    //
    // Same reference = same financial event.
    //
    // =================================================

    if (
      reference &&
      String(
        reference
      ).trim()
    ) {

      const existingTransaction =
        await findExistingCredit(
          userId,
          reference
        );


      if (
        existingTransaction
      ) {

        console.log(
          "WALLET CREDIT ALREADY PROCESSED"
        );

        console.log(
          "User:",
          userId.toString()
        );

        console.log(
          "Reference:",
          reference
        );

        return await repository.findWalletByUser(
          userId
        );

      }

    }


    // =================================================
    // GET WALLET
    // =================================================

    const wallet =
      await getOrCreateWallet(
        userId
      );


    // =================================================
    // CREDIT BALANCE
    // =================================================

    wallet.balance =
      Number(
        wallet.balance || 0
      ) +
      creditAmount;


    // =================================================
    // COMMISSION
    // =================================================

    if (
      type ===
      "COMMISSION"
    ) {

      wallet.totalCommission =
        Number(
          wallet.totalCommission || 0
        ) +
        creditAmount;

    }


    // =================================================
    // BONUS
    // =================================================

    if (
      type ===
      "BONUS"
    ) {

      wallet.totalBonus =
        Number(
          wallet.totalBonus || 0
        ) +
        creditAmount;

    }


    // =================================================
    // SAVE WALLET
    // =================================================

    await repository.saveWallet(
      wallet
    );


    // =================================================
    // CREATE TRANSACTION
    // =================================================

    try {

      await WalletTransaction.create({

        wallet:
          wallet._id,

        userId,

        type:
          "CREDIT",

        amount:
          creditAmount,

        balanceAfter:
          wallet.balance,

        description,

        reference,

      });

    } catch (error) {

      // =================================================
      // DUPLICATE REFERENCE
      // =================================================
      //
      // This can happen if two identical requests arrive
      // at almost exactly the same time after the
      // database unique index has been added.
      //
      // =================================================

      if (
        error &&
        error.code === 11000 &&
        reference
      ) {

        console.warn(
          "DUPLICATE WALLET TRANSACTION BLOCKED:",
          reference
        );


        // IMPORTANT:
        //
        // At this point the wallet may already have been
        // changed by this request.
        //
        // Therefore the unique index is NOT sufficient
        // by itself for true atomic financial safety.
        //
        // We throw instead of silently claiming success.
        //

        throw new Error(
          "Duplicate wallet credit detected. Transaction requires review."
        );

      }


      throw error;

    }


    return wallet;

  };


// =====================================================
// CREDIT COMMISSION
// =====================================================
//
// ONLY referral commission.
//
// Example:
//
// L1 = 20%
// L2 = 5%
// L3+ = 1%
//
// =====================================================

const creditCommission =
  async (
    userId,
    amount,
    description,
    reference = ""
  ) => {

    return await creditWalletInternal(

      userId,

      amount,

      description,

      reference,

      "COMMISSION"

    );

  };


// =====================================================
// CREDIT BONUS
// =====================================================
//
// Bonus/incentive only.
//
// Example:
//
// Supervisor milestone
//      ↓
// ₹1,000 bonus
//
// This is NOT commission.
//
// =====================================================

const creditBonus =
  async (
    userId,
    amount,
    description,
    reference = ""
  ) => {

    return await creditWalletInternal(

      userId,

      amount,

      description,

      reference,

      "BONUS"

    );

  };


// =====================================================
// LEGACY CREDIT
// =====================================================
//
// Existing code may still call:
//
// creditWallet()
//
// Keep it for compatibility.
//
// New code should use:
// creditCommission()
// creditBonus()
//
// =====================================================

const creditWallet =
  async (
    userId,
    amount,
    description,
    reference = ""
  ) => {

    console.warn(
      "WARNING: legacy creditWallet() used. Use creditCommission() or creditBonus()."
    );


    return await creditBonus(

      userId,

      amount,

      description,

      reference

    );

  };


// =====================================================
// DEBIT WALLET
// =====================================================
//
// Used for withdrawals.
//
// balance decreases.
// totalWithdrawn increases.
//
// totalCommission and totalBonus remain unchanged.
//
// =====================================================

const debitWallet =
  async (
    userId,
    amount,
    description,
    reference = ""
  ) => {

    const debitAmount =
      Number(
        amount || 0
      );


    // =================================================
    // VALIDATE
    // =================================================

    if (
      !Number.isFinite(
        debitAmount
      ) ||
      debitAmount <= 0
    ) {

      throw new Error(
        "Invalid wallet debit amount"
      );

    }


    // =================================================
    // GET WALLET
    // =================================================

    const wallet =
      await getOrCreateWallet(
        userId
      );


    // =================================================
    // CHECK BALANCE
    // =================================================

    if (
      Number(
        wallet.balance || 0
      ) <
      debitAmount
    ) {

      throw new Error(
        "Insufficient Wallet Balance"
      );

    }


    // =================================================
    // DEBIT
    // =================================================

    wallet.balance =
      Number(
        wallet.balance || 0
      ) -
      debitAmount;


    // =================================================
    // TOTAL WITHDRAWN
    // =================================================

    wallet.totalWithdrawn =
      Number(
        wallet.totalWithdrawn || 0
      ) +
      debitAmount;


    // =================================================
    // SAVE
    // =================================================

    await repository.saveWallet(
      wallet
    );


    // =================================================
    // TRANSACTION
    // =================================================

    await WalletTransaction.create({

      wallet:
        wallet._id,

      userId,

      type:
        "DEBIT",

      amount:
        debitAmount,

      balanceAfter:
        wallet.balance,

      description,

      reference,

    });


    return wallet;

  };


// =====================================================
// GET WALLET DETAILS
// =====================================================

const getWalletDetails =
  async (
    userId
  ) => {

    const wallet =
      await getWallet(
        userId
      );


    const transactions =
      await walletTransactionRepository
        .getTransactions(
          wallet._id
        );


    return {

      wallet,

      transactions,

    };

  };


// =====================================================
// RECONCILE EXISTING COMMISSIONS
// =====================================================
//
// DO NOT call automatically.
//
// Existing financial data must be inspected first.
//
// =====================================================

const reconcileWalletFromCommissions =
  async (
    userId
  ) => {

    const wallet =
      await getOrCreateWallet(
        userId
      );


    const commissions =
      await commissionRepository.findByUser(
        userId
      );


    const paidCommission =
      commissions
        .filter(
          (item) =>
            String(
              item.status || ""
            ).toUpperCase() ===
            "PAID"
        )
        .reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.commissionAmount || 0
            ),
          0
        );


    const currentCommission =
      Number(
        wallet.totalCommission || 0
      );


    const difference =
      paidCommission -
      currentCommission;


    // =================================================
    // ONLY POSITIVE DIFFERENCE
    // =================================================

    if (
      difference > 0
    ) {

      wallet.balance =
        Number(
          wallet.balance || 0
        ) +
        difference;


      wallet.totalCommission =
        currentCommission +
        difference;


      await repository.saveWallet(
        wallet
      );


      await WalletTransaction.create({

        wallet:
          wallet._id,

        userId,

        type:
          "CREDIT",

        amount:
          difference,

        balanceAfter:
          wallet.balance,

        description:
          "Commission reconciliation",

        reference:
          `COMMISSION_RECONCILIATION:${userId}`,

      });

    }


    return {

      wallet,

      paidCommission,

      credited:
        Math.max(
          difference,
          0
        ),

    };

  };


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  getWallet,

  getOrCreateWallet,

  creditWallet,

  creditCommission,

  creditBonus,

  debitWallet,

  getWalletDetails,

  reconcileWalletFromCommissions,

};