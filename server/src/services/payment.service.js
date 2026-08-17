const orderRepository = require("../repositories/order.repository");
const cartRepository = require("../repositories/cart.repository");
const ApiError = require("../utils/ApiError");

// =====================================================
// CREATE PAYMENT
// =====================================================
//
// Creates/starts payment for an existing PENDING order.
//
// IMPORTANT:
// This function does NOT:
// - award Selling Points
// - activate membership
// - distribute commission
// - clear cart
//
// Those happen only after successful payment verification.
//
// =====================================================

const createPayment = async (userId, orderId) => {
  const order = await orderRepository.findById(orderId);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  // ===================================================
  // OWNERSHIP
  // ===================================================

  if (
    order.userId?._id?.toString() !==
    userId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to pay for this order."
    );
  }

  // ===================================================
  // ALREADY PAID
  // ===================================================

  if (order.paymentStatus === "PAID") {
    throw new ApiError(
      400,
      "This order has already been paid."
    );
  }

  // ===================================================
  // CANCELLED
  // ===================================================

  if (order.status === "CANCELLED") {
    throw new ApiError(
      400,
      "Cancelled orders cannot be paid."
    );
  }

  // ===================================================
  // INVALID AMOUNT
  // ===================================================

  if (
    !order.finalAmount ||
    Number(order.finalAmount) <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid order amount."
    );
  }

  /*
   * ---------------------------------------------------
   * PHONEPE INTEGRATION
   * ---------------------------------------------------
   *
   * Keep your existing PhonePe SDK/API implementation
   * here.
   *
   * Example return structure expected by controller:
   *
   * {
   *   orderId,
   *   amount,
   *   merchantOrderId,
   *   paymentUrl
   * }
   *
   * DO NOT mark the order PAID here.
   */

  return {
    orderId: order._id,
    orderNumber: order.orderNumber,
    amount: order.finalAmount,
    paymentStatus: order.paymentStatus,
    message:
      "Payment can be initiated for this order.",
  };
};


// =====================================================
// VERIFY PAYMENT
// =====================================================
//
// This function should be called after PhonePe reports
// payment success / callback / verification.
//
// IMPORTANT:
//
// Successful payment ONLY changes:
//
// paymentStatus = PAID
//
// It does NOT award product SP.
//
// Product SP is handled later by order.service.js when
// the order reaches the configured SHIPPED/DELIVERED
// status.
//
// =====================================================

const verifyPayment = async (
  userId,
  orderId,
  paymentData = {}
) => {
  const order = await orderRepository.findById(
    orderId
  );

  if (!order) {
    throw new ApiError(
      404,
      "Order not found."
    );
  }

  // ===================================================
  // OWNERSHIP
  // ===================================================

  if (
    order.userId?._id?.toString() !==
    userId.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to verify this payment."
    );
  }

  // ===================================================
  // IDEMPOTENCY
  // ===================================================
  //
  // If PhonePe sends the callback twice, don't process
  // the payment twice.
  //
  // ===================================================

  if (order.paymentStatus === "PAID") {
    return {
      success: true,

      alreadyPaid: true,

      order: {
        ...order.toObject(),

        paymentStatus: "PAID",
      },

      message:
        "Payment was already verified.",
    };
  }

  // ===================================================
  // PAYMENT STATUS
  // ===================================================

  const paymentStatus =
    String(
      paymentData.paymentStatus ||
      paymentData.status ||
      ""
    ).toUpperCase();

  // ===================================================
  // SUCCESS
  // ===================================================

  const isSuccessful =
    paymentStatus === "SUCCESS" ||
    paymentStatus === "COMPLETED" ||
    paymentStatus === "PAID";

  // ===================================================
  // FAILED
  // ===================================================

  const isFailed =
    paymentStatus === "FAILED" ||
    paymentStatus === "FAILURE" ||
    paymentStatus === "CANCELLED";

  if (isFailed) {
    order.paymentStatus = "FAILED";

    await order.save();

    return {
      success: false,

      order: order.toObject(),

      message:
        "Payment failed.",
    };
  }

  if (!isSuccessful) {
    throw new ApiError(
      400,
      "Payment has not been confirmed as successful."
    );
  }

  // ===================================================
  // MARK ORDER PAID
  // ===================================================

  order.paymentStatus = "PAID";

  order.paidAt = new Date();

  // ===================================================
  // PHONEPE IDs
  // ===================================================

  if (paymentData.merchantOrderId) {
    order.merchantOrderId =
      paymentData.merchantOrderId;
  }

  if (paymentData.phonePeOrderId) {
    order.phonePeOrderId =
      paymentData.phonePeOrderId;
  }

  if (paymentData.transactionId) {
    order.phonePeTransactionId =
      paymentData.transactionId;
  }

  if (paymentData.phonePeTransactionId) {
    order.phonePeTransactionId =
      paymentData.phonePeTransactionId;
  }

  await order.save();

  // ===================================================
  // CLEAR CART
  // ===================================================
  //
  // Cart is cleared ONLY after successful payment.
  //
  // Product SP is NOT awarded here.
  //
  // ===================================================

  try {
    const cart =
      await cartRepository.findByUser(
        userId
      );

    if (cart) {
      cart.items = [];

      await cart.save();
    }
  } catch (cartError) {
    /*
     * Payment is already confirmed.
     *
     * Do NOT change PAID back to FAILED because of
     * a cart-clearing problem.
     *
     * Log it so it can be fixed separately.
     */

    console.error(
      "Cart clearing failed after successful payment:",
      cartError
    );
  }

  return {
    success: true,

    alreadyPaid: false,

    order: order.toObject(),

    message:
      "Payment verified successfully.",
  };
};


// =====================================================
// GET PAYMENT STATUS
// =====================================================

const getPaymentStatus = async (
  userId,
  orderId
) => {
  const order =
    await orderRepository.findById(
      orderId
    );

  if (!order) {
    throw new ApiError(
      404,
      "Order not found."
    );
  }

  // ===================================================
  // OWNERSHIP
  // ===================================================

  if (
    order.userId?._id?.toString() !==
    userId.toString()
  ) {
    throw new ApiError(
      403,
      "Unauthorized."
    );
  }

  return {
    orderId: order._id,

    orderNumber:
      order.orderNumber,

    paymentStatus:
      order.paymentStatus,

    orderStatus:
      order.status,

    amount:
      order.finalAmount,

    paidAt:
      order.paidAt,

    sellingPointsProcessed:
      order.sellingPointsProcessed || false,

    sellingPoints:
      order.sellingPoints || 0,
  };
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createPayment,
  verifyPayment,
  getPaymentStatus,
};