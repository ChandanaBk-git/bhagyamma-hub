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
// GET WALLET
// =====================================================

const getWallet = async (
  userId
) => {

  let wallet =
    await repository.findWalletByUser(
      userId
    );


  // ---------------------------------------------------
  // CREATE WALLET IF NOT EXISTS
  // ---------------------------------------------------

  if (!wallet) {

    wallet =
      await repository.createWallet({

        user:
          userId,

        balance:
          0,

        totalCommission:
          0,

        totalBonus:
          0,

        totalWithdrawn:
          0,

        pendingWithdrawal:
          0,

      });

  }


  // ---------------------------------------------------
  // COMMISSION HISTORY
  // ---------------------------------------------------

  const commissions =
    await commissionRepository.findByUser(
      userId
    );


  const totalCommission =
    commissions.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.commissionAmount || 0
        ),
      0
    );


  // ---------------------------------------------------
  // WITHDRAWAL HISTORY
  // ---------------------------------------------------

  const withdrawalHistory =
    await withdrawRepository.findByUser(
      userId
    );


  const pendingWithdrawal =
    withdrawalHistory
      .filter(
        (item) =>
          String(
            item.status || ""
          ).toUpperCase() ===
          "PENDING"
      )
      .reduce(
        (
          sum,
          item
        ) =>
          sum +
          Number(
            item.amount || 0
          ),
        0
      );


  // ---------------------------------------------------
  // IMPORTANT
  // ---------------------------------------------------
  //
  // DO NOT overwrite wallet.balance here.
  //
  // wallet.balance is the actual persisted
  // available wallet balance.
  //
  // Previously this code did:
  //
  // wallet.balance = totalCommission;
  //
  // That was causing the wallet value to be
  // incorrectly recalculated.
  //
  // ---------------------------------------------------

  wallet.totalCommission =
    totalCommission;

  wallet.pendingWithdrawal =
    pendingWithdrawal;


  return wallet;

};


// =====================================================
// CREDIT WALLET
// =====================================================

const creditWallet = async (

  userId,

  amount,

  description,

  reference = ""

) => {

  const creditAmount =
    Number(
      amount || 0
    );


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


  console.log(
    "===================================="
  );

  console.log(
    "CREDIT WALLET"
  );

  console.log(
    "User:",
    userId
  );

  console.log(
    "Amount:",
    creditAmount
  );

  console.log(
    "Description:",
    description
  );


  // ---------------------------------------------------
  // GET EXISTING WALLET
  // ---------------------------------------------------

  let wallet =
    await repository.findWalletByUser(
      userId
    );


  // ---------------------------------------------------
  // CREATE IF NOT EXISTS
  // ---------------------------------------------------

  if (!wallet) {

    wallet =
      await repository.createWallet({

        user:
          userId,

        balance:
          0,

        totalCommission:
          0,

        totalBonus:
          0,

        totalWithdrawn:
          0,

        pendingWithdrawal:
          0,

      });

  }


  console.log(
    "Wallet Before Update:",
    {

      balance:
        wallet.balance,

      totalCommission:
        wallet.totalCommission,

    }
  );


  // ---------------------------------------------------
  // UPDATE BALANCE
  // ---------------------------------------------------

  wallet.balance =
    Number(
      wallet.balance || 0
    ) +
    creditAmount;


  // ---------------------------------------------------
  // UPDATE COMMISSION TOTAL
  // ---------------------------------------------------

  wallet.totalCommission =
    Number(
      wallet.totalCommission || 0
    ) +
    creditAmount;


  // ---------------------------------------------------
  // SAVE WALLET
  // ---------------------------------------------------

  await repository.saveWallet(
    wallet
  );


  console.log(
    "Wallet After Update:",
    {

      balance:
        wallet.balance,

      totalCommission:
        wallet.totalCommission,

    }
  );


  // ---------------------------------------------------
  // SAVE TRANSACTION
  // ---------------------------------------------------

  const transaction =
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


  console.log(
    "Transaction Saved:",
    transaction._id
  );


  console.log(
    "===================================="
  );


  return wallet;

};


