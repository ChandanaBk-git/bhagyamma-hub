import API from "../api";

// =====================================================
// GET CART
// =====================================================

export const getCart = async () => {
  try {
    const response = await API.get("/cart");

    return response.data.data;
  } catch (error) {
    console.error(
      "GET CART ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// ADD TO CART
// =====================================================

export const addToCart = async (
  productId,
  quantity = 1
) => {
  try {
    if (!productId) {
      throw new Error(
        "Product ID is required"
      );
    }

    const response = await API.post(
      "/cart",
      {
        productId,
        quantity,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "ADD TO CART ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// UPDATE CART QUANTITY
// =====================================================

export const updateCartQuantity = async (
  productId,
  quantity
) => {
  try {
    const response = await API.put(
      "/cart",
      {
        productId,
        quantity,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "UPDATE CART ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// REMOVE FROM CART
// =====================================================

export const removeFromCart = async (
  productId
) => {
  try {
    const response = await API.delete(
      `/cart/${productId}`
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "REMOVE CART ITEM ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// CLEAR CART
// =====================================================

export const clearCart = async () => {
  try {
    const response = await API.delete(
      "/cart"
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "CLEAR CART ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};