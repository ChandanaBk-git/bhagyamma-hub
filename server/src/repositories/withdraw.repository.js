const Withdraw = require("../models/withdraw.model");

// ==============================
// Create Withdraw Request
// ==============================

const createWithdraw = async (data) => {
  return await Withdraw.create(data);
};

// ==============================
// Get User Withdraw History
// ==============================

const findByUser = async (userId) => {
  return await Withdraw.find({ user: userId })
    .sort({ createdAt: -1 });
};

// ==============================
// Get All Withdraw Requests
// ==============================

const findAll = async () => {
  return await Withdraw.find()
    .populate(
      "user",
      "name userId mobile"
    )
    .populate(
      "approvedBy",
      "name userId"
    )
    .sort({ createdAt: -1 });
};

// ==============================
// Find By ID
// ==============================

const findById = async (id) => {
  return await Withdraw.findById(id)
    .populate(
      "user",
      "name userId mobile email bankDetails"
    )
    .populate(
      "wallet"
    );
};

// ==============================
// Update Withdraw
// ==============================

const updateById = async (
  id,
  data
) => {
  return await Withdraw.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
    }
  );
};

// ==============================
// Pending Requests
// ==============================

const findPending = async () => {
  return await Withdraw.find({
    status: "PENDING",
  })
    .populate(
      "user",
      "name userId"
    )
    .sort({
      createdAt: -1,
    });
};

module.exports = {

  createWithdraw,

  findByUser,

  findAll,

  findById,

  updateById,

  findPending,

};