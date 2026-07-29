const express = require("express");

const router = express.Router();

const controller = require("../controllers/cart.controller");

const { protect } = require("../middleware/auth.middleware");

const validate = require("../middleware/validate.middleware");

const {
    addToCartValidation,
    updateCartValidation,
} = require("../validations/cart.validation");
console.log({
    protect: typeof protect,
    validate: typeof validate,
    addToCartValidation,
    updateCartValidation,
    getCart: typeof controller.getCart,
    addToCart: typeof controller.addToCart,
    updateQuantity: typeof controller.updateQuantity,
    removeFromCart: typeof controller.removeFromCart,
    clearCart: typeof controller.clearCart,
});
router.get(
    "/",
    protect,
    controller.getCart
);

router.post(
    "/",
    protect,
    addToCartValidation,
    validate,
    controller.addToCart
);

router.put(
    "/",
    protect,
    updateCartValidation,
    validate,
    controller.updateQuantity
);

router.delete(
    "/:productId",
    protect,
    controller.removeFromCart
);

router.delete(
    "/",
    protect,
    controller.clearCart
);

module.exports = router;