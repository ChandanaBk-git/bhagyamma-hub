const WalletTransaction = require("../models/walletTransaction.model");

const create = (data) =>
    WalletTransaction.create(data);

const getTransactions = (walletId) =>
    WalletTransaction.find({
        wallet: walletId,
    })
        .sort({ createdAt: -1 });

module.exports = {
    create,
    getTransactions,
};