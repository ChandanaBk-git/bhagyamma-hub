const withdrawRepository = require("../repositories/withdraw.repository");
const walletRepository = require("../repositories/wallet.repository");
const userRepository = require("../repositories/user.repository");
const walletService = require("./wallet.service");

const ApiError = require("../utils/ApiError");

// ======================================
// Create Withdraw Request
// ======================================

const requestWithdraw = async (userId, amount) => {

  if (!amount || amount <= 0) {
    throw new ApiError(
      400,
      "Invalid withdraw amount."
    );
  }

  const user =
    await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found."
    );
  }

  const wallet =
    await walletRepository.findByUser(userId);

  if (!wallet) {
    throw new ApiError(
      404,
      "Wallet not found."
    );
  }

  if (wallet.balance < amount) {
    throw new ApiError(
      400,
      "Insufficient wallet balance."
    );
  }

  if (!user.bankDetails) {
    throw new ApiError(
      400,
      "Please update your bank details first."
    );
  }

  const withdraw =
    await withdrawRepository.createWithdraw({

      user: user._id,

      wallet: wallet._id,

      amount,

      bankName:
        user.bankDetails.bankName,

      accountHolderName:
        user.bankDetails.accountHolderName,

      accountNumber:
        user.bankDetails.accountNumber,

      ifscCode:
        user.bankDetails.ifscCode,

      upiId:
        user.bankDetails.upiId || "",

      status: "PENDING",

    });

  return withdraw;

};

// ======================================
// Member Withdraw History
// ======================================

const getMyWithdraws = async (
  userId
) => {

  return await withdrawRepository.findByUser(
    userId
  );

};

// ======================================
// Manager/Admin
// ======================================

const getAllWithdraws = async () => {

  return await withdrawRepository.findAll();

};

// ======================================
// Approve Withdraw
// ======================================

const approveWithdraw = async (
  withdrawId,
  adminId
) => {

  const withdraw =
    await withdrawRepository.findById(
      withdrawId
    );

  if (!withdraw) {
    throw new ApiError(
      404,
      "Withdraw request not found."
    );
  }

  if (
    withdraw.status !== "PENDING"
  ) {
    throw new ApiError(
      400,
      "Request already processed."
    );
  }

  await walletService.debitWallet(

    withdraw.user._id,

    withdraw.amount,

    "Withdraw Approved"

  );

  return await withdrawRepository.updateById(

    withdrawId,

    {

      status: "APPROVED",

      approvedBy: adminId,

      approvedAt: new Date(),

    }

  );

};

// ======================================
// Reject Withdraw
// ======================================

const rejectWithdraw = async (

  withdrawId,

  adminId,

  reason = ""

) => {

  const withdraw =
    await withdrawRepository.findById(
      withdrawId
    );

  if (!withdraw) {
    throw new ApiError(
      404,
      "Withdraw request not found."
    );
  }

  if (
    withdraw.status !== "PENDING"
  ) {
    throw new ApiError(
      400,
      "Request already processed."
    );
  }

  return await withdrawRepository.updateById(

    withdrawId,

    {

      status: "REJECTED",

      approvedBy: adminId,

      approvedAt: new Date(),

      rejectedReason: reason,

    }

  );

};

module.exports = {

  requestWithdraw,

  getMyWithdraws,

  getAllWithdraws,

  approveWithdraw,

  rejectWithdraw,

};