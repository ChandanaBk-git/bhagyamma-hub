const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth.middleware");

// All cart routes require login
router.use(protect);

// Get logged-in user's cart
router.get("/", cartController.getCart);

// Add product to cart
router.post("/", cartController.addToCart);

// Update quantity
router.put("/", cartController.updateQuantity);

// Remove one product
router.delete("/:productId", cartController.removeFromCart);

// Clear entire cart
router.delete("/", cartController.clearCart);

module.exports = router;