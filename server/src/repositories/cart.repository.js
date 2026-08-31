const Cart =
  require("../models/cart.model");


/* =========================================================
   FIND CART BY USER
========================================================= */

const findCartByUser = async (
  userId
) => {

  if (!userId) {
    return null;
  }

  return await Cart.findOne({
    userId,
  }).populate(
    "items.productId"
  );

};


/* =========================================================
   COMPATIBILITY METHOD
========================================================= */

const findByUser = async (
  userId
) => {

  return await findCartByUser(
    userId
  );

};


/* =========================================================
   CREATE CART
========================================================= */

const createCart = async (
  cartData
) => {

  return await Cart.create(
    cartData
  );

};


/* =========================================================
   SAVE CART
========================================================= */

const saveCart = async (
  cart
) => {

  if (!cart) {
    return null;
  }

  return await cart.save();

};


/* =========================================================
   DELETE CART
========================================================= */

const deleteCart = async (
  userId
) => {

  if (!userId) {
    return null;
  }

  return await Cart.findOneAndDelete({
    userId,
  });

};


/* =========================================================
   CLEAR CART
========================================================= */

const clearCart = async (
  userId
) => {

  if (!userId) {
    return null;
  }

  return await Cart.findOneAndUpdate(
    {
      userId,
    },

    {
      $set: {
        items: [],
        totalAmount: 0,
        totalItems: 0,
      },
    },

    {
      new: true,
      runValidators: true,
    }
  );

};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  findCartByUser,

  findByUser,

  createCart,

  saveCart,

  deleteCart,

  clearCart,

};