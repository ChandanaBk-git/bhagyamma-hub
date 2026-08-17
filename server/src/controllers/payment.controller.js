const paymentService = require("../services/payment.service");
const ApiError = require("../utils/ApiError");

// =====================================================
// CREATE PAYMENT
// =====================================================

const createPayment = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const {
      orderId,
    } = req.body;

    // =================================================
    // AUTH
    // =================================================

    if (!userId) {
      throw new ApiError(
        401,
        "Authentication required."
      );
    }

    // =================================================
    // VALIDATION
    // =================================================

    if (!orderId) {
      throw new ApiError(
        400,
        "Order ID is required."
      );
    }

    // =================================================
    // CREATE PAYMENT
    // =================================================

    const result =
      await paymentService.createPayment(
        userId,
        orderId
      );

    return res.status(200).json({
      success: true,

      message:
        "Payment initiated successfully.",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// VERIFY PAYMENT
// =====================================================

const verifyPayment = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user?._id;

    const {
      orderId,
      paymentStatus,
      status,
      merchantOrderId,
      phonePeOrderId,
      transactionId,
      phonePeTransactionId,
    } = req.body;

    // =================================================
    // AUTH
    // =================================================

    if (!userId) {
      throw new ApiError(
        401,
        "Authentication required."
      );
    }

    // =================================================
    // VALIDATION
    // =================================================

    if (!orderId) {
      throw new ApiError(
        400,
        "Order ID is required."
      );
    }

    // =================================================
    // VERIFY
    // =================================================

    const result =
      await paymentService.verifyPayment(
        userId,
        orderId,
        {
          paymentStatus,
          status,

          merchantOrderId,

          phonePeOrderId,

          transactionId,

          phonePeTransactionId,
        }
      );

    return res.status(200).json({
      success:
        result.success,

      message:
        result.message,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// GET PAYMENT STATUS
// =====================================================

const getPaymentStatus = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user?._id;

    const {
      orderId,
    } = req.params;

    // =================================================
    // AUTH
    // =================================================

    if (!userId) {
      throw new ApiError(
        401,
        "Authentication required."
      );
    }

    // =================================================
    // VALIDATION
    // =================================================

    if (!orderId) {
      throw new ApiError(
        400,
        "Order ID is required."
      );
    }

    // =================================================
    // STATUS
    // =================================================

    const result =
      await paymentService.getPaymentStatus(
        userId,
        orderId
      );

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// PHONEPE CALLBACK
// =====================================================
//
// If your PhonePe integration calls a backend callback,
// use this endpoint.
//
// IMPORTANT:
// The callback must NOT depend on req.user because
// PhonePe itself may call this endpoint.
//
// You must pass the verified order/payment information
// from the PhonePe integration.
//
// =====================================================

const phonePeCallback = async (
  req,
  res,
  next
) => {
  try {
    const {
      orderId,
      paymentStatus,
      status,
      merchantOrderId,
      phonePeOrderId,
      transactionId,
      phonePeTransactionId,
      userId,
    } = req.body;

    if (!orderId) {
      throw new ApiError(
        400,
        "Order ID is required."
      );
    }

    if (!userId) {
      throw new ApiError(
        400,
        "User ID is required."
      );
    }

    const result =
      await paymentService.verifyPayment(
        userId,
        orderId,
        {
          paymentStatus,

          status,

          merchantOrderId,

          phonePeOrderId,

          transactionId,

          phonePeTransactionId,
        }
      );

    return res.status(200).json({
      success:
        result.success,

      message:
        result.message,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createPayment,
  verifyPayment,
  getPaymentStatus,
  phonePeCallback,
};