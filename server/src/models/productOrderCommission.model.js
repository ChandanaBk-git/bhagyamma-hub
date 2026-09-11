const mongoose = require("mongoose");

/* =========================================================
   PRODUCT ORDER COMMISSION

   IMPORTANT BUSINESS RULES

   1. This model is ONLY for PRODUCT ORDER commissions.

   2. It is completely separate from the existing
      JOINING commission system.

   3. BH000002 is the fixed Manager / Contract Member.

   4. BH000002 is ALWAYS Level 1.

   5. BH000002 ALWAYS receives the fixed 50%
      product-order allocation.

   6. The remaining 30% is distributed among
      eligible upline members according to the
      product-order distribution rules.

   7. Buyer receives a 20% product discount.

   8. Buyer pays 80% of the original product amount.

   9. DELIVERY CHARGE IS NEVER INCLUDED in:

        - product discount
        - manager commission
        - upline commission
        - buyer discount calculation
        - commission percentage calculation

      Example:

        Product subtotal = ₹5,000
        Delivery          = ₹50

        Discount base     = ₹5,000
        Commission base   = ₹5,000

        NOT ₹5,050.

   10. Wallet credit is handled separately through
       the existing wallet service.
========================================================= */


/* =========================================================
   SCHEMA
========================================================= */

const productOrderCommissionSchema =
  new mongoose.Schema(
    {
      /* =====================================================
         ORDER
      ===================================================== */

      order: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Order",

        required: true,

        index: true,
      },


      /* =====================================================
         BUYER

         The member who purchased the product.
      ===================================================== */

      buyer: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },


      /* =====================================================
         COMMISSION RECEIVER

         The member receiving this particular
         product-order commission.

         Example:

         BH000002 → 50%
         Upline    → remaining allocation
      ===================================================== */

      receiver: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },


      /* =====================================================
         ORIGINAL PRODUCT AMOUNT

         IMPORTANT:

         This is the original product amount BEFORE
         the 20% member discount.

         Delivery is NOT included.

         Example:

         Product subtotal = ₹5,000
         Delivery          = ₹50

         originalAmount = ₹5,000
      ===================================================== */

      originalAmount: {
        type: Number,

        required: true,

        min: 0,
      },


      /* =====================================================
         PERCENTAGE

         Percentage allocated to this receiver.

         Examples:

         Manager:
         50

         Upline:
         15

         Buyer discount is NOT stored as a commission
         record.
      ===================================================== */

      percentage: {
        type: Number,

        required: true,

        min: 0,

        max: 100,
      },


      /* =====================================================
         COMMISSION AMOUNT

         Actual amount credited to the receiver.

         Example:

         originalAmount = ₹5,000
         percentage     = 50

         commissionAmount = ₹2,500
      ===================================================== */

      commissionAmount: {
        type: Number,

        required: true,

        min: 0,
      },


      /* =====================================================
         LEVEL

         IMPORTANT:

         Level 1 is ALWAYS BH000002 Manager.

         Example:

         BH000002 → Level 1
         Next upline → Level 2
         Next upline → Level 3
         etc.

         Level 0 is NOT used.
      ===================================================== */

      level: {
        type: Number,

        required: true,

        min: 1,
      },


      /* =====================================================
         RECEIVER TYPE

         Helps clearly identify why the receiver
         received the commission.

         MANAGER:
           Fixed BH000002 50%

         UPLINE:
           Remaining upline allocation
      ===================================================== */

      receiverType: {
        type: String,

        enum: [
          "MANAGER",
          "UPLINE",
        ],

        required: true,

        index: true,
      },


      /* =====================================================
         COMMISSION TYPE

         This is intentionally different from the
         existing JOINING commission.

         Existing system remains untouched.
      ===================================================== */

      type: {
        type: String,

        enum: [
          "PRODUCT_ORDER",
        ],

        default:
          "PRODUCT_ORDER",

        index: true,
      },


      /* =====================================================
         BUYER MEMBERSHIP STATUS

         Records whether the buyer was an active
         member when the order was processed.

         This is useful for audit/history.
      ===================================================== */

      buyerWasActiveMember: {
        type: Boolean,

        default: false,
      },


      /* =====================================================
         MANAGER IDENTIFIER

         Stores the stable business user ID of the
         manager who received the fixed 50%.

         Normally:

         BH000002
      ===================================================== */

      managerUserId: {
        type: String,

        default: "BH000002",

        trim: true,

        index: true,
      },


      /* =====================================================
         STATUS
      ===================================================== */

      status: {
        type: String,

        enum: [
          "PENDING",
          "PAID",
          "CANCELLED",
          "REVERSED",
        ],

        default: "PENDING",

        index: true,
      },


      /* =====================================================
         WALLET CREDIT STATUS

         This tracks whether this particular commission
         has already been credited to the receiver wallet.

         It prevents duplicate wallet credits.
      ===================================================== */

      walletCredited: {
        type: Boolean,

        default: false,

        index: true,
      },


      /* =====================================================
         WALLET CREDIT DATE
      ===================================================== */

      walletCreditedAt: {
        type: Date,

        default: null,
      },


      /* =====================================================
         WALLET REFERENCE

         Example:

         PRODUCT-ORDER-BHORD000001-L1
      ===================================================== */

      walletReference: {
        type: String,

        default: "",

        trim: true,
      },


      /* =====================================================
         DESCRIPTION
      ===================================================== */

      description: {
        type: String,

        default: "",

        trim: true,
      },
    },

    {
      timestamps: true,
    }
  );


/* =========================================================
   INDEXES
========================================================= */

/*
 * One product-order commission record per:
 *
 * Order
 * +
 * Receiver
 * +
 * Level
 * +
 * Type
 *
 * This protects against duplicate commission records
 * if a payment callback is received more than once.
 */

productOrderCommissionSchema.index(
  {
    order: 1,

    receiver: 1,

    level: 1,

    type: 1,
  },
  {
    unique: true,
  }
);


/* =========================================================
   ADDITIONAL INDEX

   Useful for finding all product-order commissions
   generated by a buyer.
========================================================= */

productOrderCommissionSchema.index(
  {
    buyer: 1,

    createdAt: -1,
  }
);


/* =========================================================
   ADDITIONAL INDEX

   Useful for Manager Commission page / reports.
========================================================= */

productOrderCommissionSchema.index(
  {
    receiver: 1,

    type: 1,

    createdAt: -1,
  }
);


/* =========================================================
   EXPORT
========================================================= */

module.exports =
  mongoose.model(
    "ProductOrderCommission",
    productOrderCommissionSchema
  );