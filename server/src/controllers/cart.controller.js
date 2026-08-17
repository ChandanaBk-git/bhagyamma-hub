const cartService = require("../services/cart.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// =======================================
// Get Cart
// =======================================
const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);

//   console.log("req.user =", req.user);
// console.log("req.user.id =", req.user?.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Cart fetched successfully.",
      cart
    )

    
  );
});

// =======================================
// Add To Cart
// =======================================
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await cartService.addToCart(
    req.user.id,
    productId,
    quantity
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product added to cart successfully.",
      cart
    )
  );
});

// =======================================
// Update Quantity
// =======================================
const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await cartService.updateQuantity(
    req.user.id,
    productId,
    quantity
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Cart updated successfully.",
      cart
    )
  );
});

// =======================================
// Remove Product
// =======================================
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await cartService.removeFromCart(
    req.user.id,
    productId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product removed from cart successfully.",
      cart
    )
  );
});

// =======================================
// Clear Cart
// =======================================
const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Cart cleared successfully.",
      cart
    )
  );
});

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};