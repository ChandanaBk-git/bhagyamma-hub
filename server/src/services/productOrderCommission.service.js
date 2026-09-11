// server/services/productOrderCommission.service.js

const mongoose = require("mongoose");

const User = require("../models/user.model");
const Order = require("../models/order.model");
const walletService = require("./wallet.service");

const productOrderCommissionRepository = require("../repositories/productOrderCommission.repository");

const MANAGER_USER_ID = "BH000002";

const MANAGER_PERCENTAGE = 50;
const BUYER_DISCOUNT_PERCENTAGE = 20;
const UPLINE_POOL_PERCENTAGE = 30;

const DELIVERY_CHARGE = 50;

const PRODUCT_ORDER_TYPE = "PRODUCT_ORDER";

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const roundMoney = (value) => {
  return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
};

const normalizeStatus = (value) => {
  return String(value || "").trim().toUpperCase();
};

const isActiveMember = (user) => {
  return (
    String(user?.membershipStatus || "").trim().toLowerCase() === "active"
  );
};

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

/**
 * Get the fixed Manager / Contract Member.
 *
 * BH000002 is ALWAYS Level 1.
 */
const getProductOrderManager = async () => {
  const manager = await User.findOne({
    userId: MANAGER_USER_ID,
    role: "MANAGER",
  }).lean();

  if (!manager) {
    throw new Error(
      `Product-order commission manager ${MANAGER_USER_ID} was not found`
    );
  }

  return manager;
};

/**
 * Calculate buyer discount.
 *
 * Discount is always calculated from the ORIGINAL product amount.
 */
const calculateBuyerDiscount = (originalProductAmount) => {
  const amount = toNumber(originalProductAmount);

  return roundMoney((amount * BUYER_DISCOUNT_PERCENTAGE) / 100);
};

/**
 * Calculate what the customer pays.
 *
 * Delivery is separate and is NEVER included in commission distribution.
 */
const calculateCustomerPayable = ({
  originalProductAmount,
  deliveryCharge = DELIVERY_CHARGE,
  walletAmount = 0,
  buyerIsActiveMember = false,
}) => {
  const originalAmount = roundMoney(originalProductAmount);

  const discount = buyerIsActiveMember
    ? calculateBuyerDiscount(originalAmount)
    : 0;

  const productPayable = roundMoney(originalAmount - discount);

  const delivery = roundMoney(deliveryCharge);

  const wallet = Math.max(
    0,
    Math.min(roundMoney(walletAmount), productPayable + delivery)
  );

  const finalAmount = roundMoney(
    Math.max(0, productPayable + delivery - wallet)
  );

  return {
    originalProductAmount: originalAmount,
    discount,
    productPayable,
    deliveryCharge: delivery,
    walletAmount: wallet,
    finalAmount,
  };
};

/**
 * Get eligible upline members.
 *
 * Returned order:
 *
 * TOP UPLINE -> DOWN -> IMMEDIATE UPLINE
 *
 * BH000002 is handled separately as Manager / Level 1.
 */
const getEligibleUplineChain = async (buyer) => {
  const chain = [];

  const visited = new Set();

  let currentId = buyer?.sponsorId || buyer?.referredBy || null;

  while (currentId) {
    const idString = String(currentId);

    if (visited.has(idString)) {
      break;
    }

    visited.add(idString);

    if (!isValidObjectId(currentId)) {
      break;
    }

    const sponsor = await User.findById(currentId).lean();

    if (!sponsor) {
      break;
    }

    /*
     * BH000002 is the fixed Manager.
     * Do NOT put the Manager into the normal upline chain.
     */
    if (String(sponsor.userId) === MANAGER_USER_ID) {
      break;
    }

    /*
     * Only Active members participate in product-order commission.
     */
    if (isActiveMember(sponsor)) {
      chain.push(sponsor);
    }

    currentId = sponsor.sponsorId || sponsor.referredBy || null;
  }

  /*
   * Traversal starts from buyer's immediate sponsor.
   * Reverse it so distribution starts from TOP -> DOWN.
   */
  chain.reverse();

  return chain;
};

/**
 * Calculate percentages for the OTHER uplines.
 *
 * Manager's 50% is handled separately.
 *
 * Remaining pool = 30%.
 *
 * Rules:
 *
 * 0 uplines:
 *   Manager receives 80%
 *
 * 1 upline:
 *   Upline receives 30%
 *
 * 2 uplines:
 *   15% + 15%
 *
 * 3 uplines:
 *   7.5% + 7.5% + 15%
 *
 * 4 uplines:
 *   5% + 5% + 5% + 15%
 *
 * 5 uplines:
 *   3.75% x 4 + 15%
 *
 * General rule:
 *   Immediate upline = 15%
 *   Remaining 15% equally divided among other uplines.
 */
