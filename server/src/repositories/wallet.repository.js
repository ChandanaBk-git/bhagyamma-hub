const Wallet = require("../models/wallet.model");

const create = (data) => Wallet.create(data);

const findByUser = (userId) =>
    Wallet.findOne({ userId });

const findById = (id) =>
    Wallet.findById(id);

const updateBalance = (id, data) =>
    Wallet.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

module.exports = {
    create,
    findByUser,
    findById,
    updateBalance,
};