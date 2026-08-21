import API from "../api";

// =====================================================
// GET AUTH TOKEN
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};


// =====================================================
// AUTH HEADERS
// =====================================================

const getAuthHeaders = () => {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================
export const getProducts = async (activeOnly = true) => {
  try {
    const endpoint = activeOnly
      ? "/products?active=true"
      : "/products";

    const response = await API.get(endpoint);

    console.log(
      "PRODUCT API RESPONSE:",
      response.data
    );

    return response.data?.data || [];

  } catch (error) {
    console.error(
      "Get Products Error:",
      error.response?.data || error
    );

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch products.",
      }
    );
  }
};

// =====================================================
// GET PRODUCT BY ID
// =====================================================

export const getProductById = async (
  id
) => {

  try {

    const response =
      await API.get(
        `/products/${id}`
      );

    return (
      response.data?.data ||
      null
    );

  } catch (error) {

    console.error(
      "Get Product Error:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to fetch product.",
      }
    );

  }

};


// =====================================================
// CREATE PRODUCT
// =====================================================

export const createProduct = async (
  formData
) => {

  try {

    const token = getToken();

    if (!token) {

      throw {
        success: false,
        message:
          "Authentication token not found. Please login again.",
      };

    }

    const response =
      await API.post(
        "/products",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;

  } catch (error) {

    console.error(
      "Create Product Error:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to create product.",
      }
    );

  }

};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (
  id,
  formData
) => {

  try {

    const token = getToken();

    if (!token) {

      throw {
        success: false,
        message:
          "Authentication token not found. Please login again.",
      };

    }

    const response =
      await API.put(
        `/products/${id}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;

  } catch (error) {

    console.error(
      "Update Product Error:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to update product.",
      }
    );

  }

};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (
  id
) => {

  try {

    const token = getToken();

    if (!token) {

      throw {
        success: false,
        message:
          "Authentication token not found. Please login again.",
      };

    }

    const response =
      await API.delete(
        `/products/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;

  } catch (error) {

    console.error(
      "Delete Product Error:",
      error
    );

    throw (
      error.response?.data || {
        success: false,
        message:
          "Unable to delete product.",
      }
    );

  }

};