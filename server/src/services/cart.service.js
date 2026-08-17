const cartRepository = require("../repositories/cart.repository");
const Product = require("../models/product");
const ApiError = require("../utils/ApiError");

const getCart = async (userId) => {
  if (!userId) {
    throw new ApiError(401, "Please login to access your cart.");
  }

  let cart = await cartRepository.findCartByUser(userId);

  if (!cart) {
    cart = await cartRepository.createCart({
      userId,
      items: [],
      totalQuantity: 0,
      subtotal: 0,
    });
  }

  return cart;
};

const addToCart = async (
  userId,
  productId,
  quantity = 1
) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Please login or register before adding products to cart."
    );
  }

  if (!productId) {
    throw new ApiError(
      400,
      "Product ID is required."
    );
  }

  const numericQuantity = Number(quantity);

  if (
    !Number.isInteger(numericQuantity) ||
    numericQuantity < 1
  ) {
    throw new ApiError(
      400,
      "Quantity must be at least 1."
    );
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  if (
    product.status &&
    product.status !== "Active"
  ) {
    throw new ApiError(
      400,
      "Product is currently unavailable."
    );
  }

  let cart =
    await cartRepository.findCartByUser(userId);

  if (!cart) {
    cart =
      await cartRepository.createCart({
        userId,
        items: [],
        totalQuantity: 0,
        subtotal: 0,
      });
  }

  const existingItem =
    cart.items.find((item) => {
      const existingProductId =
        item.productId?._id?.toString() ||
        item.productId?.toString();

      return (
        existingProductId === productId.toString()
      );
    });

  if (existingItem) {
    existingItem.quantity += numericQuantity;

    existingItem.total =
      existingItem.price *
      existingItem.quantity;
  } else {
    cart.items.push({
      productId: product._id,
      quantity: numericQuantity,
      price: Number(product.price) || 0,
      total:
        (Number(product.price) || 0) *
        numericQuantity,
    });
  }

  cart.totalQuantity =
    cart.items.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );

  cart.subtotal =
    cart.items.reduce(
      (sum, item) =>
        sum + Number(item.total || 0),
      0
    );

  await cartRepository.saveCart(cart);

  return await cartRepository.findCartByUser(
    userId
  );
};

const updateQuantity = async (
  userId,
  productId,
  quantity
) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Please login to update your cart."
    );
  }

  const numericQuantity = Number(quantity);

  if (
    !Number.isInteger(numericQuantity) ||
    numericQuantity < 1
  ) {
    throw new ApiError(
      400,
      "Quantity must be at least 1."
    );
  }

  const cart =
    await cartRepository.findCartByUser(userId);

  if (!cart) {
    throw new ApiError(
      404,
      "Cart not found."
    );
  }

  const item =
    cart.items.find((item) => {
      const id =
        item.productId?._id?.toString() ||
        item.productId?.toString();

      return id === productId.toString();
    });

  if (!item) {
    throw new ApiError(
      404,
      "Product not found in cart."
    );
  }

  const product =
    await Product.findById(productId);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found."
    );
  }

  if (
    product.stock !== undefined &&
    numericQuantity > product.stock
  ) {
    throw new ApiError(
      400,
      "Insufficient stock."
    );
  }

  item.quantity = numericQuantity;

  item.total =
    item.price * numericQuantity;

  cart.totalQuantity =
    cart.items.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );

  cart.subtotal =
    cart.items.reduce(
      (sum, item) =>
        sum + Number(item.total || 0),
      0
    );

  await cartRepository.saveCart(cart);

  return await cartRepository.findCartByUser(
    userId
  );
};

const removeFromCart = async (
  userId,
  productId
) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Please login to modify your cart."
    );
  }

  const cart =
    await cartRepository.findCartByUser(userId);

  if (!cart) {
    throw new ApiError(
      404,
      "Cart not found."
    );
  }

  cart.items =
    cart.items.filter((item) => {
      const id =
        item.productId?._id?.toString() ||
        item.productId?.toString();

      return id !== productId.toString();
    });

  cart.totalQuantity =
    cart.items.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );

  cart.subtotal =
    cart.items.reduce(
      (sum, item) =>
        sum + Number(item.total || 0),
      0
    );

  await cartRepository.saveCart(cart);

  return await cartRepository.findCartByUser(
    userId
  );
};

const clearCart = async (userId) => {
  if (!userId) {
    throw new ApiError(
      401,
      "Please login to clear your cart."
    );
  }

  const cart =
    await cartRepository.findCartByUser(userId);

  if (!cart) {
    return null;
  }

  cart.items = [];
  cart.totalQuantity = 0;
  cart.subtotal = 0;

  await cartRepository.saveCart(cart);

  return cart;
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};