const calculateUplinePercentages = (uplineCount) => {
  const count = Math.max(0, Number(uplineCount) || 0);

  if (count === 0) {
    return [];
  }

  if (count === 1) {
    return [30];
  }

  if (count === 2) {
    return [15, 15];
  }

  const middleCount = count - 1;

  const middlePercentage = roundMoney(15 / middleCount);

  const percentages = [];

  for (let index = 0; index < middleCount; index += 1) {
    percentages.push(middlePercentage);
  }

  percentages.push(15);

  /*
   * Fix any floating-point rounding difference so
   * the upline pool always totals exactly 30%.
   */
  const currentTotal = roundMoney(
    percentages.reduce((sum, percentage) => sum + percentage, 0)
  );

  const difference = roundMoney(UPLINE_POOL_PERCENTAGE - currentTotal);

  if (difference !== 0) {
    percentages[percentages.length - 1] = roundMoney(
      percentages[percentages.length - 1] + difference
    );
  }

  return percentages;
};

/**
 * Build the complete product-order commission distribution.
 */
const buildDistribution = async ({
  buyer,
  originalProductAmount,
}) => {
  const originalAmount = roundMoney(originalProductAmount);

  if (originalAmount <= 0) {
    throw new Error("Original product amount must be greater than zero");
  }

  /*
   * Only Active members receive the 20% product discount
   * and participate in product-order commission.
   */
  if (!isActiveMember(buyer)) {
    return {
      eligible: false,
      buyer: {
        _id: buyer?._id,
        userId: buyer?.userId,
      },
      manager: null,
      originalAmount,
      discount: 0,
      buyerPayableProductAmount: originalAmount,
      managerPercentage: 0,
      managerAmount: 0,
      uplinePercentage: 0,
      uplineAmount: 0,
      commissionPercentageTotal: 0,
      totalCommissionAmount: 0,
      commissions: [],
    };
  }

  const manager = await getProductOrderManager();

  const uplines = await getEligibleUplineChain(buyer);

  const commissions = [];

  /*
   * IMPORTANT:
   *
   * If there are NO other eligible uplines,
   * the Manager receives the entire 80%.
   *
   * Otherwise Manager receives fixed 50%.
   */
  if (uplines.length === 0) {
    const managerPercentage = 80;

    const managerAmount = roundMoney(
      (originalAmount * managerPercentage) / 100
    );

    commissions.push({
      receiver: manager._id,
      receiverUserId: manager.userId,
      receiverType: "MANAGER",
      level: 1,
      percentage: managerPercentage,
      commissionAmount: managerAmount,
    });
  } else {
    /*
     * Manager is ALWAYS Level 1.
     */
    const managerAmount = roundMoney(
      (originalAmount * MANAGER_PERCENTAGE) / 100
    );

    commissions.push({
      receiver: manager._id,
      receiverUserId: manager.userId,
      receiverType: "MANAGER",
      level: 1,
      percentage: MANAGER_PERCENTAGE,
      commissionAmount: managerAmount,
    });

    const uplinePercentages = calculateUplinePercentages(uplines.length);

    uplines.forEach((upline, index) => {
      const percentage = uplinePercentages[index];

      const commissionAmount = roundMoney(
        (originalAmount * percentage) / 100
      );

      commissions.push({
        receiver: upline._id,
        receiverUserId: upline.userId,
        receiverType: "UPLINE",
        level: index + 2,
        percentage,
        commissionAmount,
      });
    });
  }

  /*
   * Buyer discount.
   */
  const discount = calculateBuyerDiscount(originalAmount);

  const buyerPayableProductAmount = roundMoney(
    originalAmount - discount
  );

  /*
   * Verify commission total.
   *
   * Active buyer:
   *
   * 20% = buyer discount
   * 80% = distributed to manager/uplines
   */
  const totalCommissionAmount = roundMoney(
    commissions.reduce(
      (sum, commission) => sum + commission.commissionAmount,
      0
    )
  );

  const expectedCommissionAmount = roundMoney(
    (originalAmount * 80) / 100
  );

  /*
   * Floating-point tolerance.
   */
  if (
    Math.abs(totalCommissionAmount - expectedCommissionAmount) > 0.01
  ) {
    throw new Error(
      `Product commission distribution mismatch. Expected ${expectedCommissionAmount}, received ${totalCommissionAmount}`
    );
  }

  const managerCommission = commissions.find(
    (commission) => commission.receiverType === "MANAGER"
  );

  const uplineCommissions = commissions.filter(
    (commission) => commission.receiverType === "UPLINE"
  );

  const uplineAmount = roundMoney(
    uplineCommissions.reduce(
      (sum, commission) => sum + commission.commissionAmount,
      0
    )
  );

  const uplinePercentage = roundMoney(
    uplineCommissions.reduce(
      (sum, commission) => sum + commission.percentage,
      0
    )
  );

  const commissionPercentageTotal = roundMoney(
    commissions.reduce(
      (sum, commission) => sum + commission.percentage,
      0
    )
  );

  return {
    eligible: true,

    buyer: {
      _id: buyer._id,
      userId: buyer.userId,
      membershipStatus: buyer.membershipStatus,
    },

    manager: {
      _id: manager._id,
      userId: manager.userId,
    },

    originalAmount,

    discount,

    buyerPayableProductAmount,

    managerPercentage: managerCommission?.percentage || 0,
    managerAmount: managerCommission?.commissionAmount || 0,

    uplinePercentage,
    uplineAmount,

    commissionPercentageTotal,
    totalCommissionAmount,

    commissions,
  };
};