// =====================================================
// DEBIT WALLET
// =====================================================

const debitWallet = async (

  userId,

  amount,

  description,

  reference = ""

) => {

  const debitAmount =
    Number(
      amount || 0
    );


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


  console.log(
    "===================================="
  );

  console.log(
    "DEBIT WALLET"
  );

  console.log(
    "User:",
    userId
  );

  console.log(
    "Amount:",
    debitAmount
  );


  // ---------------------------------------------------
  // GET WALLET DIRECTLY
  // ---------------------------------------------------

  let wallet =
    await repository.findWalletByUser(
      userId
    );


  // ---------------------------------------------------
  // CREATE IF NOT EXISTS
  // ---------------------------------------------------

  if (!wallet) {

    wallet =
      await repository.createWallet({

        user:
          userId,

        balance:
          0,

        totalCommission:
          0,

        totalBonus:
          0,

        totalWithdrawn:
          0,

        pendingWithdrawal:
          0,

      });

  }


  console.log(
    "Wallet Before Debit:",
    {

      balance:
        wallet.balance,

      totalWithdrawn:
        wallet.totalWithdrawn,

    }
  );


  // ---------------------------------------------------
  // CHECK BALANCE
  // ---------------------------------------------------

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


  // ---------------------------------------------------
  // DEBIT BALANCE
  // ---------------------------------------------------

  wallet.balance =
    Number(
      wallet.balance || 0
    ) -
    debitAmount;


  // ---------------------------------------------------
  // UPDATE WITHDRAWN
  // ---------------------------------------------------

  wallet.totalWithdrawn =
    Number(
      wallet.totalWithdrawn || 0
    ) +
    debitAmount;


  // ---------------------------------------------------
  // SAVE WALLET
  // ---------------------------------------------------

  await repository.saveWallet(
    wallet
  );


  console.log(
    "Wallet After Debit:",
    {

      balance:
        wallet.balance,

      totalWithdrawn:
        wallet.totalWithdrawn,

    }
  );


  // ---------------------------------------------------
  // SAVE TRANSACTION
  // ---------------------------------------------------

  const transaction =
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


  console.log(
    "Transaction Saved:",
    transaction._id
  );


  console.log(
    "===================================="
  );


  return wallet;

};


// =====================================================
// GET WALLET DETAILS
// =====================================================

const getWalletDetails = async (
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
// RECONCILE WALLET FROM PAID COMMISSIONS
// =====================================================

const reconcileWalletFromCommissions = async (
  userId
) => {

  // ---------------------------------------------------
  // GET WALLET
  // ---------------------------------------------------

  let wallet =
    await repository.findWalletByUser(
      userId
    );


  if (!wallet) {

    wallet =
      await repository.createWallet({

        user:
          userId,

        balance:
          0,

        totalCommission:
          0,

        totalBonus:
          0,

        totalWithdrawn:
          0,

        pendingWithdrawal:
          0,

      });

  }


  // ---------------------------------------------------
  // GET PAID COMMISSIONS
  // ---------------------------------------------------

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


  // ---------------------------------------------------
  // CURRENT WALLET
  // ---------------------------------------------------

  const currentBalance =
    Number(
      wallet.balance || 0
    );


  const currentCommission =
    Number(
      wallet.totalCommission || 0
    );


  // ---------------------------------------------------
  // ONLY CREDIT THE DIFFERENCE
  // ---------------------------------------------------

  const balanceDifference =
    paidCommission -
    currentCommission;


  if (
    balanceDifference > 0
  ) {

    wallet.balance =
      currentBalance +
      balanceDifference;

    wallet.totalCommission =
      currentCommission +
      balanceDifference;


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
        balanceDifference,

      balanceAfter:
        wallet.balance,

      description:
        "Wallet reconciliation for existing paid commissions",

      reference:
        "COMMISSION_RECONCILIATION",

    });

  }


  return {

    wallet,

    paidCommission,

    credited:
      Math.max(
        balanceDifference,
        0
      ),

  };

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  getWallet,

  creditWallet,

  debitWallet,

  getWalletDetails,

  reconcileWalletFromCommissions,

};