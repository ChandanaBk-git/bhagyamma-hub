
const crypto = require("crypto");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const orderRepository = require("../repositories/order.repository");
const cartRepository = require("../repositories/cart.repository");
const phonepeService = require("../services/phonepe.service");
const orderService = require("../services/order.service");

/* =====================================================
   HELPERS
===================================================== */

const getUserId = (user) => {
  return user?._id?.toString() || user?.id?.toString() || null;
};

const getOrderUserId = (order) => {
  const userId = order?.userId?._id || order?.userId;
  return userId?.toString?.() || null;
};

const hashGuestToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(String(token))
    .digest("hex");
};

const getTransactionId = (paymentStatus) => {
  return (
    paymentStatus?.paymentDetails?.find(
      (payment) => payment?.transactionId
    )?.transactionId ||
    paymentStatus?.transactionId ||
    null
  );
};

const getPhonePeOrderId = (paymentStatus) => {
  return paymentStatus?.orderId || null;
};

const getCheckoutUrl = (payment) => {
  return (
    payment?.redirectUrl ||
    payment?.redirectURL ||
    payment?.data?.redirectUrl ||
    payment?.data?.redirectURL ||
    null
  );
};

const getFrontendUrl = () => {
  const frontendUrl = process.env.PHONEPE_FRONTEND_URL;

  if (!frontendUrl || !/^https?:\/\//i.test(frontendUrl)) {
    throw new ApiError(
      500,
      "PHONEPE_FRONTEND_URL is missing or invalid"
    );
  }

  return frontendUrl.replace(/\/+$/, "");
};

const validateOrderForPayment = (order) => {
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.paymentStatus === "PAID") {
    throw new ApiError(409, "This order is already paid");
  }

  if (order.status === "CANCELLED") {
    throw new ApiError(
      400,
      "Payment cannot be initiated for a cancelled order"
    );
  }

  const amount = Number(order.finalAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(400, "Invalid order payment amount");
  }

  return amount;
};

/* =====================================================
   CREATE PHONEPE CHECKOUT
===================================================== */

const createPhonePeCheckout = async (order) => {
  const amount = validateOrderForPayment(order);
  const frontendUrl = getFrontendUrl();

  const merchantOrderId =
    order.merchantOrderId ||
    `PP_${order.orderNumber}_${Date.now()}`;

  await orderRepository.updatePaymentDetails(order._id, {
    merchantOrderId,
    paymentMethod: "PHONEPE",
  });

  const redirectUrl =
    `${frontendUrl}/payment/phonepe/callback` +
    `?merchantOrderId=${encodeURIComponent(merchantOrderId)}`;

  const payment = await phonepeService.createPayment({
    merchantOrderId,
    amount,
    redirectUrl,
  });

  const checkoutUrl = getCheckoutUrl(payment);

  if (!checkoutUrl || !/^https:\/\//i.test(checkoutUrl)) {
    throw new ApiError(
      502,
      "PhonePe did not return a valid checkout URL"
    );
  }

  await orderRepository.updatePaymentDetails(order._id, {
    merchantOrderId,
    phonePeOrderId: payment?.orderId || null,
    paymentMethod: "PHONEPE",
  });

  return {
    orderId: order._id,
    merchantOrderId,
    phonePeOrderId: payment?.orderId || null,
    redirectUrl: checkoutUrl,
    state: payment?.state || "PENDING",
  };
};

/* =====================================================
   MEMBER - CREATE PHONEPE PAYMENT
===================================================== */

const createPhonePePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body || {};

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const order = await orderRepository.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const authenticatedUserId = getUserId(req.user);
  const orderUserId = getOrderUserId(order);

  if (
    !authenticatedUserId ||
    !orderUserId ||
    authenticatedUserId !== orderUserId
  ) {
    throw new ApiError(403, "Unauthorized order");
  }

  if (order.orderType === "GUEST") {
    throw new ApiError(
      403,
      "Use the guest payment endpoint for guest orders"
    );
  }

  const result = await createPhonePeCheckout(order);

  return res.status(200).json(
    new ApiResponse(200, "PhonePe payment created", result)
  );
});

/* =====================================================
   GUEST - CREATE PHONEPE PAYMENT
===================================================== */

const createGuestPhonePePayment = asyncHandler(async (req, res) => {
  const { orderId, guestPaymentToken } = req.body || {};

  if (!orderId || !guestPaymentToken) {
    throw new ApiError(
      400,
      "Order ID and guest payment token are required"
    );
  }

  const tokenHash = hashGuestToken(guestPaymentToken);

  const order =
    await orderRepository.findGuestOrderByPaymentTokenHash(
      tokenHash
    );

  if (!order || String(order._id) !== String(orderId)) {
    throw new ApiError(
      403,
      "Invalid or expired guest payment access"
    );
  }

  const result = await createPhonePeCheckout(order);

  return res.status(200).json(
    new ApiResponse(200, "Guest PhonePe payment created", result)
  );
});

/* =====================================================
   COMMON - VERIFY PAYMENT WITH PHONEPE
===================================================== */