/**
 * Calculate product-order pricing for a buyer.
 *
 * This is the backend source of truth.
 */
const calculateOrderPricing = async ({
  buyerId,
  originalProductAmount,
  walletAmount = 0,
  deliveryCharge = DELIVERY_CHARGE,
}) => {
  if (!buyerId || !isValidObjectId(buyerId)) {
    return calculateCustomerPayable({
      originalProductAmount,
      deliveryCharge,
      walletAmount,
      buyerIsActiveMember: false,
    });
  }

  const buyer = await User.findById(buyerId).lean();

  if (!buyer) {
    throw new Error("Buyer not found");
  }

  return calculateCustomerPayable({
    originalProductAmount,
    deliveryCharge,
    walletAmount,
    buyerIsActiveMember: isActiveMember(buyer),
  });
};

/**
 * Create commission records for a paid product order.
 */
const createProductOrderCommissionRecords = async ({
  order,
  buyer,
  distribution,
}) => {
  if (!distribution?.eligible) {
    return [];
  }

  const existing = await productOrderCommissionRepository.findByOrder(
    order._id
  );

  if (existing && existing.length > 0) {
    return existing;
  }

  const records = distribution.commissions.map((commission) => ({
    order: order._id,
    buyer: buyer._id,
    receiver: commission.receiver,

    originalAmount: distribution.originalAmount,

    percentage: commission.percentage,

    commissionAmount: commission.commissionAmount,

    level: commission.level,

    receiverType: commission.receiverType,

    type: PRODUCT_ORDER_TYPE,

    buyerWasActiveMember: true,

    managerUserId: MANAGER_USER_ID,

    status: "PENDING",

    walletCredited: false,

    description: `Product order commission for order ${order.orderNumber || order._id}`,
  }));

  try {
    return await productOrderCommissionRepository.createMany(records);
  } catch (error) {
    /*
     * If another request created the records at the same time,
     * retrieve the existing records instead of creating duplicates.
     */
    const duplicateRecords =
      await productOrderCommissionRepository.findByOrder(order._id);

    if (duplicateRecords && duplicateRecords.length > 0) {
      return duplicateRecords;
    }

    throw error;
  }
};

/**
 * Credit ONE product-order commission to wallet.
 *
 * Existing wallet service is reused.
 * Wallet service itself is NOT modified.
 */
const creditProductOrderCommission = async (commission) => {
  if (!commission) {
    return null;
  }

  if (commission.walletCredited) {
    return commission;
  }

  const amount = roundMoney(commission.commissionAmount);

  if (amount <= 0) {
    return commission;
  }

  const reference =
    `PRODUCT_ORDER_${commission.order?._id || commission.order}`;

  const description =
    commission.description ||
    `Product order commission - Level ${commission.level}`;

  await walletService.creditCommission(
    commission.receiver,
    amount,
    description,
    reference
  );

  return productOrderCommissionRepository.markWalletCredited(
    commission._id,
    reference
  );
};

