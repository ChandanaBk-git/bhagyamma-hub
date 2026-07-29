const cartService = require("../services/cart.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getCart = asyncHandler(async (req, res) => {

    const cart = await cartService.getCart(req.user.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Cart fetched successfully",
            cart
        )
    );
});

const addToCart = asyncHandler(async (req, res) => {

    const cart = await cartService.addToCart(
        req.user.id,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Product added to cart successfully",
            cart
        )
    );
});

const updateQuantity = asyncHandler(async (req, res) => {

    const { productId, quantity } = req.body;

    const cart = await cartService.updateQuantity(
        req.user.id,
        productId,
        quantity
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Cart updated successfully",
            cart
        )
    );
});

const removeFromCart = asyncHandler(async (req, res) => {

    const cart = await cartService.removeFromCart(
        req.user.id,
        req.params.productId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Product removed from cart successfully",
            cart
        )
    );
});

const clearCart = asyncHandler(async (req, res) => {

    const cart = await cartService.clearCart(req.user.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Cart cleared successfully",
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