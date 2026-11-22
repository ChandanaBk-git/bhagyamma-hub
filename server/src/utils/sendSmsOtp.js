const axios = require("axios");
const ApiError = require("./ApiError");

/**
 * Send OTP via Fast2SMS Quick SMS Route (No DLT / Sender ID required)
 * @param {string} mobile - 10-digit Indian mobile number
 * @param {string} otp - 6-digit generated OTP
 */
const sendSmsOtp = async (mobile, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    throw new ApiError(
      500,
      "SMS service is not configured. Missing FAST2SMS_API_KEY."
    );
  }

  const cleanMobile = String(mobile || "")
    .replace(/\D/g, "")
    .slice(-10);

  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    throw new ApiError(
      400,
      "Please enter a valid 10-digit Indian mobile number"
    );
  }

  const message = `Your Bhagyamma Hub password reset OTP is ${otp}. Valid for 5 minutes. Do not share this code with anyone.`;

  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message,
        language: "english",
        flash: 0,
        numbers: cleanMobile,
      },
      {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    if (!response.data || response.data.return !== true) {
      const providerMsg = Array.isArray(response.data?.message)
        ? response.data.message[0]
        : response.data?.message;

      throw new ApiError(
        502,
        providerMsg || "Failed to send SMS OTP. Please try again."
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const apiErrorMsg = Array.isArray(error?.response?.data?.message)
      ? error.response.data.message[0]
      : error?.response?.data?.message;

    throw new ApiError(
      502,
      apiErrorMsg || "Unable to send SMS OTP right now. Please try again later."
    );
  }
};

module.exports = sendSmsOtp;