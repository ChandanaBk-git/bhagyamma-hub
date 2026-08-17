import api from "../api";

// =====================================================
// CREATE PHONEPE PAYMENT
// =====================================================

export const createPhonePePayment = async (orderId) => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  try {
    const response = await api.post(
      "/payment/phonepe/create",
      {
        orderId,
      }
    );

    const data =
      response?.data?.data;

    if (!data) {
      throw new Error(
        "Invalid payment response from server."
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
// VERIFY PHONEPE PAYMENT
// =====================================================

export const verifyPhonePePayment = async (
  merchantOrderId
) => {
  if (!merchantOrderId) {
    throw new Error(
      "Merchant Order ID is required."
    );
  }

  try {
    const response = await api.get(
      `/payment/phonepe/verify/${encodeURIComponent(
        merchantOrderId
      )}`
    );

    const data =
      response?.data?.data;

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