const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // =================================================
    // BASIC PRODUCT INFORMATION
    // =================================================

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "Bhagyamma Hub",
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    benefits: {
      type: String,
      default: "",
      trim: true,
    },

    ingredients: {
      type: String,
      default: "",
      trim: true,
    },

    usage: {
      type: String,
      default: "",
      trim: true,
    },

    storage: {
      type: String,
      default: "",
      trim: true,
    },


    // =================================================
    // PRODUCT QUANTITY / PACK SIZE
    // =================================================

    /*
      Example:
      "100 ml"
      "500 g"
      "1 bottle"

      IMPORTANT:
      This is NOT inventory stock.
    */

    weight: {
      type: String,
      default: "",
      trim: true,
    },

    quantity: {
      type: String,
      default: "",
      trim: true,
    },


    shelfLife: {
      type: String,
      default: "",
      trim: true,
    },


    // =================================================
    // MANUFACTURING INFORMATION
    // =================================================

    manufacturer: {
      type: String,
      default: "Bhagyamma Hub",
      trim: true,
    },

    countryOfOrigin: {
      type: String,
      default: "India",
      trim: true,
    },


    // =================================================
    // SKU
    // =================================================

    sku: {
      type: String,
      default: "",
      trim: true,
    },


    // =================================================
    // PRICE
    // =================================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },


    // =================================================
    // INVENTORY STOCK
    // =================================================

    /*
      This is the actual number of units available
      for sale.

      Example:

      stock = 50

      After selling 3:

      stock = 47
    */

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },


    // =================================================
    // PRODUCT IMAGES
    // =================================================

    images: {
      type: [String],

      validate: {
        validator: function (value) {
          return value.length <= 3;
        },

        message:
          "Maximum 3 images are allowed.",
      },

      default: [],
    },


    // =================================================
    // STATUS
    // =================================================

    status: {
      type: String,

      enum: [
        "Active",
        "Inactive",
      ],

      default: "Active",
    },
  },

  {
    timestamps: true,
  }
);


module.exports =
  mongoose.model(
    "Product",
    productSchema
  );