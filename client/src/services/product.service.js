
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
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// =====================================================
// RETRY DELAY
// =====================================================

const wait = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

// =====================================================
// PREPARE MULTI-CATEGORY FORM DATA
// =====================================================

const prepareProductFormData = (formData) => {
  if (!(formData instanceof FormData)) {
    return formData;
  }

  const categories = formData.get("categories");

  if (Array.isArray(categories)) {
    formData.set("categories", JSON.stringify(categories));
  }

  return formData;
};

// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getProducts = async (activeOnly = true) => {
  const endpoint = activeOnly
    ? "/products?active=true"
    : "/products";

  const maxAttempts = 3;
  const retryDelays = [1000, 2000, 3000];

  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `PRODUCT API ATTEMPT ${attempt}/${maxAttempts}`
      );

      const response = await API.get(endpoint);

      console.log("PRODUCT API RESPONSE:", response.data);

      return response.data?.data || [];
    } catch (error) {
      lastError = error;

      console.error(
        `Get Products Error - Attempt ${attempt}:`,
        error.response?.data || error
      );

      if (attempt === maxAttempts) break;

      await wait(retryDelays[attempt - 1]);
    }
  }

  throw (
    lastError?.response?.data || {
      success: false,
      message: "Unable to fetch products. Please try again.",
    }
  );
};

// =====================================================
// GET PRODUCT BY ID
// =====================================================

export const getProductById = async (id) => {
  try {
    const response = await API.get(`/products/${id}`);

    return response.data?.data || null;
  } catch (error) {
    console.error("Get Product Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to fetch product.",
      }
    );
  }
};

// =====================================================
// CREATE PRODUCT
// =====================================================

export const createProduct = async (formData) => {
  try {
    const token = getToken();

    if (!token) {
      throw {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    prepareProductFormData(formData);

    const response = await API.post(
      "/products",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create Product Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to create product.",
      }
    );
  }
};

// =====================================================
// UPDATE PRODUCT
// =====================================================

// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (id, formData) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    prepareProductFormData(formData);

    console.log("UPDATE PRODUCT ID:", id);

    console.log(
      "UPDATE PRODUCT FORM DATA:",
      [...formData.entries()].map(([key, value]) => [
        key,
        value instanceof File
          ? {
              name: value.name,
              type: value.type,
              size: value.size,
            }
          : value,
      ])
    );

    const response = await API.put(
      `/products/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("UPDATE PRODUCT SUCCESS:", response.data);

    return response.data;
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    console.error("HTTP STATUS:", error.response?.status);
    console.error("BACKEND RESPONSE:", error.response?.data);
    console.error("ERROR MESSAGE:", error.message);

    throw (
      error.response?.data || {
        success: false,
        message: error.message || "Unable to update product.",
      }
    );
  }
};

// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (id) => {
  try {
    const token = getToken();

    if (!token) {
      throw {
        success: false,
        message: "Authentication token not found. Please login again.",
      };
    }

    const response = await API.delete(
      `/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Delete Product Error:", error);

    throw (
      error.response?.data || {
        success: false,
        message: "Unable to delete product.",
      }
    );
  }
};