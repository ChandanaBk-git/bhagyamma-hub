const mongoose =
  require("mongoose");


// ============================================================
// SCHEMA
// ============================================================

const commissionTransactionSchema =
  new mongoose.Schema(

    {

      // --------------------------------------------------------
      // COMMISSION RECEIVER
      // --------------------------------------------------------

      receiver: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,

      },


      // --------------------------------------------------------
      // USER WHO GENERATED THE COMMISSION
      // --------------------------------------------------------

      fromUser: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",

        required:
          true,

        index:
          true,

      },


      // --------------------------------------------------------
      // ORDER
      // --------------------------------------------------------

      order: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Order",

        default:
          null,

      },


      // --------------------------------------------------------
      // COMMISSION LEVEL
      // --------------------------------------------------------

      level: {

        type:
          Number,

        required:
          true,

        min:
          1,

      },


      // --------------------------------------------------------
      // COMMISSION PERCENTAGE
      // --------------------------------------------------------

      percentage: {

        type:
          Number,

        required:
          true,

        min:
          0,

      },


      // --------------------------------------------------------
      // ORIGINAL JOINING AMOUNT
      // --------------------------------------------------------

      joiningAmount: {

        type:
          Number,

        required:
          true,

        min:
          0,

      },


      // --------------------------------------------------------
      // COMMISSION AMOUNT
      // --------------------------------------------------------

      commissionAmount: {

        type:
          Number,

        required:
          true,

        min:
          0,

      },


      // --------------------------------------------------------
      // TYPE
      // --------------------------------------------------------

      type: {

        type:
          String,

        enum: [

          "JOINING",

          "ORDER",

          "BONUS",

          "OTHER",

        ],

        default:
          "JOINING",

      },


      // --------------------------------------------------------
      // STATUS
      // --------------------------------------------------------

      status: {

        type:
          String,

        enum: [

          "PENDING",

          "PAID",

          "CANCELLED",

          "REVERSED",

        ],

        default:
          "PENDING",

        index:
          true,

      },


      // --------------------------------------------------------
      // UNIQUE BUSINESS REFERENCE
      // --------------------------------------------------------

      referenceId: {

        type:
          String,

        default:
          null,

      },


      // --------------------------------------------------------
      // REMARKS
      // --------------------------------------------------------

      remarks: {

        type:
          String,

        default:
          "",

      },

    },

    {

      timestamps:
        true,

    }

  );


// ============================================================
// INDEXES
// ============================================================

commissionTransactionSchema.index({

  receiver:
    1,

  status:
    1,

});


commissionTransactionSchema.index({

  receiver:
    1,

  createdAt:
    -1,

});


commissionTransactionSchema.index({

  fromUser:
    1,

  createdAt:
    -1,

});


commissionTransactionSchema.index({

  referenceId:
    1,

});


// ============================================================
// MODEL
// ============================================================

const CommissionTransaction =

  mongoose.models.CommissionTransaction ||

  mongoose.model(

    "CommissionTransaction",

    commissionTransactionSchema

  );


// ============================================================
// EXPORT
// ============================================================

module.exports =
  CommissionTransaction;