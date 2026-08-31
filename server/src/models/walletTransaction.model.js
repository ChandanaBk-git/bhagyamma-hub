const mongoose =
  require("mongoose");


const walletTransactionSchema =
  new mongoose.Schema(
    {
      // =================================================
      // WALLET
      // =================================================

      wallet: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Wallet",

        required:
          true,

        index:
          true,
      },


      // =================================================
      // USER
      // =================================================

      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,
      },


      // =================================================
      // TYPE
      // =================================================

      type: {
        type:
          String,

        enum: [
          "CREDIT",
          "DEBIT",
        ],

        required:
          true,
      },


      // =================================================
      // AMOUNT
      // =================================================

      amount: {
        type:
          Number,

        required:
          true,

        min:
          0,
      },


      // =================================================
      // BALANCE AFTER
      // =================================================

      balanceAfter: {
        type:
          Number,

        required:
          true,

        min:
          0,
      },


      // =================================================
      // DESCRIPTION
      // =================================================

      description: {
        type:
          String,

        default:
          "",

        trim:
          true,
      },


      // =================================================
      // REFERENCE
      // =================================================

      reference: {
        type:
          String,

        default:
          "",

        trim:
          true,

        index:
          true,
      },

    },

    {
      timestamps:
        true,
    }

  );


// =====================================================
// DUPLICATE CREDIT PROTECTION
// =====================================================
//
// A financial CREDIT with the same reference for the
// same user represents the same financial event.
//
// Example:
//
// JOINING:ABC123:L1
//
// can exist only once for that user.
//
// Empty references are excluded because old/legacy
// transactions may legitimately have an empty reference.
//
// =====================================================

walletTransactionSchema.index(

  {
    userId:
      1,

    reference:
      1,

    type:
      1,
  },

  {
    unique:
      true,

    partialFilterExpression: {
      type: "CREDIT",

      reference: {
        $gt: "",
      },
    },
  }
);


module.exports =
  mongoose.model(
    "WalletTransaction",
    walletTransactionSchema
  );