/**
 * Process product-order commission after an order is PAID.
 *
 * IMPORTANT:
 * - Only Active members qualify.
 * - Guest orders do not receive product commission.
 * - Original order subtotal is used.
 * - Delivery is excluded.
 * - Wallet usage is excluded from commission calculation.
 * - Joining commission is NOT touched.
 */
const processProductOrderCommission = async (orderId) => {
  if (!orderId || !isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new Error("Order not found");
  }

  if (normalizeStatus(order.paymentStatus) !== "PAID") {
    return {
      processed: false,
      reason: "ORDER_NOT_PAID",
      orderId: order._id,
      commissions: [],
    };
  }

  /*
   * Guest orders have no product-order commission.
   */
if (!order.userId) {
    return {
      processed: false,
      reason: "GUEST_ORDER",
      orderId: order._id,
      commissions: [],
    };
  }

const buyer = await User.findById(order.userId).lean();

  if (!buyer) {
    throw new Error("Buyer not found for order");
  }

  /*
   * Product commission only applies to Active members.
   */
  if (!isActiveMember(buyer)) {
    return {
      processed: false,
      reason: "BUYER_NOT_ACTIVE_MEMBER",
      orderId: order._id,
      commissions: [],
    };
  }

  /*
   * IMPORTANT:
   *
   * Commission base = ORIGINAL PRODUCT SUBTOTAL.
   *
   * Do NOT use:
   * - finalAmount
   * - walletAmount
   * - discount
   * - deliveryCharge
   */
  const originalProductAmount = roundMoney(order.subtotal);

  if (originalProductAmount <= 0) {
    return {
      processed: false,
      reason: "ZERO_PRODUCT_SUBTOTAL",
      orderId: order._id,
      commissions: [],
    };
  }

  const distribution = await buildDistribution({
    buyer,
    originalProductAmount,
  });

  const records = await createProductOrderCommissionRecords({
    order,
    buyer,
    distribution,
  });

  const creditedRecords = [];

  for (const record of records) {
    /*
     * Do not credit a commission twice.
     */
    if (record.walletCredited) {
      creditedRecords.push(record);
      continue;
    }

    const credited = await creditProductOrderCommission(record);

    creditedRecords.push(credited);
  }

  return {
    processed: true,

    orderId: order._id,

    buyer: {
      _id: buyer._id,
      userId: buyer.userId,
    },

    originalProductAmount,

    discount: distribution.discount,

    buyerPayableProductAmount:
      distribution.buyerPayableProductAmount,

    managerPercentage:
      distribution.managerPercentage,

    managerAmount:
      distribution.managerAmount,

    uplinePercentage:
      distribution.uplinePercentage,

    uplineAmount:
      distribution.uplineAmount,

    commissionPercentageTotal:
      distribution.commissionPercentageTotal,

    totalCommissionAmount:
      distribution.totalCommissionAmount,

    commissions: creditedRecords,
  };
};

/**
 * Get commissions for a buyer.
 */
const getMyProductOrderCommissions = async (buyerId) => {
  return productOrderCommissionRepository.findByBuyer(buyerId);
};

/**
 * Get commissions received by a user.
 */
const getReceivedProductOrderCommissions = async (receiverId) => {
  return productOrderCommissionRepository.findByReceiver(receiverId);
};

/**
 * Get commissions for an order.
 */
const getOrderProductCommissions = async (orderId) => {
  return productOrderCommissionRepository.findByOrder(orderId);
};

/**
 * Get Manager product commissions.
 */
const getManagerProductCommissions = async () => {
  const manager = await getProductOrderManager();

  return productOrderCommissionRepository.findManagerCommissions(
    manager._id
  );
};

/**
 * Get receiver summary.
 */
const getProductOrderCommissionSummary = async (receiverId) => {
  return productOrderCommissionRepository.getSummaryByReceiver(
    receiverId
  );
};

module.exports = {
  MANAGER_USER_ID,
  MANAGER_PERCENTAGE,
  BUYER_DISCOUNT_PERCENTAGE,
  UPLINE_POOL_PERCENTAGE,
  DELIVERY_CHARGE,

  isActiveMember,

  getProductOrderManager,

  calculateBuyerDiscount,

  calculateCustomerPayable,

  getEligibleUplineChain,

  calculateUplinePercentages,

  buildDistribution,

  calculateOrderPricing,

  createProductOrderCommissionRecords,

  creditProductOrderCommission,

  processProductOrderCommission,

  getMyProductOrderCommissions,

  getReceivedProductOrderCommissions,

  getOrderProductCommissions,

  getManagerProductCommissions,

  getProductOrderCommissionSummary,
};