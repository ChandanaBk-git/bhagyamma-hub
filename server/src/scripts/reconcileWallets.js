require("dotenv").config();

const mongoose = require("mongoose");

const User =
  require("../models/user.model");

const Wallet =
  require("../models/wallet.model");

const WalletTransaction =
  require("../models/walletTransaction.model");

const CommissionTransaction =
  require("../models/commissionTransaction.model");


// =====================================================
// DATABASE CONNECTION
// =====================================================

const MONGO_URI =
  process.env.MONGO_URI;


// =====================================================
// MAIN
// =====================================================

const reconcileWallets =
  async () => {

    console.log(
      "=============================================="
    );

    console.log(
      "WALLET RECONCILIATION STARTED"
    );

    console.log(
      "=============================================="
    );


    // -------------------------------------------------
    // GET ALL PAID COMMISSIONS
    // -------------------------------------------------

    const commissions =
      await CommissionTransaction.find({
        status: "PAID",
      }).lean();


    console.log(
      "Paid commissions found:",
      commissions.length
    );


    // -------------------------------------------------
    // GROUP COMMISSIONS BY RECEIVER
    // -------------------------------------------------

    const commissionMap =
      new Map();


    commissions.forEach(
      (commission) => {

        const receiverId =
          String(
            commission.receiver
          );


        const amount =
          Number(
            commission.commissionAmount || 0
          );


        if (
          !receiverId ||
          !amount
        ) {

          return;

        }


        const existing =
          commissionMap.get(
            receiverId
          ) || 0;


        commissionMap.set(
          receiverId,
          existing + amount
        );

      }
    );


    console.log(
      "Users with commissions:",
      commissionMap.size
    );


    // -------------------------------------------------
    // PROCESS EACH RECEIVER
    // -------------------------------------------------

    let processed =
      0;

    let credited =
      0;

    let skipped =
      0;


    for (
      const [
        receiverId,
        paidCommission
      ]
      of commissionMap
    ) {

      processed++;


      // -----------------------------------------------
      // FIND USER
      // -----------------------------------------------

      const user =
        await User.findById(
          receiverId
        ).select(
          "name userId"
        ).lean();


      if (!user) {

        console.log(
          "User not found:",
          receiverId
        );

        skipped++;

        continue;

      }


      // -----------------------------------------------
      // FIND / CREATE WALLET
      // -----------------------------------------------

      let wallet =
        await Wallet.findOne({
          user: receiverId,
        });


      if (!wallet) {

        wallet =
          await Wallet.create({

            user:
              receiverId,

            balance:
              0,

            totalCommission:
              0,

            totalBonus:
              0,

            totalWithdrawn:
              0,

            pendingWithdrawal:
              0,

          });


        console.log(
          "Created wallet:",
          user.userId,
          user.name
        );

      }


      // -----------------------------------------------
      // CURRENT VALUES
      // -----------------------------------------------

      const currentBalance =
        Number(
          wallet.balance || 0
        );


      const currentCommission =
        Number(
          wallet.totalCommission || 0
        );


      // -----------------------------------------------
      // CALCULATE MISSING COMMISSION
      // -----------------------------------------------

      const missingCommission =
        paidCommission -
        currentCommission;


      console.log(
        "----------------------------------------------"
      );

      console.log(
        "User:",
        user.userId,
        user.name
      );

      console.log(
        "Paid Commission:",
        paidCommission
      );

      console.log(
        "Wallet Balance:",
        currentBalance
      );

      console.log(
        "Wallet Total Commission:",
        currentCommission
      );

      console.log(
        "Missing Commission:",
        missingCommission
      );


      // -----------------------------------------------
      // NOTHING TO DO
      // -----------------------------------------------

      if (
        missingCommission <= 0
      ) {

        console.log(
          "Already reconciled."
        );

        skipped++;

        continue;

      }


      // -----------------------------------------------
      // CREDIT WALLET
      // -----------------------------------------------

      wallet.balance =
        currentBalance +
        missingCommission;


      wallet.totalCommission =
        currentCommission +
        missingCommission;


      await wallet.save();


      // -----------------------------------------------
      // CREATE WALLET TRANSACTION
      // -----------------------------------------------

      await WalletTransaction.create({

        wallet:
          wallet._id,

        userId:
          receiverId,

        type:
          "CREDIT",

        amount:
          missingCommission,

        balanceAfter:
          wallet.balance,

        description:
          "Wallet reconciliation for existing paid commissions",

        reference:
          "COMMISSION_RECONCILIATION",

      });


      credited++;


      console.log(
        "CREDITED:",
        missingCommission
      );

      console.log(
        "New Balance:",
        wallet.balance
      );

    }


    // -------------------------------------------------
    // SUMMARY
    // -------------------------------------------------

    console.log(
      "=============================================="
    );

    console.log(
      "WALLET RECONCILIATION COMPLETED"
    );

    console.log(
      "=============================================="
    );

    console.log(
      "Users processed:",
      processed
    );

    console.log(
      "Wallets credited:",
      credited
    );

    console.log(
      "Users skipped:",
      skipped
    );

    console.log(
      "=============================================="
    );

  };


// =====================================================
// RUN
// =====================================================

const run =
  async () => {

    try {

      await mongoose.connect(
        MONGO_URI
      );


      console.log(
        "MongoDB Connected"
      );


      await reconcileWallets();


      await mongoose.disconnect();


      process.exit(
        0
      );

    } catch (error) {

      console.error(
        "Wallet reconciliation failed:"
      );

      console.error(
        error
      );


      try {

        await mongoose.disconnect();

      } catch (
        disconnectError
      ) {

        console.error(
          disconnectError
        );

      }


      process.exit(
        1
      );

    }

  };


run();