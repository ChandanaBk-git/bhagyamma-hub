import API from "../api";


/* =========================================================
   GET CART
========================================================= */

export const getCart = async () => {

  const response =
    await API.get(
      "/cart"
    );

  return (
    response?.data?.data ||
    response?.data ||
    null
  );

};


/* =========================================================
   ADD TO CART
========================================================= */

export const addToCart = async (
  productId,
  quantity = 1
) => {

  if (!productId) {

    throw new Error(
      "Product ID is required."
    );

  }


  const response =
    await API.post(
      "/cart",
      {
        productId:
          String(productId),

        quantity:
          Number(quantity),
      }
    );


  return (
    response?.data?.data ||
    response?.data ||
    null
  );

};


/* =========================================================
   UPDATE CART QUANTITY
========================================================= */

export const updateCartQuantity = async (
  productId,
  quantity
) => {

  if (!productId) {

    throw new Error(
      "Product ID is required."
    );

  }


  const response =
    await API.put(
      "/cart",
      {
        productId:
          String(productId),

        quantity:
          Number(quantity),
      }
    );


  return (
    response?.data?.data ||
    response?.data ||
    null
  );

};


/* =========================================================
   REMOVE FROM CART
========================================================= */

export const removeFromCart = async (
  productId
) => {

  if (!productId) {

    throw new Error(
      "Product ID is required."
    );

  }


  const response =
    await API.delete(
      `/cart/${productId}`
    );


  return (
    response?.data?.data ||
    response?.data ||
    null
  );

};


/* =========================================================
   CLEAR CART
========================================================= */

export const clearCart = async () => {

  const response =
    await API.delete(
      "/cart"
    );


  return (
    response?.data?.data ||
    response?.data ||
    null
  );

};