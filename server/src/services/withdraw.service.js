const withdrawRepository = require("../repositories/withdraw.repository");
const walletRepository = require("../repositories/wallet.repository");
const userRepository = require("../repositories/user.repository");
const walletService = require("./wallet.service");

const ApiError = require("../utils/ApiError");

const MIN_WITHDRAWAL = 500;

// ======================================
// Create Withdraw Request
// ======================================

const requestWithdraw = async (userId, amount) => {
  const requestedAmount = Number(amount);

  // --------------------------------------
  // Validate amount
  // --------------------------------------

  if (
    !Number.isFinite(requestedAmount) ||
    requestedAmount <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid withdraw amount."
    );
  }

  if (requestedAmount < MIN_WITHDRAWAL) {
    throw new ApiError(
      400,
      `Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}.`
    );
  }

  // --------------------------------------
  // Find user
  // --------------------------------------

  const user =
    await userRepository.findById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found."
    );
  }

  // --------------------------------------
  // Find wallet
  // --------------------------------------

const wallet =
  await walletRepository.findWalletByUser(userId);

  if (!wallet) {
    throw new ApiError(
      404,
      "Wallet not found."
    );
  }

  const walletBalance =
    Number(wallet.balance || 0);

  // --------------------------------------
  // Calculate pending withdrawals
  // --------------------------------------

  const pendingWithdrawals =
    await withdrawRepository.findPendingByUser(
      userId
    );

  const pendingAmount =
    pendingWithdrawals.reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

  // --------------------------------------
  // Available withdrawal balance
  // --------------------------------------

  const availableBalance =
    walletBalance - pendingAmount;

  // --------------------------------------
  // Check balance
  // --------------------------------------

  if (
    requestedAmount >
    availableBalance
  ) {
    throw new ApiError(
      400,
      `Insufficient available wallet balance. Available amount is ₹${availableBalance.toLocaleString(
        "en-IN"
      )}.`
    );
  }

  // --------------------------------------
  // Bank details
  //
  // IMPORTANT:
  // User model stores these as direct fields,
  // NOT user.bankDetails
  // --------------------------------------

  const bankName =
    String(user.bankName || "").trim();

  const accountHolderName =
    String(
      user.accountHolderName || ""
    ).trim();

  const accountNumber =
    String(user.accountNumber || "").trim();

  const ifscCode =
    String(user.ifscCode || "")
      .trim()
      .toUpperCase();

  const branch =
    String(user.branch || "").trim();

  // --------------------------------------
  // Validate bank details
  // --------------------------------------

  if (
    !bankName ||
    !accountHolderName ||
    !accountNumber ||
    !ifscCode
  ) {
    throw new ApiError(
      400,
      "Please update your bank details first."
    );
  }

  // --------------------------------------
  // Create withdrawal
  // --------------------------------------

  const withdraw =
    await withdrawRepository.createWithdraw({
      user: user._id,

      wallet: wallet._id,

      amount: requestedAmount,

      bankName,

      accountHolderName,

      accountNumber,

      ifscCode,

      upiId:
        String(user.upiId || "").trim(),

      remarks: branch
        ? `Branch: ${branch}`
        : "",

      status: "PENDING",
    });

  return withdraw;
};

// ======================================
// Member Withdraw History
// ======================================

const getMyWithdraws = async (userId) => {
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

  // --------------------------------------
  // Check current wallet balance again
  // --------------------------------------

const wallet =
  await walletRepository.findWalletByUser(
    withdraw.user._id
  );
  if (!wallet) {
    throw new ApiError(
      404,
      "Wallet not found."
    );
  }

  if (
    Number(wallet.balance || 0) <
    Number(withdraw.amount || 0)
  ) {
    throw new ApiError(
      400,
      "Insufficient wallet balance to approve this withdrawal."
    );
  }

  // --------------------------------------
  // Debit wallet
  // --------------------------------------

  await walletService.debitWallet(
    withdraw.user._id,
    withdraw.amount,
    "Withdraw Approved"
  );

  // --------------------------------------
  // Update withdrawal
  // --------------------------------------

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

      rejectedReason:
        String(reason || "").trim(),
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
