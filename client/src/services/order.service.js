import api from "../api";


/* =========================================================
   CREATE ORDER
========================================================= */

export const createOrder = async (data) => {

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const isLoggedIn =
    Boolean(token);

  /*
   * Logged-in member
   *      → /orders
   *
   * Guest
   *      → /orders/guest
   */

  const endpoint =
    isLoggedIn
      ? "/orders"
      : "/orders/guest";

  const config =
    isLoggedIn
      ? {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      : {};

  try {

    console.log(
      "CREATE ORDER:",
      {
        endpoint,
        isLoggedIn,
        data,
      }
    );

    const response =
      await api.post(
        endpoint,
        data,
        config
      );

    console.log(
      "CREATE ORDER RESPONSE:",
      response.data
    );

    /*
     * IMPORTANT
     *
     * Checkout.jsx expects:
     *
     * order._id
     *
     * Backend response is:
     *
     * {
     *   success,
     *   message,
     *   data: order
     * }
     */

    return (
      response.data?.data ||
      null
    );

  } catch (error) {

    console.error(
      "CREATE ORDER ERROR:",
      error?.response?.data ||
        error
    );

    throw error;
  }
};


/* =========================================================
   MEMBER - GET MY ORDERS
========================================================= */

export const getMyOrders = async () => {

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {

    throw new Error(
      "Authentication required to view orders."
    );

  }

  try {

    const response =
      await api.get(
        "/orders/my-orders",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "MY ORDERS RESPONSE:",
      response.data
    );

    /*
     * Backend:
     *
     * {
     *   success: true,
     *   message: "...",
     *   data: [...]
     * }
     *
     * Return only the array.
     */

    return (
      response.data?.data ||
      []
    );

  } catch (error) {

    console.error(
      "GET MY ORDERS ERROR:",
      error?.response?.data ||
        error
    );

    throw error;
  }
};


/* =========================================================
   ADMIN - GET ALL ORDERS
========================================================= */

export const getAdminOrders = async () => {

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {

    throw new Error(
      "Authentication required."
    );

  }

  try {

    const response =
      await api.get(
        "/orders",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "ADMIN ORDERS RESPONSE:",
      response.data
    );

    /*
     * Returns:
     *
     * [
     *   order,
     *   order,
     *   order
     * ]
     */

    return (
      response.data?.data ||
      []
    );

  } catch (error) {

    console.error(
      "GET ADMIN ORDERS ERROR:",
      error?.response?.data ||
        error
    );

    throw error;
  }
};


/* =========================================================
   MANAGER - GET ALL ORDERS
========================================================= */

export const getManagerOrders = async () => {

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {

    throw new Error(
      "Authentication required."
    );

  }

  try {

    const response =
      await api.get(
        "/orders/manager-orders",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "MANAGER ORDERS RESPONSE:",
      response.data
    );

    return (
      response.data?.data ||
      []
    );

  } catch (error) {

    console.error(
      "GET MANAGER ORDERS ERROR:",
      error?.response?.data ||
        error
    );

    throw error;
  }
};


/* =========================================================
   GET SINGLE ORDER
========================================================= */

export const getOrderById = async (
  orderId
) => {

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {

    throw new Error(
      "Authentication required."
    );

  }

  try {

    const response =
      await api.get(
        `/orders/${orderId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "GET ORDER RESPONSE:",
      response.data
    );

    return (
      response.data?.data ||
      null
    );

  } catch (error) {

    console.error(
      "GET ORDER ERROR:",
      error?.response?.data ||
        error
    );

    throw error;
  }
};


/* =========================================================
   GUEST - GET ORDERS BY MOBILE
========================================================= */

export const getGuestOrdersByMobile =
  async (
    mobile
  ) => {

    const normalizedMobile =
      String(
        mobile || ""
      ).replace(
        /\D/g,
        ""
      );

    if (
      normalizedMobile.length !==
      10
    ) {

      throw new Error(
        "Valid 10-digit mobile number is required."
      );

    }

    try {

      const response =
        await api.get(
          `/orders/guest/mobile/${normalizedMobile}`
        );

      console.log(
        "GUEST ORDERS RESPONSE:",
        response.data
      );

      return (
        response.data?.data ||
        []
      );

    } catch (error) {

      console.error(
        "GET GUEST ORDERS ERROR:",
        error?.response?.data ||
          error
      );

      throw error;
    }
  };


/* =========================================================
   ADMIN - UPDATE PAYMENT STATUS
========================================================= */

export const updatePaymentStatus =
  async (
    orderId,
    paymentStatus
  ) => {

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {

      throw new Error(
        "Authentication required."
      );

    }

    try {

      const response =
        await api.patch(
          `/orders/${orderId}/payment-status`,
          {
            paymentStatus,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "UPDATE PAYMENT STATUS RESPONSE:",
        response.data
      );

      return (
        response.data?.data ||
        null
      );

    } catch (error) {

      console.error(
        "UPDATE PAYMENT STATUS ERROR:",
        error?.response?.data ||
          error
      );

      throw error;
    }
  };


/* =========================================================
   ADMIN - UPDATE ORDER STATUS
========================================================= */

export const updateOrderStatus =
  async (
    orderId,
    status
  ) => {

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {

      throw new Error(
        "Authentication required."
      );

    }

    try {

      const response =
        await api.patch(
          `/orders/${orderId}/status`,
          {
            status,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "UPDATE ORDER STATUS RESPONSE:",
        response.data
      );

      return (
        response.data?.data ||
        null
      );

    } catch (error) {

      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error?.response?.data ||
          error
      );

      throw error;
    }
  };