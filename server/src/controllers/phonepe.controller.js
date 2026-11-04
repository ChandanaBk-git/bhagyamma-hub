
const crypto = require("crypto");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const PhonePeCheckoutSession = require("../models/phonePeCheckoutSession.model");
const phonepeService = require("../services/phonepe.service");
const orderService = require("../services/order.service");
const cartRepository = require("../repositories/cart.repository");

const getUserId = (user) =>
  user?._id?.toString() || user?.id?.toString() || null;

const sha256 = (value) =>
  crypto.createHash("sha256").update(String(value)).digest("hex");

const getFrontendUrl = () => {
  const value = process.env.PHONEPE_FRONTEND_URL;

  if (!value || !/^https?:\/\//i.test(value)) {
    throw new ApiError(500, "PHONEPE_FRONTEND_URL is missing or invalid");
  }

  return value.replace(/\/+$/, "");
};

const getCheckoutUrl = (payment) =>
  payment?.redirectUrl ||
  payment?.redirectURL ||
  payment?.data?.redirectUrl ||
  payment?.data?.redirectURL ||
  null;

const getTransactionId = (status) =>
  status?.paymentDetails?.find((p) => p?.transactionId)?.transactionId ||
  status?.transactionId ||
  null;

const createSession = async ({
  userId = null,
  orderData = {},
}) => {
  const quote = await orderService.getPhonePeCheckoutQuote(
    userId,
    orderData
  );

  const merchantOrderId = `BHPP_${crypto.randomBytes(16).toString("hex")}`;
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const frontendUrl = getFrontendUrl();

  const redirectUrl =
    `${frontendUrl}/payment/phonepe/callback` +
    `?merchantOrderId=${encodeURIComponent(merchantOrderId)}`;

  const session = await PhonePeCheckoutSession.create({
    merchantOrderId,
    sessionType: "PRODUCT",
    sessionTokenHash: sha256(sessionToken),
    amountPaise: quote.amountPaise,
    checkoutData: quote,
    status: "PENDING",
    expiresAt: new Date(Date.now() + 20 * 60 * 1000),
  });

  try {
    const payment = await phonepeService.createPayment({
      merchantOrderId,
      amount: quote.finalAmount,
      redirectUrl,
    });

    const checkoutUrl = getCheckoutUrl(payment);

    if (!checkoutUrl || !/^https:\/\//i.test(checkoutUrl)) {
      throw new ApiError(
        502,
        "PhonePe did not return a valid checkout URL"
      );
    }

    session.phonePeOrderId = payment?.orderId || null;
    session.phonePeState = payment?.state || "PENDING";
    await session.save();

    return {
      merchantOrderId,
      sessionToken,
      amount: quote.finalAmount,
      amountPaise: quote.amountPaise,
      redirectUrl: checkoutUrl,
      state: session.phonePeState,
    };
  } catch (error) {
    session.status = "FAILED";
    session.phonePeState = "CREATE_FAILED";
    await session.save();
    throw error;
  }
};

const createMemberPhonePeSession = asyncHandler(async (req, res) => {
  const userId = getUserId(req.user);

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const result = await createSession({
    userId,
    orderData: req.body || {},
  });

  return res.status(201).json(
    new ApiResponse(201, "PhonePe checkout session created", result)
  );
});

const createGuestPhonePeSession = asyncHandler(async (req, res) => {
  const result = await createSession({
    orderData: req.body || {},
  });

  return res.status(201).json(
    new ApiResponse(201, "Guest PhonePe checkout session created", result)
  );
});

