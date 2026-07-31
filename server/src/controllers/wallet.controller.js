const walletService = require("../services/wallet.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

/**
 * @desc    Get logged-in user's wallet
 * @route   GET /api/v1/wallet/me
 * @access  Private
 */
const getMyWallet = asyncHandler(async (req, res) => {
    const wallet = await walletService.getWallet(req.user.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Wallet fetched successfully",
            wallet
        )
    );
});

/**
 * @desc    Get wallet by user id (Admin)
 * @route   GET /api/v1/wallet/:userId
 * @access  SUPER_ADMIN / MANAGER
 */
const getWalletByUserId = asyncHandler(async (req, res) => {
    const wallet = await walletService.getWallet(req.params.userId);

    res.status(200).json(
        new ApiResponse(
            200,
            "Wallet fetched successfully",
            wallet
        )
    );
});

/**
 * @desc    Credit wallet
 * @route   POST /api/v1/wallet/credit
 * @access  Private/Admin
 */
const creditWallet = asyncHandler(async (req, res) => {

    const { amount, description = "" } = req.body;

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Amount must be greater than zero");
    }

    const wallet = await walletService.creditWallet(
        req.user.id,
        amount,
        description
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Wallet credited successfully",
            wallet
        )
    );
});

/**
 * @desc    Debit wallet
 * @route   POST /api/v1/wallet/debit
 * @access  Private/Admin
 */
const debitWallet = asyncHandler(async (req, res) => {

    const { amount, description = "" } = req.body;

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Amount must be greater than zero");
    }

    const wallet = await walletService.debitWallet(
        req.user.id,
        amount,
        description
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Wallet debited successfully",
            wallet
        )
    );
});

/**
 * @desc    Wallet transaction history
 * @route   GET /api/v1/wallet/history
 * @access  Private
 */
const getHistory = asyncHandler(async (req, res) => {

    const history = await walletService.getHistory(req.user.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Transaction history fetched successfully",
            history
        )
    );
});

module.exports = {
    getMyWallet,
    getWalletByUserId,
    creditWallet,
    debitWallet,
    getHistory,
};