const walletService = require("../services/wallet.service");

// =======================
// Get Wallet
// =======================

exports.getMyWallet = async (req, res, next) => {

    try {

        const walletData =
            await walletService.getWalletDetails(
                req.user.id
            );

        res.json({

            success: true,

            data: walletData,

        });

    } catch (error) {

        next(error);

    }

};

// =======================
// Test Credit
// =======================

exports.testCredit = async (req, res, next) => {

    try {

        const wallet =
            await walletService.creditWallet(

                req.user.id,

                400,

                "Test Commission",

                "TEST001"

            );

        res.json({

            success: true,

            data: wallet,

        });

    } catch (error) {

        next(error);

    }

};

// =======================
// Test Debit
// =======================

exports.testDebit = async (req, res, next) => {

    try {

        const wallet =
            await walletService.debitWallet(

                req.user.id,

                100,

                "Test Withdrawal",

                "TEST002"

            );

        res.json({

            success: true,

            data: wallet,

        });

    } catch (error) {

        next(error);

    }

};