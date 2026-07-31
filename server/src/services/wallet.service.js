const walletRepository = require("../repositories/wallet.repository");
const transactionRepository = require("../repositories/walletTransaction.repository");
const ApiError = require("../utils/ApiError");

const createWallet = async (userId) => {

    const existingWallet =
        await walletRepository.findByUser(userId);

    if (existingWallet) {
        return existingWallet;
    }

    return await walletRepository.create({
        userId,
    });
};

const getWallet = async (userId) => {

    const wallet =
        await walletRepository.findByUser(userId);

    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    return wallet;
};

const creditWallet = async (
    userId,
    amount,
    description = ""
) => {

    amount = Number(amount);

    if (amount <= 0) {
        throw new ApiError(
            400,
            "Amount must be greater than zero"
        );
    }

    const wallet = await getWallet(userId);

    const balance = wallet.balance + amount;

    const updatedWallet =
        await walletRepository.updateBalance(
            wallet._id,
            {
                balance,
                totalCredit:
                    wallet.totalCredit + amount,
            }
        );

    await transactionRepository.create({
        wallet: wallet._id,
        userId,
        type: "CREDIT",
        amount,
        description,
        balanceAfter: balance,
    });

    return updatedWallet;
};

const debitWallet = async (
    userId,
    amount,
    description = ""
) => {

    amount = Number(amount);

    if (amount <= 0) {
        throw new ApiError(
            400,
            "Amount must be greater than zero"
        );
    }

    const wallet = await getWallet(userId);

    if (wallet.balance < amount) {
        throw new ApiError(
            400,
            "Insufficient wallet balance"
        );
    }

    const balance = wallet.balance - amount;

    const updatedWallet =
        await walletRepository.updateBalance(
            wallet._id,
            {
                balance,
                totalDebit:
                    wallet.totalDebit + amount,
            }
        );

    await transactionRepository.create({
        wallet: wallet._id,
        userId,
        type: "DEBIT",
        amount,
        description,
        balanceAfter: balance,
    });

    return updatedWallet;
};

const getHistory = async (userId) => {

    const wallet =
        await getWallet(userId);

    return await transactionRepository.getTransactions(
        wallet._id
    );
};

module.exports = {
    createWallet,
    getWallet,
    creditWallet,
    debitWallet,
    getHistory,
};