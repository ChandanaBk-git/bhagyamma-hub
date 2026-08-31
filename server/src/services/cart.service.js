const cartRepository =
  require("../repositories/cart.repository");

const Product =
  require("../models/product");

const ApiError =
  require("../utils/ApiError");


/* =========================================================
   CONSTANTS
========================================================= */

const DELIVERY_CHARGE = 50;


/* =========================================================
   HELPERS
========================================================= */

const toIdString = (value) => {

  if (!value) {
    return "";
  }

  if (
    typeof value === "object" &&
    value._id
  ) {
    return String(value._id);
  }

  return String(value);
};


const getCartProductId = (item) => {

  if (!item) {
    return "";
  }

  return toIdString(
    item.productId
  );
};


/* =========================================================
   RECALCULATE CART
========================================================= */

const recalculateCart = (cart) => {

  if (!cart) {
    return cart;
  }

  let totalQuantity = 0;
  let subtotal = 0;


  for (
    const item of cart.items || []
  ) {

    const quantity =
      Number(
        item.quantity || 0
      );

    const price =
      Number(
        item.price || 0
      );


    item.quantity =
      quantity;

    item.price =
      price;

    item.total =
      price * quantity;


    totalQuantity +=
      quantity;

    subtotal +=
      item.total;
  }


  /*
   * Your cart model stores:
   *
   * totalAmount
   * totalItems
   *
   * Keep those fields as the
   * database source of truth.
   */

  cart.totalItems =
    totalQuantity;

  cart.totalAmount =
    subtotal;


  /*
   * Compatibility fields.
   *
   * These are useful if the frontend
   * expects subtotal / totalQuantity.
   *
   * cart.model.js may not persist these,
   * so the actual saved values remain
   * totalAmount / totalItems.
   */

  cart.subtotal =
    subtotal;

  cart.totalQuantity =
    totalQuantity;


  return cart;
};


/* =========================================================
   GET CART
========================================================= */

const getCart = async (
  userId
) => {

  if (!userId) {

    throw new ApiError(
      401,
      "Please login to access your cart."
    );
  }


  let cart =
    await cartRepository.findCartByUser(
      userId
    );


  if (!cart) {

    cart =
      await cartRepository.createCart({

        userId,

        items: [],

        totalAmount: 0,

        totalItems: 0,

      });
  }


  if (
    !Array.isArray(
      cart.items
    )
  ) {

    cart.items = [];
  }


  /*
   * Always recalculate from
   * actual cart items.
   */

  recalculateCart(
    cart
  );


  return cart;
};


/* =========================================================
   ADD TO CART
========================================================= */

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


  const numericQuantity =
    Number(quantity);


  if (
    !Number.isInteger(
      numericQuantity
    ) ||
    numericQuantity < 1
  ) {

    throw new ApiError(
      400,
      "Quantity must be at least 1."
    );
  }


  /* -------------------------------------------------------
     PRODUCT
  ------------------------------------------------------- */

  const product =
    await Product.findById(
      productId
    );


  if (!product) {

    throw new ApiError(
      404,
      "Product not found."
    );
  }


  /* -------------------------------------------------------
     PRODUCT STATUS ONLY
     
     STOCK IS INTENTIONALLY NOT CHECKED.
  ------------------------------------------------------- */

  if (
    product.status &&
    product.status !== "Active"
  ) {

    throw new ApiError(
      400,
      "Product is currently unavailable."
    );
  }


  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */

  let cart =
    await cartRepository.findCartByUser(
      userId
    );


  if (!cart) {

    cart =
      await cartRepository.createCart({

        userId,

        items: [],

        totalAmount: 0,

        totalItems: 0,

      });
  }


  if (
    !Array.isArray(
      cart.items
    )
  ) {

    cart.items = [];
  }


  /* -------------------------------------------------------
     EXISTING ITEM
  ------------------------------------------------------- */

  const existingItem =
    cart.items.find(
      (item) => {

        return (
          getCartProductId(
            item
          ) ===
          String(productId)
        );

      }
    );


  if (existingItem) {

    const currentQuantity =
      Number(
        existingItem.quantity || 0
      );


    existingItem.quantity =
      currentQuantity +
      numericQuantity;


    existingItem.price =
      Number(
        product.price || 0
      );


    existingItem.total =
      existingItem.price *
      existingItem.quantity;

  }


  /* -------------------------------------------------------
     NEW ITEM
  ------------------------------------------------------- */

  else {

    cart.items.push({

      productId:
        product._id,

      quantity:
        numericQuantity,

      price:
        Number(
          product.price || 0
        ),

      total:
        Number(
          product.price || 0
        ) *
        numericQuantity,

    });
  }


  /* -------------------------------------------------------
     RECALCULATE
  ------------------------------------------------------- */

  recalculateCart(
    cart
  );


  await cartRepository.saveCart(
    cart
  );


  return await cartRepository.findCartByUser(
    userId
  );
};


