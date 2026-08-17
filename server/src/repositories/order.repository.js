const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");

/* ==========================================
   Create Order
========================================== */

const createOrder = async (payload) => {
  return await Order.create(
    payload
  );
};

/* ==========================================
   Create Order Items
========================================== */

const createOrderItems = async (
  items
) => {
  if (
    !items ||
    !items.length
  ) {
    return [];
  }

  return await OrderItem.insertMany(
    items
  );
};

/* ==========================================
   Find Order
========================================== */

const findById = async (id) => {
  return await Order.findById(id)
    .populate("userId");
};

/* ==========================================
   Find By Merchant Order ID
========================================== */

const findByMerchantOrderId =
  async (
    merchantOrderId
  ) => {
    return await Order.findOne({
      merchantOrderId,
    }).populate("userId");
  };

/* ==========================================
   Find Items
========================================== */

const findByOrderId = async (
  orderId
) => {
  return await OrderItem.find({
    orderId,
  }).populate("productId");
};

/* ==========================================
   Member Orders
========================================== */

const getMyOrders = async (
  userId
) => {
  return await Order.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

/* ==========================================
   Find User Orders
========================================== */

const findByUser = async (
  userId
) => {
  return await Order.find({
    userId,
  }).sort({
    createdAt: -1,
  });
};

/* ==========================================
   GUEST ORDERS BY MOBILE
========================================== */

const findGuestOrdersByMobile =
  async (
    customerMobile
  ) => {
    return await Order.find({
      orderType: "GUEST",

      customerMobile,

      userId: null,
    }).sort({
      createdAt: -1,
    });
  };

/* ==========================================
   PAID GUEST ORDERS
========================================== */

const findPaidGuestOrdersByMobile =
  async (
    customerMobile
  ) => {
    return await Order.find({
      orderType: "GUEST",

      customerMobile,

      userId: null,

      paymentStatus: "PAID",

      membershipLinked: false,
    }).sort({
      createdAt: 1,
    });
  };

/* ==========================================
   ALL ORDERS
========================================== */

const getAllOrders = async () => {
  return await Order.find()
    .populate("userId")
    .sort({
      createdAt: -1,
    });
};

/* ==========================================
   UPDATE ORDER STATUS
========================================== */

const updateStatus = async (
  id,
  status
) => {
  const update = {
    status,
  };

  if (
    status === "CONFIRMED"
  ) {
    update.confirmedAt =
      new Date();
  }

  if (
    status === "PACKED"
  ) {
    update.packedAt =
      new Date();
  }

  if (
    status === "SHIPPED"
  ) {
    update.shippedAt =
      new Date();
  }

  if (
    status === "DELIVERED"
  ) {
    update.deliveredAt =
      new Date();
  }

  if (
    status ===
    "CANCELLED"
  ) {
    update.cancelledAt =
      new Date();
  }

  return await Order.findByIdAndUpdate(
    id,
    update,
    {
      new: true,
    }
  );
};

/* ==========================================
   UPDATE PAYMENT DETAILS
========================================== */

const updatePaymentDetails =
  async (
    id,
    paymentDetails
  ) => {
    return await Order.findByIdAndUpdate(
      id,
      {
        $set:
          paymentDetails,
      },
      {
        new: true,
      }
    );
  };

/* ==========================================
   MARK PAYMENT PAID
========================================== */

const markPaymentPaid =
  async (
    id,
    {
      phonePeTransactionId,
      phonePeOrderId,
    } = {}
  ) => {
    return await Order.findOneAndUpdate(
      {
        _id: id,

        paymentStatus: {
          $ne: "PAID",
        },
      },
      {
        $set: {
          paymentStatus:
            "PAID",

          status:
            "CONFIRMED",

          phonePeTransactionId:
            phonePeTransactionId ||
            null,

          phonePeOrderId:
            phonePeOrderId ||
            null,

          paidAt:
            new Date(),

          confirmedAt:
            new Date(),
        },
      },
      {
        new: true,
      }
    );
  };

/* ==========================================
   MARK PAYMENT FAILED
========================================== */

const markPaymentFailed =
  async (id) => {
    return await Order.findOneAndUpdate(
      {
        _id: id,

        paymentStatus: {
          $ne: "PAID",
        },
      },
      {
        $set: {
          paymentStatus:
            "FAILED",
        },
      },
      {
        new: true,
      }
    );
  };

/* ==========================================
   UPDATE PAYMENT STATUS
========================================== */
/* ==========================================
   UPDATE PAYMENT STATUS
========================================== */

const updatePaymentStatus =
  async (
    id,
    paymentStatus
  ) => {

    return await Order.findByIdAndUpdate(
      id,

      {
        $set: {
          paymentStatus,
        },
      },

      {
        new: true,
        runValidators: true,
      }
    );

  };

/* ==========================================
   LAST ORDER
========================================== */

const getLastOrder =
  async () => {
    return await Order.findOne()
      .sort({
        createdAt: -1,
      });
  };

module.exports = {
  createOrder,

  createOrderItems,

  findById,

  findByMerchantOrderId,

  findByOrderId,

  getMyOrders,

  findByUser,

  findGuestOrdersByMobile,

  findPaidGuestOrdersByMobile,

  getAllOrders,

  updateStatus,

  updatePaymentDetails,

  markPaymentPaid,

  markPaymentFailed,

  updatePaymentStatus,

  getLastOrder,
};