const { body } = require("express-validator");

const categoryValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Category name must be between 3 and 50 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("image")
        .optional()
        .trim()
        .isURL()
        .withMessage("Image must be a valid URL"),

    body("parentCategory")
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage("Invalid parent category ID"),
];

module.exports = {
    categoryValidation,
};