const verifyPaymentWithPhonePe = async (order) => {
  if (order.paymentStatus === "PAID") {
    return {
      success: true,
      paymentStatus: "PAID",
      orderId: order._id,
      orderStatus: order.status,
      transactionId: order.phonePeTransactionId || null,
    };
  }

  if (!order.merchantOrderId) {
    throw new ApiError(400, "Merchant order ID is missing");
  }

  // The authoritative status comes from PhonePe.
  const phonePeStatus =
    await phonepeService.getPaymentStatus(order.merchantOrderId);

  const state = String(
    phonePeStatus?.state || ""
  ).toUpperCase();

  if (state === "COMPLETED") {
    const paidAmount = Number(phonePeStatus?.amount);
    const expectedAmountInPaise = Math.round(
      Number(order.finalAmount) * 100
    );

    // Require an amount from PhonePe and match it to the saved order.
    if (
      !Number.isFinite(paidAmount) ||
      paidAmount <= 0 ||
      paidAmount !== expectedAmountInPaise
    ) {
      throw new ApiError(
        409,
        "PhonePe payment amount is missing or does not match the order amount"
      );
    }

    const transactionId = getTransactionId(phonePeStatus);
    const phonePeOrderId = getPhonePeOrderId(phonePeStatus);

    // Use the existing service so established SP and commission
    // processing continues after the payment is confirmed.
    const paidOrder = await orderService.updatePaymentStatus(
      order._id,
      "PAID",
      {
        phonePeTransactionId: transactionId,
        phonePeOrderId,
        paidAt: new Date(),
      }
    );

    if (paidOrder?.paymentStatus !== "PAID") {
      throw new ApiError(
        500,
        "PhonePe confirmed payment, but the order could not be updated"
      );
    }

    return {
      success: true,
      paymentStatus: "PAID",
      orderId: paidOrder._id,
      orderStatus: paidOrder.status,
      transactionId:
        paidOrder.phonePeTransactionId || transactionId,
    };
  }

  if (state === "FAILED" || state === "CANCELLED") {
    await orderRepository.markPaymentFailed(order._id);

    const latestOrder = await orderRepository.findById(order._id);

    // Do not report failure if a concurrent verification succeeded.
    if (latestOrder?.paymentStatus === "PAID") {
      return {
        success: true,
        paymentStatus: "PAID",
        orderId: latestOrder._id,
        orderStatus: latestOrder.status,
        transactionId: latestOrder.phonePeTransactionId || null,
      };
    }

    return {
      success: false,
      paymentStatus: latestOrder?.paymentStatus || "FAILED",
      state,
      orderId: order._id,
    };
  }

  return {
    success: false,
    paymentStatus: "PENDING",
    state: state || "PENDING",
    orderId: order._id,
  };
};

/* =====================================================
   MEMBER - VERIFY PHONEPE PAYMENT
===================================================== */

const verifyPhonePePayment = asyncHandler(async (req, res) => {
  const { merchantOrderId } = req.params;

  if (!merchantOrderId) {
    throw new ApiError(400, "Merchant order ID is required");
  }

  const order =
    await orderRepository.findByMerchantOrderId(merchantOrderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const authenticatedUserId = getUserId(req.user);
  const orderUserId = getOrderUserId(order);

  if (
    !authenticatedUserId ||
    !orderUserId ||
    authenticatedUserId !== orderUserId
  ) {
    throw new ApiError(403, "Unauthorized order");
  }

  if (order.orderType === "GUEST") {
    throw new ApiError(
      403,
      "Use the guest payment verification endpoint"
    );
  }

  const result = await verifyPaymentWithPhonePe(order);

  if (result.paymentStatus === "PAID") {
    await cartRepository.clearCart(authenticatedUserId);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      result.success
        ? "Payment successful"
        : result.paymentStatus === "PENDING"
          ? "Payment is still pending"
          : "Payment was not successful",
      result
    )
  );
});

/* =====================================================
   GUEST - VERIFY PHONEPE PAYMENT
===================================================== */

const verifyGuestPhonePePayment = asyncHandler(async (req, res) => {
  const { merchantOrderId, guestPaymentToken } = req.body || {};

  if (!merchantOrderId || !guestPaymentToken) {
    throw new ApiError(
      400,
      "Merchant order ID and guest payment token are required"
    );
  }

  const tokenHash = hashGuestToken(guestPaymentToken);

  const order =
    await orderRepository.findGuestOrderByPaymentTokenHash(
      tokenHash
    );

  if (
    !order ||
    order.merchantOrderId !== merchantOrderId
  ) {
    throw new ApiError(
      403,
      "Invalid or expired guest payment access"
    );
  }

  const result = await verifyPaymentWithPhonePe(order);

  return res.status(200).json(
    new ApiResponse(
      200,
      result.success
        ? "Payment successful"
        : result.paymentStatus === "PENDING"
          ? "Payment is still pending"
          : "Payment was not successful",
      result
    )
  );
});

module.exports = {
  createPhonePePayment,
  verifyPhonePePayment,
  createGuestPhonePePayment,
  verifyGuestPhonePePayment,
};
