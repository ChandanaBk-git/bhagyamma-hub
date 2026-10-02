const { body } = require("express-validator");
const mongoose = require("mongoose");

const productValidation = [
  // =================================================
  // PRODUCT NAME
  // =================================================

  body("productName")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  // =================================================
  // OLD CATEGORY FIELD
  // =================================================

  body("category")
    .optional()
    .trim(),

  // =================================================
  // MULTIPLE CATEGORIES
  // =================================================

  body("categories")
    .optional()
    .custom((value) => {
      let categories = value;

      console.log("🔍 RAW CATEGORIES:", value);
      console.log("🔍 CATEGORIES TYPE:", typeof value);

      if (typeof categories === "string") {
        try {
          categories = JSON.parse(categories);
        } catch {
          throw new Error(
            "Categories must be a valid JSON array"
          );
        }
      }

      if (!Array.isArray(categories)) {
        throw new Error(
          "Categories must be an array"
        );
      }

      if (categories.length === 0) {
        throw new Error(
          "Select at least one category"
        );
      }
console.log("🔍 PARSED CATEGORIES:", categories);
      const invalidIds = categories.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidIds.length > 0) {
        throw new Error(
          "One or more category IDs are invalid"
        );
      }

      return true;
    }),

  // =================================================
  // BRAND
  // =================================================

  body("brand")
    .optional()
    .trim(),

  // =================================================
  // DESCRIPTION
  // =================================================

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("benefits").optional().trim(),

  body("ingredients").optional().trim(),

  body("usage").optional().trim(),

  body("storage").optional().trim(),

  body("weight").optional().trim(),

  body("quantity").optional().trim(),

  body("shelfLife").optional().trim(),

  body("manufacturer").optional().trim(),

  body("countryOfOrigin").optional().trim(),

  body("sku").optional().trim(),

  // =================================================
  // PRICE
  // =================================================

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage(
      "Price must be greater than or equal to 0"
    ),

  // =================================================
  // STATUS
  // =================================================

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Invalid status"),
];

module.exports = {
  productValidation,
};