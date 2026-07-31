const { body } = require("express-validator");

const updateOrderStatusValidation = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn([
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ])
        .withMessage("Invalid status"),
];

module.exports = {
    updateOrderStatusValidation,
};