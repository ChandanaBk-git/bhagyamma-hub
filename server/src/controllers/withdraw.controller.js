const asyncHandler = require("../utils/asyncHandler");
const withdrawService = require("../services/withdraw.service");

// ======================================
// Member Request Withdraw
// POST /api/v1/withdraw
// ======================================

exports.requestWithdraw = asyncHandler(async (req, res) => {

  const withdraw =
    await withdrawService.requestWithdraw(
      req.user.id,
      req.body.amount
    );

  res.status(201).json({
    success: true,
    message: "Withdraw request submitted successfully.",
    data: withdraw,
  });

});

// ======================================
// Member Withdraw History
// GET /api/v1/withdraw/my
// ======================================

exports.getMyWithdraws = asyncHandler(async (req, res) => {

  const history =
    await withdrawService.getMyWithdraws(
      req.user.id
    );

  res.status(200).json({
    success: true,
    data: history,
  });

});

// ======================================
// Manager/Admin
// GET /api/v1/withdraw
// ======================================

exports.getAllWithdraws = asyncHandler(async (req, res) => {

  const data =
    await withdrawService.getAllWithdraws();

  res.status(200).json({
    success: true,
    data,
  });

});

// ======================================
// Approve Withdraw
// PUT /api/v1/withdraw/:id/approve
// ======================================

exports.approveWithdraw = asyncHandler(async (req, res) => {

  const withdraw =
    await withdrawService.approveWithdraw(
      req.params.id,
      req.user.id
    );

  res.status(200).json({
    success: true,
    message: "Withdraw approved successfully.",
    data: withdraw,
  });

});

// ======================================
// Reject Withdraw
// PUT /api/v1/withdraw/:id/reject
// ======================================

exports.rejectWithdraw = asyncHandler(async (req, res) => {

  const withdraw =
    await withdrawService.rejectWithdraw(
      req.params.id,
      req.user.id,
      req.body.reason
    );

  res.status(200).json({
    success: true,
    message: "Withdraw rejected successfully.",
    data: withdraw,
  });

});