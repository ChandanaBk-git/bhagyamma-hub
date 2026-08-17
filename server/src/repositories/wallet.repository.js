const Wallet = require("../models/wallet.model");

const findWalletByUser = async (userId) => {
  return await Wallet.findOne({ user: userId });
};

const createWallet = async (data) => {
  return await Wallet.create(data);
};

const saveWallet = async (wallet) => {
  return await wallet.save();
};

module.exports = {
  findWalletByUser,
  createWallet,
  saveWallet,
};