const Wallet = require("../models/wallet.model");

// =====================================================
// FIND WALLET BY USER
// =====================================================

const findWalletByUser = async (userId) => {
  return await Wallet.findOne({
    user: userId,
  });
};

// =====================================================
// CREATE WALLET
// =====================================================

const createWallet = async (data) => {
  return await Wallet.create(data);
};

// =====================================================
// SAVE WALLET
// =====================================================

const saveWallet = async (wallet) => {
  return await wallet.save();
};

// =====================================================
// FIND WALLETS FOR MULTIPLE USERS
// =====================================================

const findWalletsByUsers = async (userIds = []) => {
  if (
    !Array.isArray(userIds) ||
    userIds.length === 0
  ) {
    return [];
  }

  return await Wallet.find({
    user: {
      $in: userIds,
    },
  }).lean();
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  findWalletByUser,
  createWallet,
  saveWallet,
  findWalletsByUsers,
};