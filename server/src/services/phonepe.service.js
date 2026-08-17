const axios = require("axios");

/*
|--------------------------------------------------------------------------
| PhonePe Environment
|--------------------------------------------------------------------------
|
| Keep SANDBOX while developing.
| Change to PRODUCTION only after your merchant account is approved.
|
*/

const isProduction =
  process.env.PHONEPE_ENV === "PRODUCTION";

/*
|--------------------------------------------------------------------------
| PhonePe URLs
|--------------------------------------------------------------------------
*/

const BASE_URL = isProduction
  ? "https://api.phonepe.com/apis/pg"
  : "https://api-preprod.phonepe.com/apis/pg-sandbox";

const AUTH_URL = isProduction
  ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
  : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

/*
|--------------------------------------------------------------------------
| Get PhonePe Access Token
|--------------------------------------------------------------------------
*/

const getAccessToken = async () => {
  try {
    const params = new URLSearchParams();

    params.append(
      "client_id",
      process.env.PHONEPE_CLIENT_ID
    );

    params.append(
      "client_version",
      process.env.PHONEPE_CLIENT_VERSION || "1"
    );

    params.append(
      "client_secret",
      process.env.PHONEPE_CLIENT_SECRET
    );

    params.append(
      "grant_type",
      "client_credentials"
    );

    const response = await axios.post(
      AUTH_URL,
      params.toString(),
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken =
      response.data?.access_token;

    if (!accessToken) {
      console.error(
        "PhonePe authentication response:",
        response.data
      );

      throw new Error(
        "PhonePe access token was not received"
      );
    }

    return accessToken;
  } catch (error) {
    console.error(
      "PhonePe authentication error:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      "Unable to authenticate with PhonePe"
    );
  }
};

/*
|--------------------------------------------------------------------------
| Create PhonePe Payment
|--------------------------------------------------------------------------
*/

const createPayment = async ({
  merchantOrderId,
  amount,
  redirectUrl,
}) => {
  if (!merchantOrderId) {
    throw new Error(
      "Merchant order ID is required"
    );
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error(
      "Valid payment amount is required"
    );
  }

  if (!redirectUrl) {
    throw new Error(
      "Payment redirect URL is required"
    );
  }

  const accessToken =
    await getAccessToken();

  /*
   * PhonePe expects amount in paise.
   *
   * Example:
   *
   * ₹100     → 10000
   * ₹1250.50 → 125050
   */

  const amountInPaise =
    Math.round(Number(amount) * 100);

  const payload = {
    merchantOrderId,

    amount: amountInPaise,

    expireAfter: 1200,

    paymentFlow: {
      type: "PG_CHECKOUT",

      merchantUrls: {
        redirectUrl,
      },
    },
  };

  try {
    const response =
      await axios.post(
        `${BASE_URL}/checkout/v2/pay`,
        payload,
        {
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `O-Bearer ${accessToken}`,
          },
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "PhonePe create payment error:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Unable to create PhonePe payment"
    );
  }
};

/*
|--------------------------------------------------------------------------
| Get PhonePe Payment Status
|--------------------------------------------------------------------------
*/

const getPaymentStatus = async (
  merchantOrderId
) => {
  if (!merchantOrderId) {
    throw new Error(
      "Merchant order ID is required"
    );
  }

  const accessToken =
    await getAccessToken();

  try {
    const response =
      await axios.get(
        `${BASE_URL}/checkout/v2/order/${encodeURIComponent(
          merchantOrderId
        )}/status`,
        {
          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `O-Bearer ${accessToken}`,
          },

          params: {
            details: "true",
          },
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      "PhonePe payment status error:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data?.message ||
        "Unable to verify PhonePe payment"
    );
  }
};

module.exports = {
  getAccessToken,
  createPayment,
  getPaymentStatus,
};