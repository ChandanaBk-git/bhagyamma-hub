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
// RETRY DELAY
// =====================================================

const wait = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};


// =====================================================
// GET ALL PRODUCTS
// =====================================================

export const getProducts = async (
  activeOnly = true
) => {

  const endpoint = activeOnly
    ? "/products?active=true"
    : "/products";


  // ===================================================
  // RETRY SETTINGS
  // ===================================================

  const maxAttempts = 3;

  const retryDelays = [
    1000,
    2000,
    3000,
  ];


  let lastError = null;


  // ===================================================
  // TRY API REQUEST
  // ===================================================

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt++
  ) {

    try {

      console.log(
        `PRODUCT API ATTEMPT ${attempt}/${maxAttempts}`
      );


      const response =
        await API.get(endpoint);


      console.log(
        "PRODUCT API RESPONSE:",
        response.data
      );


      const products =
        response.data?.data || [];


      // ===============================================
      // SUCCESS
      // ===============================================

      return products;

    } catch (error) {

      lastError = error;


      console.error(
        `Get Products Error - Attempt ${attempt}:`,
        error.response?.data || error
      );


      // =============================================
      // IF LAST ATTEMPT, THROW ERROR
      // =============================================

      if (
        attempt === maxAttempts
      ) {

        break;

      }


      // =============================================
      // WAIT BEFORE RETRY
      // =============================================

      await wait(
        retryDelays[
          attempt - 1
        ]
      );

    }

  }


  // ===================================================
  // ALL ATTEMPTS FAILED
  // ===================================================

  throw (
    lastError?.response?.data || {
      success: false,
      message:
        "Unable to fetch products. Please try again.",
    }
  );

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

    const token =
      getToken();


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

    const token =
      getToken();


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

    const token =
      getToken();


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