
import api from "../api";

// =====================================================
// MEMBER - CREATE PHONEPE CHECKOUT SESSION
// =====================================================

export const createPhonePePayment = async (checkoutData) => {
  if (!checkoutData || typeof checkoutData !== "object") {
    throw new Error("Checkout details are required.");
  }

  try {
    const response = await api.post(
      "/payment/phonepe/session/create",
      checkoutData
    );

    const data = response?.data?.data;

    if (
      !data?.redirectUrl ||
      !data?.merchantOrderId ||
      !data?.sessionToken
    ) {
      throw new Error(
        "PhonePe checkout session details were not returned."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "CREATE PHONEPE SESSION ERROR:",
      error?.response?.data || error
    );
    throw error;
  }
};

// =====================================================
// RETRY PHONEPE PAYMENT FOR AN EXISTING MEMBER ORDER
// =====================================================

export const retryPhonePePayment = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  try {
    const response = await api.post(
      `/payment/phonepe/orders/${encodeURIComponent(orderId)}/retry`
    );

    const data = response?.data?.data;

    if (!data?.redirectUrl || !data?.merchantOrderId) {
      throw new Error(
        "PhonePe retry checkout details were not returned."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "RETRY PHONEPE PAYMENT ERROR:",
      error?.response?.data || error
    );
    throw error;
  }
};
// =====================================================
// MEMBER - VERIFY PHONEPE CHECKOUT SESSION
// =====================================================

export const verifyPhonePePayment = async (
  merchantOrderId,
  sessionToken
) => {
  if (!merchantOrderId || !sessionToken) {
    throw new Error(
      "Merchant Order ID and session token are required."
    );
  }

  try {
    const response = await api.post(
      "/payment/phonepe/session/status",
      { merchantOrderId, sessionToken }
    );

    const data = response?.data?.data;

    if (!data) {
      throw new Error("Invalid payment verification response.");
    }

    return data;
  } catch (error) {
    console.error(
      "VERIFY PHONEPE SESSION ERROR:",
      error?.response?.data || error
    );
    throw error;
  }
};

// =====================================================
// GUEST - CREATE PHONEPE CHECKOUT SESSION
// =====================================================

export const createGuestPhonePePayment = async (checkoutData) => {
  if (!checkoutData || typeof checkoutData !== "object") {
    throw new Error("Guest checkout details are required.");
  }

  try {
    const response = await api.post(
      "/payment/phonepe/guest/session/create",
      checkoutData
    );

    const data = response?.data?.data;

    if (
      !data?.redirectUrl ||
      !data?.merchantOrderId ||
      !data?.sessionToken
    ) {
      throw new Error(
        "PhonePe guest checkout session details were not returned."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "CREATE GUEST PHONEPE SESSION ERROR:",
      error?.response?.data || error
    );
    throw error;
  }
};

// =====================================================
// GUEST - VERIFY PHONEPE CHECKOUT SESSION
// =====================================================

export const verifyGuestPhonePePayment = async (
  merchantOrderId,
  sessionToken
) => {
  if (!merchantOrderId || !sessionToken) {
    throw new Error(
      "Merchant Order ID and session token are required."
    );
  }

  try {
    const response = await api.post(
      "/payment/phonepe/session/status",
      { merchantOrderId, sessionToken }
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
      "VERIFY GUEST PHONEPE SESSION ERROR:",
      error?.response?.data || error
    );
    throw error;
  }
};

// =====================================================
// MEMBERSHIP - CREATE PHONEPE PAYMENT
// Existing membership flow preserved.
// =====================================================

export const createMembershipPhonePePayment = async () => {
  try {
    const response = await api.post(
      "/payment/membership-phonepe/create"
    );

    const data = response?.data?.data;

    if (!data?.redirectUrl || !data?.merchantOrderId) {
      throw new Error(
        "Membership PhonePe checkout details were not returned."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "CREATE MEMBERSHIP PAYMENT ERROR:",
      error?.response?.data || error
    );
    throw error;
  }
};

// =====================================================
// MEMBERSHIP - VERIFY PHONEPE PAYMENT
// Existing membership flow preserved.
// =====================================================

export const verifyMembershipPhonePePayment = async (
  merchantOrderId
) => {
  if (!merchantOrderId) {
    throw new Error("Merchant Order ID is required.");
  }

  try {
    const response = await api.get(
      `/payment/membership-phonepe/status/${encodeURIComponent(
        merchantOrderId
      )}`
    );

    const data = response?.data?.data;

    if (!data) {
      throw new Error(
        "Membership payment verification response is invalid."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "VERIFY MEMBERSHIP PAYMENT ERROR:",
      error?.response?.data || error
    );
    throw error;
  }
};
