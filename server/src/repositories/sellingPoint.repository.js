const SellingPointTransaction = require("../models/sellingPointTransaction.model");

// ======================================
// Create Transaction
// ======================================

const createTransaction = async (data) => {
    return await SellingPointTransaction.create(data);
};

// ======================================
// Get User Transactions
// ======================================

const getTransactions = async (userId) => {
    return await SellingPointTransaction.find({
        user: userId,
    })
        .sort({
            createdAt: -1,
        })
        .populate("order", "orderNumber")
        .lean();
};

// ======================================
// Get Single Transaction
// ======================================

const getTransactionById = async (id) => {
    return await SellingPointTransaction.findById(id)
        .populate("user", "name userId")
        .populate("order", "orderNumber");
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
};