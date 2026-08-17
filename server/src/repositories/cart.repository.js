const Cart =
  require("../models/cart.model");


/* =========================================================
   FIND CART BY USER
========================================================= */

const findCartByUser =
  async (
    userId
  ) => {

    return await Cart.findOne({
      userId,
    }).populate(
      "items.productId"
    );

  };


/* =========================================================
   COMPATIBILITY METHOD
========================================================= */

const findByUser =
  async (
    userId
  ) => {

    return await findCartByUser(
      userId
    );

  };


/* =========================================================
   CREATE CART
========================================================= */

const createCart =
  async (
    cartData
  ) => {

    return await Cart.create(
      cartData
    );

  };


/* =========================================================
   SAVE CART
========================================================= */

const saveCart =
  async (
    cart
  ) => {

    return await cart.save();

  };


/* =========================================================
   DELETE CART
========================================================= */

const deleteCart =
  async (
    userId
  ) => {

    return await Cart.findOneAndDelete(
      {
        userId,
      }
    );

  };


/* =========================================================
   CLEAR CART
========================================================= */

const clearCart =
  async (
    userId
  ) => {

    return await Cart.findOneAndUpdate(
      {
        userId,
      },

      {
        $set: {
          items: [],

          totalItems: 0,

          totalAmount: 0,
        },
      },

      {
        new: true,
      }
    );

  };


module.exports = {

  findCartByUser,

  findByUser,

  createCart,

  saveCart,

  deleteCart,

  clearCart,

};