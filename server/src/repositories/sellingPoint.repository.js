const SellingPointTransaction =
  require("../models/sellingPointTransaction.model");

/* ==========================================================================
   CREATE TRANSACTION
   ========================================================================== */

const createTransaction = async (data) => {
  return await SellingPointTransaction.create(data);
};


/* ==========================================================================
   GET USER TRANSACTIONS
   ========================================================================== */

const getTransactions = async (userId) => {
  if (!userId) {
    return [];
  }

  return await SellingPointTransaction.find({
    user: userId,
  })
    .sort({
      createdAt: -1,
    })
    .populate(
      "order",
      "orderNumber"
    )
    .lean();
};


/* ==========================================================================
   GET SINGLE TRANSACTION
   ========================================================================== */

const getTransactionById = async (id) => {
  if (!id) {
    return null;
  }

  return await SellingPointTransaction.findById(
    id
  )
    .populate(
      "user",
      "name userId"
    )
    .populate(
      "order",
      "orderNumber"
    )
    .lean();
};


/* ==========================================================================
   FIND MEMBERSHIP TRANSACTION
   ========================================================================== */

const findMembershipTransaction =
  async (userId) => {

    if (!userId) {
      return null;
    }

    return await SellingPointTransaction.findOne({
      user: userId,

      transactionType:
        "MEMBERSHIP_PAYMENT",
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  };


/* ==========================================================================
   FIND ORDER TRANSACTION
   ========================================================================== */

const findOrderTransaction =
  async (
    userId,
    orderId
  ) => {

    if (
      !userId ||
      !orderId
    ) {
      return null;
    }

    return await SellingPointTransaction.findOne({
      user: userId,

      order: orderId,

      transactionType:
        "ORDER_PURCHASE",
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  };


/* ==========================================================================
   FIND ANY TRANSACTION BY ORDER
   ========================================================================== */

const findByOrder =
  async (
    orderId
  ) => {

    if (!orderId) {
      return null;
    }

    return await SellingPointTransaction.findOne({
      order: orderId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  };


/* ==========================================================================
   COUNT ORDER TRANSACTIONS
   ========================================================================== */

const countOrderTransactions =
  async (
    orderId
  ) => {

    if (!orderId) {
      return 0;
    }

    return await SellingPointTransaction.countDocuments({
      order: orderId,

      transactionType:
        "ORDER_PURCHASE",
    });
  };


/* ==========================================================================
   GET USER ORDER TRANSACTIONS
   ========================================================================== */

const getUserOrderTransactions =
  async (
    userId
  ) => {

    if (!userId) {
      return [];
    }

    return await SellingPointTransaction.find({
      user: userId,

      transactionType:
        "ORDER_PURCHASE",
    })
      .sort({
        createdAt: -1,
      })
      .populate(
        "order",
        "orderNumber"
      )
      .lean();
  };


/* ==========================================================================
   GET ORDER TRANSACTION
   ========================================================================== */

const getOrderTransaction =
  async (
    userId,
    orderId
  ) => {

    if (
      !userId ||
      !orderId
    ) {
      return null;
    }

    return await SellingPointTransaction.findOne({
      user: userId,

      order: orderId,

      transactionType:
        "ORDER_PURCHASE",
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  };


/* ==========================================================================
   EXPORTS
   ========================================================================== */

module.exports = {

  createTransaction,

  getTransactions,

  getTransactionById,

  findMembershipTransaction,

  findOrderTransaction,

  findByOrder,

  countOrderTransactions,

  getUserOrderTransactions,

  getOrderTransaction,
};