const repository = require("../repositories/wallet.repository");
const WalletTransaction = require("../models/walletTransaction.model");
const walletTransactionRepository = require("../repositories/walletTransaction.repository");
const commissionRepository = require("../repositories/commission.repository");
const withdrawRepository = require("../repositories/withdraw.repository");

// ==============================
// Get Wallet
// ==============================

const getWallet = async (userId) => {
  let wallet = await repository.findWalletByUser(userId);

  if (!wallet) {
    wallet = await repository.createWallet({
      user: userId,
      balance: 0,
      totalCommission: 0,
      totalBonus: 0,
      totalWithdrawn: 0,
    });
  }

  const commissions = await commissionRepository.findByUser(userId);
  const totalCommission = commissions.reduce(
    (sum, item) => sum + (item.commissionAmount || 0),
    0
  );

  const withdrawalHistory = await withdrawRepository.findByUser(userId);
  const pendingWithdrawal = withdrawalHistory
    .filter((item) => item.status === "PENDING")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  wallet.balance = totalCommission;
  wallet.totalCommission = totalCommission;
  wallet.pendingWithdrawal = pendingWithdrawal;

  return wallet;
};

// ==============================
// Credit Wallet
// ==============================

const creditWallet = async (

    userId,

    amount,

    description,

    reference = ""

) => {

    console.log("====================================");
    console.log("CREDIT WALLET");
    console.log("User:", userId);
    console.log("Amount:", amount);
    console.log("Description:", description);

    const wallet = await getWallet(userId);

    console.log("Wallet Before Update:", {

        balance: wallet.balance,

        totalCommission: wallet.totalCommission,

    });

    wallet.balance += amount;

    wallet.totalCommission += amount;

    await repository.saveWallet(wallet);

    console.log("Wallet After Update:", {

        balance: wallet.balance,

        totalCommission: wallet.totalCommission,

    });

    const transaction =
        await WalletTransaction.create({

            wallet: wallet._id,

            userId,

            type: "CREDIT",

            amount,

            balanceAfter: wallet.balance,

            description,

            reference,

        });

    console.log("Transaction Saved:", transaction._id);

    console.log("====================================");

    return wallet;

};

// ==============================
// Debit Wallet
// ==============================

const debitWallet = async (

    userId,

    amount,

    description,

    reference = ""

) => {

    console.log("====================================");
    console.log("DEBIT WALLET");
    console.log("User:", userId);
    console.log("Amount:", amount);

    const wallet = await getWallet(userId);

    console.log("Wallet Before Debit:", {

        balance: wallet.balance,

        totalWithdrawn: wallet.totalWithdrawn,

    });

    if (wallet.balance < amount) {

        throw new Error("Insufficient Wallet Balance");

    }

    wallet.balance -= amount;

    wallet.totalWithdrawn += amount;

    await repository.saveWallet(wallet);

    console.log("Wallet After Debit:", {

        balance: wallet.balance,

        totalWithdrawn: wallet.totalWithdrawn,

    });

    const transaction =
        await WalletTransaction.create({

            wallet: wallet._id,

            userId,

            type: "DEBIT",

            amount,

            balanceAfter: wallet.balance,

            description,

            reference,

        });

    console.log("Transaction Saved:", transaction._id);

    console.log("====================================");

    return wallet;

};

// ==============================
// Wallet Details
// ==============================

const getWalletDetails = async (userId) => {

    const wallet =
        await getWallet(userId);

    const transactions =
        await walletTransactionRepository.getTransactions(
            wallet._id
        );

    return {

        wallet,

        transactions,

    };

};

module.exports = {

    getWallet,

    creditWallet,

    debitWallet,

    getWalletDetails,

};