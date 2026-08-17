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

    sku: {
      type: String,
      default: "",
      trim: true,
    },

price: {
    type: Number,
    required: true,
    min: 0,
},

    images: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "Maximum 3 images are allowed.",
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