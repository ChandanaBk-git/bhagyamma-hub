const { body } = require("express-validator");

const productValidation = [
  body("productName")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("brand")
    .optional()
    .trim(),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("benefits")
    .optional()
    .trim(),

  body("ingredients")
    .optional()
    .trim(),

  body("usage")
    .optional()
    .trim(),

  body("storage")
    .optional()
    .trim(),

  body("weight")
    .optional()
    .trim(),

  body("quantity")
    .optional()
    .trim(),

  body("shelfLife")
    .optional()
    .trim(),

  body("manufacturer")
    .optional()
    .trim(),

  body("countryOfOrigin")
    .optional()
    .trim(),

  body("sku")
    .optional()
    .trim(),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Invalid status"),
];

module.exports = {
  productValidation,
};