/* =========================================================
   UPDATE QUANTITY
========================================================= */

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


  if (!productId) {

    throw new ApiError(
      400,
      "Product ID is required."
    );
  }


  const numericQuantity =
    Number(quantity);


  if (
    !Number.isInteger(
      numericQuantity
    ) ||
    numericQuantity < 1
  ) {

    throw new ApiError(
      400,
      "Quantity must be at least 1."
    );
  }


  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */

  const cart =
    await cartRepository.findCartByUser(
      userId
    );


  if (!cart) {

    throw new ApiError(
      404,
      "Cart not found."
    );
  }


  if (
    !Array.isArray(
      cart.items
    ) ||
    cart.items.length === 0
  ) {

    throw new ApiError(
      404,
      "Cart is empty."
    );
  }


  /* -------------------------------------------------------
     FIND ITEM
  ------------------------------------------------------- */

  const item =
    cart.items.find(
      (cartItem) => {

        return (
          getCartProductId(
            cartItem
          ) ===
          String(productId)
        );

      }
    );


  if (!item) {

    console.error(
      "PRODUCT NOT FOUND IN CART",
      {
        userId:
          String(userId),

        requestedProductId:
          String(productId),

        cartItems:
          cart.items.map(
            (cartItem) => ({

              productId:
                getCartProductId(
                  cartItem
                ),

              quantity:
                cartItem.quantity,

            })
          ),
      }
    );


    throw new ApiError(
      404,
      "Product not found in cart."
    );
  }


  /* -------------------------------------------------------
     PRODUCT
  ------------------------------------------------------- */

  const product =
    await Product.findById(
      productId
    );


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


  /* -------------------------------------------------------
     UPDATE QUANTITY
     
     NO STOCK CHECK.
  ------------------------------------------------------- */

  item.quantity =
    numericQuantity;


  item.price =
    Number(
      product.price ||
      item.price ||
      0
    );


  item.total =
    item.price *
    item.quantity;


  /* -------------------------------------------------------
     RECALCULATE
  ------------------------------------------------------- */

  recalculateCart(
    cart
  );


  await cartRepository.saveCart(
    cart
  );


  return await cartRepository.findCartByUser(
    userId
  );
};


/* =========================================================
   REMOVE FROM CART
========================================================= */

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


  if (!productId) {

    throw new ApiError(
      400,
      "Product ID is required."
    );
  }


  const cart =
    await cartRepository.findCartByUser(
      userId
    );


  if (!cart) {

    throw new ApiError(
      404,
      "Cart not found."
    );
  }


  if (
    !Array.isArray(
      cart.items
    )
  ) {

    cart.items = [];
  }


  const originalLength =
    cart.items.length;


  cart.items =
    cart.items.filter(
      (item) => {

        return (
          getCartProductId(
            item
          ) !==
          String(productId)
        );

      }
    );


  if (
    cart.items.length ===
    originalLength
  ) {

    throw new ApiError(
      404,
      "Product not found in cart."
    );
  }


  recalculateCart(
    cart
  );


  await cartRepository.saveCart(
    cart
  );


  return await cartRepository.findCartByUser(
    userId
  );
};


/* =========================================================
   CLEAR CART
========================================================= */

const clearCart = async (
  userId
) => {

  if (!userId) {

    throw new ApiError(
      401,
      "Please login to clear your cart."
    );
  }


  return await cartRepository.clearCart(
    userId
  );
};


/* =========================================================
   DELIVERY CHARGE HELPER
========================================================= */

/*
 * Delivery is NOT stored in the cart model.
 *
 * It is a fixed ₹50 charge applied
 * when an order is created.
 *
 * Exporting the constant/helper allows
 * other services to use the same rule.
 */

const getDeliveryCharge = (
  subtotal
) => {

  const amount =
    Number(
      subtotal || 0
    );


  if (amount <= 0) {
    return 0;
  }


  return DELIVERY_CHARGE;
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  getCart,

  addToCart,

  updateQuantity,

  removeFromCart,

  clearCart,

  getDeliveryCharge,

  DELIVERY_CHARGE,

};