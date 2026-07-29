const { body } = require("express-validator");

const amountValidation = [
    body("amount")
        .isFloat({ min: 1 })
        .withMessage("Amount must be greater than 0"),

    body("description")
        .optional()
        .trim(),
];

module.exports = {
    amountValidation,
};