const verifyPhonePeSession = asyncHandler(async (req, res) => {
  const merchantOrderId =
    req.params.merchantOrderId || req.body?.merchantOrderId;

  const sessionToken = req.body?.sessionToken;

  if (!merchantOrderId || !sessionToken) {
    throw new ApiError(
      400,
      "Merchant order ID and session token are required"
    );
  }

  const session = await PhonePeCheckoutSession.findOne({
    merchantOrderId,
  }).select("+sessionTokenHash +registrationData");

  if (!session || session.expiresAt <= new Date()) {
    throw new ApiError(404, "Checkout session is missing or expired");
  }

  if (session.sessionTokenHash !== sha256(sessionToken)) {
    throw new ApiError(403, "Invalid checkout session token");
  }

  if (session.sessionType !== "PRODUCT") {
    throw new ApiError(400, "Unsupported checkout session type");
  }

  if (session.status === "COMPLETED" && session.createdOrderId) {
    return res.status(200).json(
      new ApiResponse(200, "Payment already processed", {
        success: true,
        paymentStatus: "PAID",
        orderId: session.createdOrderId,
      })
    );
  }

  const phonePeStatus =
    await phonepeService.getPaymentStatus(merchantOrderId);

  const state = String(phonePeStatus?.state || "").toUpperCase();

  if (state === "COMPLETED") {
    const paidAmount = Number(phonePeStatus?.amount);

    if (
      !Number.isFinite(paidAmount) ||
      paidAmount !== Number(session.amountPaise)
    ) {
      throw new ApiError(
        409,
        "PhonePe payment amount does not match the checkout amount"
      );
    }

    const claimed = await PhonePeCheckoutSession.findOneAndUpdate(
      {
        _id: session._id,
        status: { $in: ["PENDING", "PROCESSING"] },
        createdOrderId: null,
      },
      {
        $set: {
          status: "PROCESSING",
          phonePeState: state,
          phonePeTransactionId: getTransactionId(phonePeStatus),
        },
      },
      { new: true }
    );

    if (!claimed) {
      const latest = await PhonePeCheckoutSession.findById(session._id);

      if (latest?.createdOrderId) {
        return res.status(200).json(
          new ApiResponse(200, "Payment already processed", {
            success: true,
            paymentStatus: "PAID",
            orderId: latest.createdOrderId,
          })
        );
      }

      throw new ApiError(
        409,
        "Checkout session is already being processed"
      );
    }

    try {
      const quote = session.checkoutData || {};
      let order;

      if (quote.orderType === "GUEST") {
        order = await orderService.placeGuestOrder({
          ...quote,
          items: quote.items,
          subtotal: quote.subtotal,
          discount: quote.discount,
          walletAmount: quote.walletAmount,
          deliveryCharge: quote.deliveryCharge,
          paymentMethod: "PHONEPE",
        });
      } else {
        order = await orderService.createOrder(
          String(quote.userId),
          {
            ...quote,
            paymentMethod: "PHONEPE",
          }
        );
      }

      if (
        Math.round(Number(order.finalAmount) * 100) !==
        Number(session.amountPaise)
      ) {
        throw new ApiError(
          409,
          "Created order amount differs from verified payment amount"
        );
      }

      const paidOrder = await orderService.updatePaymentStatus(
        order._id,
        "PAID",
        {
          phonePeTransactionId: getTransactionId(phonePeStatus),
          phonePeOrderId:
            phonePeStatus?.orderId ||
            session.phonePeOrderId ||
            null,
          paidAt: new Date(),
        }
      );

      session.status = "COMPLETED";
      session.phonePeState = state;
      session.phonePeTransactionId = getTransactionId(phonePeStatus);
      session.createdOrderId = paidOrder._id;
      session.completedAt = new Date();
      await session.save();

      if (quote.orderType === "MEMBER" && quote.userId) {
        await cartRepository.clearCart(String(quote.userId));
      }

      return res.status(200).json(
        new ApiResponse(200, "Payment successful", {
          success: true,
          paymentStatus: "PAID",
          orderId: paidOrder._id,
          orderNumber: paidOrder.orderNumber,
          finalAmount: Number(paidOrder.finalAmount || 0),
          transactionId: paidOrder.phonePeTransactionId || null,
        })
      );
    } catch (error) {
      // A verified payment must remain recoverable for retry/reconciliation.
      session.status = "PROCESSING";
      await session.save();
      throw error;
    }
  }

  if (
    state === "FAILED" ||
    state === "CANCELLED" ||
    state === "REJECTED"
  ) {
    session.status = "FAILED";
    session.phonePeState = state;
    await session.save();

    return res.status(200).json(
      new ApiResponse(200, "Payment was not successful", {
        success: false,
        paymentStatus: "FAILED",
        state,
      })
    );
  }

  session.phonePeState = state || "PENDING";
  await session.save();

  return res.status(200).json(
    new ApiResponse(200, "Payment is pending", {
      success: false,
      paymentStatus: "PENDING",
      state: state || "PENDING",
    })
  );
});

module.exports = {
  createMemberPhonePeSession,
  createGuestPhonePeSession,
  verifyPhonePeSession,
};
