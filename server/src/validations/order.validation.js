const {
  body,
} = require("express-validator");

/* ==========================================
   UPDATE ORDER STATUS
========================================== */

const updateOrderStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage(
      "Status is required"
    )

    .isIn([
      "PLACED",
      "CONFIRMED",
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ])

    .withMessage(
      "Invalid order status"
    ),
];

/* ==========================================
   GUEST ORDER
========================================== */

const guestOrderValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "Customer name is required"
    ),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage(
      "Mobile number is required"
    )

    .matches(
      /^[0-9]{10}$/
    )

    .withMessage(
      "Mobile number must contain exactly 10 digits"
    ),

  body("email")
    .optional({
      checkFalsy: true,
    })

    .trim()

    .isEmail()

    .withMessage(
      "Please enter a valid email address"
    ),

  body("address")
    .trim()
    .notEmpty()
    .withMessage(
      "Delivery address is required"
    ),

  body("city")
    .trim()
    .notEmpty()
    .withMessage(
      "City is required"
    ),

  body("state")
    .trim()
    .notEmpty()
    .withMessage(
      "State is required"
    ),

  body("pincode")
    .trim()
    .matches(
      /^[0-9]{6}$/
    )
    .withMessage(
      "Pincode must contain exactly 6 digits"
    ),

  body("items")
    .isArray({
      min: 1,
    })
    .withMessage(
      "At least one cart item is required"
    ),

  body("items.*.productId")
    .notEmpty()
    .withMessage(
      "Product ID is required"
    ),

  body("items.*.quantity")
    .isInt({
      min: 1,
    })
    .withMessage(
      "Product quantity must be at least 1"
    ),
];

module.exports = {
  updateOrderStatusValidation,

  guestOrderValidation,
};