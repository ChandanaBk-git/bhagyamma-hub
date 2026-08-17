const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const orderRepository = require("../repositories/order.repository");
const cartRepository = require("../repositories/cart.repository");

const phonepeService = require("../services/phonepe.service");

/* ==========================================
   Create PhonePe Payment
========================================== */

const createPhonePePayment =
  asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
      throw new ApiError(
        400,
        "Order ID is required"
      );
    }

    const order =
      await orderRepository.findById(
        orderId
      );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    /* Security: order must belong to user */

    if (
      order.userId?._id?.toString() !==
      req.user.id.toString()
    ) {
      throw new ApiError(
        403,
        "Unauthorized order"
      );
    }

    /* Already paid */

    if (
      order.paymentStatus === "PAID"
    ) {
      throw new ApiError(
        400,
        "This order is already paid"
      );
    }

    /*
     * Prevent duplicate PhonePe orders.
     *
     * If the same order already has a merchant
     * order ID, reuse it.
     */

    let merchantOrderId =
      order.merchantOrderId;

    if (!merchantOrderId) {
      merchantOrderId =
        `PP_${order.orderNumber}_${Date.now()}`;

      await orderRepository.updatePaymentDetails(
        order._id,
        {
          merchantOrderId,
          paymentMethod: "PHONEPE",
        }
      );
    }

    const redirectUrl =
      `${process.env.PHONEPE_FRONTEND_URL}/payment/phonepe/callback?merchantOrderId=${encodeURIComponent(
        merchantOrderId
      )}`;

    const payment =
      await phonepeService.createPayment({
        merchantOrderId,
        amount: order.finalAmount,
        redirectUrl,
      });

    await orderRepository.updatePaymentDetails(
      order._id,
      {
        merchantOrderId,
        phonePeOrderId:
          payment.orderId || null,
      }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "PhonePe payment created",
        {
          orderId: order._id,
          merchantOrderId,

          phonePeOrderId:
            payment.orderId || null,

          redirectUrl:
            payment.redirectUrl || null,

          state:
            payment.state || "PENDING",
        }
      )
    );
  });

/* ==========================================
   Verify PhonePe Payment
========================================== */

const verifyPhonePePayment =
  asyncHandler(async (req, res) => {
    const { merchantOrderId } =
      req.params;

    if (!merchantOrderId) {
      throw new ApiError(
        400,
        "Merchant order ID is required"
      );
    }

    const order =
      await orderRepository.findByMerchantOrderId(
        merchantOrderId
      );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    /*
     * Security:
     * Only the owner can verify this order
     * from the frontend.
     */

    if (
      order.userId?._id?.toString() !==
      req.user.id.toString()
    ) {
      throw new ApiError(
        403,
        "Unauthorized order"
      );
    }

    const phonePeStatus =
      await phonepeService.getPaymentStatus(
        merchantOrderId
      );

    /*
     * PhonePe Standard Checkout status
     *
     * COMPLETED = successful payment
     */

    const state =
      phonePeStatus?.state;

    if (state === "COMPLETED") {
      const transactionId =
        phonePeStatus?.paymentDetails?.[0]
          ?.transactionId ||
        phonePeStatus?.transactionId ||
        null;

      const updatedOrder =
        await orderRepository.markPaymentPaid(
          order._id,
          {
            phonePeTransactionId:
              transactionId,
          }
        );

      /*
       * Clear cart ONLY after successful
       * payment verification.
       */

      await cartRepository.clearCart(
        req.user.id
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          "Payment successful",
          {
            success: true,
            paymentStatus: "PAID",
            orderStatus:
              updatedOrder.status,
            order: updatedOrder,
          }
        )
      );
    }

    if (
      state === "FAILED" ||
      state === "CANCELLED"
    ) {
      await orderRepository.markPaymentFailed(
        order._id
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          "Payment failed",
          {
            success: false,
            paymentStatus: "FAILED",
            state,
            orderId: order._id,
          }
        )
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        "Payment is still pending",
        {
          success: false,
          paymentStatus: "PENDING",
          state:
            state || "PENDING",
          orderId: order._id,
        }
      )
    );
  });

module.exports = {
  createPhonePePayment,
  verifyPhonePePayment,
};