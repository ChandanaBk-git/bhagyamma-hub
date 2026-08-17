const mongoose = require("mongoose");

/* =========================================================
   CART ITEM
========================================================= */

const cartItemSchema =
  new mongoose.Schema(
    {
      productId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Product",

        required: true,
      },

      quantity: {
        type: Number,

        required: true,

        default: 1,

        min: 1,
      },

      price: {
        type: Number,

        required: true,

        min: 0,
      },

      total: {
        type: Number,

        default: 0,

        min: 0,
      },
    },
    {
      _id: false,
    }
  );


/* =========================================================
   CART
========================================================= */

const cartSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,

        index: true,
      },

      items: {
        type: [cartItemSchema],

        default: [],
      },

      totalAmount: {
        type: Number,

        default: 0,

        min: 0,
      },

      totalItems: {
        type: Number,

        default: 0,

        min: 0,
      },
    },

    {
      timestamps: true,
    }
  );


/* =========================================================
   CALCULATE TOTALS
========================================================= */

cartSchema.pre(
  "save",
  function () {

    this.totalItems =
      this.items.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.quantity || 0
          ),

        0
      );


    this.totalAmount =
      this.items.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.price || 0
          ) *
            Number(
              item.quantity || 0
            ),

        0
      );


    /*
    Calculate individual item totals
    */

    this.items.forEach(
      (item) => {

        item.total =
          Number(
            item.price || 0
          ) *
          Number(
            item.quantity || 0
          );

      }
    );

  }
);


/* =========================================================
   EXPORT
========================================================= */

module.exports =
  mongoose.model(
    "Cart",
    cartSchema
  );