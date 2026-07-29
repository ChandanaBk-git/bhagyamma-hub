// server/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
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

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "A maximum of 3 images is allowed.",
      },
      default: [],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);