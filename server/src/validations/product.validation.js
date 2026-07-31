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

  body("mrp")
    .notEmpty()
    .withMessage("MRP is required")
    .isFloat({ min: 0 })
    .withMessage("MRP must be greater than or equal to 0"),

  body("sellingPrice")
    .notEmpty()
    .withMessage("Selling Price is required")
    .isFloat({ min: 0 })
    .withMessage("Selling Price must be greater than or equal to 0"),

  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Invalid status"),
];

module.exports = {
  productValidation,
};