const cartRepository = require("../repositories/cart.repository");
const productRepository = require("../repositories/product.repository");
const ApiError = require("../utils/ApiError");

const getCart = async (userId) => {

    let cart = await cartRepository.findByUser(userId);

    if (!cart) {
        cart = await cartRepository.create({
            userId,
            items: [],
            totalQuantity: 0,
            subtotal: 0,
        });
    }

    return cart;
};

const addToCart = async (userId, payload) => {

    const { productId, quantity } = payload;

    const product = await productRepository.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (!product.isActive) {
        throw new ApiError(400, "Product is inactive");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, "Insufficient stock");
    }

    let cart = await getCart(userId);

    const existingItem = cart.items.find(
        (item) => item.productId._id.toString() === productId
    );

    if (existingItem) {

        existingItem.quantity += Number(quantity);
        existingItem.total =
            existingItem.quantity * existingItem.price;

    } else {

        cart.items.push({
            productId: product._id,
            quantity: Number(quantity),
            price: product.sellingPrice,
            total: product.sellingPrice * Number(quantity),
        });

    }

    cart.totalQuantity = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.total,
        0
    );

    return await cartRepository.updateById(
        cart._id,
        {
            items: cart.items,
            totalQuantity: cart.totalQuantity,
            subtotal: cart.subtotal,
        }
    );
};

const removeFromCart = async (userId, productId) => {

    const cart = await getCart(userId);

    cart.items = cart.items.filter(
        (item) =>
            item.productId._id.toString() !== productId
    );

    cart.totalQuantity = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.total,
        0
    );

    return await cartRepository.updateById(
        cart._id,
        {
            items: cart.items,
            totalQuantity: cart.totalQuantity,
            subtotal: cart.subtotal,
        }
    );
};

const updateQuantity = async (
    userId,
    productId,
    quantity
) => {

    const cart = await getCart(userId);

    const item = cart.items.find(
        (i) =>
            i.productId._id.toString() === productId
    );

    if (!item) {
        throw new ApiError(404, "Product not found in cart");
    }

    const product = await productRepository.findById(productId);

    if (quantity > product.stock) {
        throw new ApiError(400, "Insufficient stock");
    }

    item.quantity = Number(quantity);
    item.total = item.price * Number(quantity);

    cart.totalQuantity = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.total,
        0
    );

    return await cartRepository.updateById(
        cart._id,
        {
            items: cart.items,
            totalQuantity: cart.totalQuantity,
            subtotal: cart.subtotal,
        }
    );
};

const clearCart = async (userId) => {
    return await cartRepository.clearCart(userId);
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
};