
import api from "../api";

// =====================================================
// MEMBER - CREATE PHONEPE PAYMENT
// =====================================================

export const createPhonePePayment = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  try {
    const response = await api.post(
      "/payment/phonepe/create",
      { orderId }
    );

    const data = response?.data?.data;

    if (!data?.redirectUrl) {
      throw new Error(
        "PhonePe checkout URL was not returned by the server."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "CREATE PHONEPE PAYMENT ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// MEMBER - VERIFY PHONEPE PAYMENT
// =====================================================

export const verifyPhonePePayment = async (merchantOrderId) => {
  if (!merchantOrderId) {
    throw new Error("Merchant Order ID is required.");
  }

  try {
    const response = await api.get(
      `/payment/phonepe/status/${encodeURIComponent(
        merchantOrderId
      )}`
    );

    const data = response?.data?.data;

    if (!data) {
      throw new Error(
        "Invalid payment verification response."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "VERIFY PHONEPE PAYMENT ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// GUEST - CREATE PHONEPE PAYMENT
// =====================================================

export const createGuestPhonePePayment = async (
  orderId,
  guestPaymentToken
) => {
  if (!orderId || !guestPaymentToken) {
    throw new Error(
      "Order ID and guest payment token are required."
    );
  }

  try {
    const response = await api.post(
      "/payment/phonepe/guest/create",
      {
        orderId,
        guestPaymentToken,
      }
    );

    const data = response?.data?.data;

    if (!data?.redirectUrl || !data?.merchantOrderId) {
      throw new Error(
        "PhonePe guest checkout details were not returned."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "CREATE GUEST PHONEPE PAYMENT ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// GUEST - VERIFY PHONEPE PAYMENT
// =====================================================

export const verifyGuestPhonePePayment = async (
  merchantOrderId,
  guestPaymentToken
) => {
  if (!merchantOrderId || !guestPaymentToken) {
    throw new Error(
      "Merchant Order ID and guest payment token are required."
    );
  }

  try {
    const response = await api.post(
      "/payment/phonepe/guest/status",
      {
        merchantOrderId,
        guestPaymentToken,
      }
    );

    const data = response?.data?.data;

    if (!data) {
      throw new Error(
        "Invalid guest payment verification response."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "VERIFY GUEST PHONEPE PAYMENT ERROR:",
      error?.response?.data || error
    );

    throw error;
  }
};
