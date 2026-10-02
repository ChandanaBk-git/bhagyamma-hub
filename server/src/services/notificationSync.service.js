const mongoose = require("mongoose");

const User = require("../models/user.model");
const Order = require("../models/order.model");
const WalletTransaction = require("../models/walletTransaction.model");
const CommissionTransaction = require("../models/commissionTransaction.model");
const PackagingAssignment = require("../models/packagingAssignment.model");
const PackagingStaff = require("../models/packagingStaff.model");
const Notification = require("../models/Notification");
const NotificationSyncState = require("../models/NotificationSyncState");

const ProductOrderCommission = require("../models/productOrderCommission.model");
const OrderItem = require("../models/orderItem.model");

const POLL_INTERVAL = 30 * 1000;

let running = false;
let timer = null;

const validObjectId = (id) =>
  id && mongoose.isValidObjectId(id);

const money = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const roleOf = (role) => {
  const allowed = [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "SUPERVISOR",
    "MEMBER",
    "PACKAGING",
  ];

  return allowed.includes(role) ? role : null;
};

/**
 * Insert only once for each recipient + event.
 * Does not update or overwrite an existing notification.
 */
const emit = async ({
  recipientId,
  recipientRole,
  eventId,
  title,
  message,
  type,
  priority = "NORMAL",
  referenceId = null,
  referenceType = null,
  branchId = null,
  metadata = {},
}) => {
  if (!validObjectId(recipientId) || !eventId) return;

  const role = roleOf(recipientRole);
  if (!role) return;

  try {
    await Notification.updateOne(
      {
        recipientId,
        eventId,
      },
      {
        $set: {
          recipientRole: role,
          title,
          message,
          type,
          priority,
          referenceId,
          referenceType,
          branchId,
          metadata,
        },

        $setOnInsert: {
          isRead: false,
          readAt: null,
        },
      },
      {
        upsert: true,
        runValidators: true,
      }
    );
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }
  }
};


const emitToAdmins = async (admins, payload) => {
  for (const admin of admins) {
    await emit({
      ...payload,
      recipientId: admin._id,
      recipientRole: admin.role,
    });
  }
};

const emitToManager = async (managerId, payload) => {
  if (!validObjectId(managerId)) return;

  const manager = await User.findById(managerId)
    .select("_id role")
    .lean();

  if (!manager || !["MANAGER", "SUPERVISOR"].includes(manager.role)) {
    return;
  }

  await emit({
    ...payload,
    recipientId: manager._id,
    recipientRole: manager.role,
  });
};

const getOrderStatusInfo = (status) => {
  const map = {
    PLACED: ["Order Placed", "ORDER_CREATED"],
    CONFIRMED: ["Order Confirmed", "ORDER_CONFIRMED"],
    PACKING: ["Order Is Being Packed", "ORDER_UPDATED"],
    PACKED: ["Order Packed", "ORDER_PACKED"],
    READY_FOR_DISPATCH: ["Ready for Dispatch", "ORDER_UPDATED"],
    SHIPPED: ["Order Shipped", "ORDER_SHIPPED"],
    OUT_FOR_DELIVERY: ["Out for Delivery", "ORDER_OUT_FOR_DELIVERY"],
    DELIVERED: ["Order Delivered", "ORDER_DELIVERED"],
    CANCELLED: ["Order Cancelled", "ORDER_CANCELLED"],
  };

  return map[status] || null;
};

/* =========================
   ORDER NOTIFICATIONS
========================= */

const processOrder = async (order, admins) => {
  const orderId = String(order._id);
  const orderNumber = order.orderNumber || orderId;
  const statusInfo = getOrderStatusInfo(order.status);

  const owner = validObjectId(order.userId)
    ? await User.findById(order.userId)
        .select("_id role managerId")
        .lean()
    : null;

  const common = {
    referenceId: order._id,
    referenceType: "Order",
    metadata: {
      orderNumber,
      orderStatus: order.status,
    },
  };

  if (owner && statusInfo) {
    await emit({
      recipientId: owner._id,
      recipientRole: owner.role,
      eventId: `order:${orderId}:status:${order.status}`,
      title: statusInfo[0],
      message: `Your order ${orderNumber} is now ${String(
        order.status
      ).replaceAll("_", " ").toLowerCase()}.`,
      type: statusInfo[1],
      ...common,
    });
  }

  if (statusInfo) {
    await emitToAdmins(admins, {
      eventId: `admin:order:${orderId}:status:${order.status}`,
      title: "Order Activity",
      message: `Order ${orderNumber} status: ${order.status}.`,
      type: "ADMIN_SYSTEM_ALERT",
      priority: "NORMAL",
      ...common,
    });
  }

  if (owner?.managerId && statusInfo) {
    await emitToManager(owner.managerId, {
      eventId: `manager:order:${orderId}:status:${order.status}`,
      title: "Team Order Update",
      message: `Order ${orderNumber} status: ${order.status}.`,
      type: "MANAGER_NEW_ORDER",
      ...common,
    });
  }

  if (order.paymentStatus === "PAID") {
    if (owner) {
      await emit({
        recipientId: owner._id,
        recipientRole: owner.role,
        eventId: `order:${orderId}:payment:PAID`,
        title: "Payment Successful",
        message: `Payment for order ${orderNumber} was successful.`,
        type: "ORDER_PAYMENT_SUCCESS",
        ...common,
      });
    }

    await emitToAdmins(admins, {
      eventId: `admin:order:${orderId}:payment:PAID`,
      title: "Order Payment Received",
      message: `Payment received for order ${orderNumber}.`,
      type: "ADMIN_PAYMENT_RECEIVED",
      ...common,
    });
  }
};

/* =========================
   USER / MEMBERSHIP
========================= */

const processUser = async (user, admins) => {
  const userId = String(user._id);
  const name = user.name || "A member";

  await emitToAdmins(admins, {
    eventId: `admin:user:${userId}:registered`,
    title: "New Member Registration",
    message: `${name} has registered with Bhagyamma Hub.`,
    type: "ADMIN_NEW_REGISTRATION",
    referenceId: user._id,
    referenceType: "User",
    metadata: {
      memberId: user.userId,
    },
  });

  if (user.managerId) {
    await emitToManager(user.managerId, {
      eventId: `manager:user:${userId}:registered`,
      title: "New Team Member",
      message: `${name} has joined your team.`,
      type: "MANAGER_NEW_MEMBER",
      referenceId: user._id,
      referenceType: "User",
    });
  }

  if (user.membershipStatus === "Active") {
    await emit({
      recipientId: user._id,
      recipientRole: user.role,
      eventId: `user:${userId}:membership:Active`,
      title: "Membership Active",
      message: "Your Bhagyamma Hub membership is active.",
      type: "MEMBERSHIP_ACTIVATED",
      referenceId: user._id,
      referenceType: "User",
      metadata: {
        activatedAt: user.membershipActivatedAt || null,
      },
    });

    if (user.managerId) {
      await emitToManager(user.managerId, {
        eventId: `manager:user:${userId}:membership:Active`,
        title: "Team Membership Activated",
        message: `${name}'s membership is active.`,
        type: "REFERRAL_MEMBERSHIP_ACTIVATED",
        referenceId: user._id,
        referenceType: "User",
      });
    }
  }
};

/* =========================
   WALLET NOTIFICATIONS
========================= */

const processWalletTransaction = async (transaction) => {
  const user = await User.findById(transaction.userId)
    .select("_id role")
    .lean();

  if (!user) return;

  const isCredit = transaction.type === "CREDIT";

  await emit({
    recipientId: user._id,
    recipientRole: user.role,
    eventId: `wallet:${transaction._id}:${transaction.type}`,
    title: isCredit ? "Wallet Credited" : "Wallet Debited",
    message: `${money(transaction.amount)} ${
      isCredit ? "was credited to" : "was debited from"
    } your wallet. ${transaction.description || ""}`.trim(),
    type: isCredit ? "WALLET_CREDITED" : "WALLET_DEBITED",
    referenceId: transaction._id,
    referenceType: "WalletTransaction",
    metadata: {
      amount: transaction.amount,
      balanceAfter: transaction.balanceAfter,
      reference: transaction.reference,
    },
  });
};

/* =========================
   JOINING / GENERAL COMMISSION
========================= */

const processCommission = async (transaction) => {
  if (transaction.status !== "PAID") return;

  const [receiver, sourceUser, order] = await Promise.all([
    User.findById(transaction.receiver)
      .select("_id name userId role")
      .lean(),

    User.findById(transaction.fromUser)
      .select("_id name userId")
      .lean(),

    transaction.order
      ? Order.findById(transaction.order)
          .select("_id orderNumber")
          .lean()
      : Promise.resolve(null),
  ]);

  if (!receiver || !sourceUser) return;

  const receiverName = receiver.name || "Member";
  const sourceName = sourceUser.name || "A member";

  const amount = money(transaction.commissionAmount);
  const level = Number(transaction.level || 1);

  let message = "";

  if (transaction.type === "JOINING") {
    message =
      `${receiverName}, you received ${amount} commission ` +
      `from ${sourceName}'s ₹${Number(
        transaction.joiningAmount || 0
      ).toLocaleString("en-IN")} membership activation. ` +
      `Level ${level} joining commission.`;
  } else if (transaction.type === "ORDER") {
    const orderNumber = order?.orderNumber || "an order";

    message =
      `${receiverName}, you received ${amount} commission ` +
      `from ${sourceName}'s product purchase under Order ${orderNumber}. ` +
      `Level ${level} product-order commission.`;
  } else {
    message =
      `${receiverName}, you received ${amount} commission ` +
      `generated by ${sourceName}. ` +
      `Level ${level} • ${transaction.type || "Commission"}.`;
  }

  await emit({
    recipientId: receiver._id,
    recipientRole: receiver.role,
    eventId: `commission:${transaction._id}:PAID`,
    title: "Commission Received",
    message,
    type: "COMMISSION_RECEIVED",
    referenceId: transaction._id,
    referenceType: "CommissionTransaction",
    metadata: {
      amount: transaction.commissionAmount,
      level,
      commissionType: transaction.type,
      sourceMemberName: sourceName,
      sourceMemberId: sourceUser.userId,
      joiningAmount: transaction.joiningAmount || 0,
      orderId: order?._id || null,
      orderNumber: order?.orderNumber || null,
    },
  });
};

/* =========================
   PRODUCT ORDER COMMISSION
========================= */

const processProductOrderCommissionNotification = async (commission) => {
  // Notify only after commission is actually credited.
  if (
    commission.status !== "PAID" ||
    commission.walletCredited !== true
  ) {
    return;
  }

  const [receiver, buyer, order, items] = await Promise.all([
    User.findById(commission.receiver)
      .select("_id name userId role")
      .lean(),

    User.findById(commission.buyer)
      .select("_id name userId")
      .lean(),

    Order.findById(commission.order)
      .select("_id orderNumber")
      .lean(),

    OrderItem.find({
      orderId: commission.order,
    })
      .select("productName quantity")
      .lean(),
  ]);

  if (!receiver || !buyer) return;

  const receiverName = receiver.name || "Member";
  const buyerName = buyer.name || "A member";

  const productNames = items.length
    ? items
        .map((item) => {
          const name = item.productName || "Product";

          return item.quantity > 1
            ? `${name} × ${item.quantity}`
            : name;
        })
        .join(", ")
    : "product purchase";

  const orderNumber =
    order?.orderNumber || String(commission.order);

  const amount = money(commission.commissionAmount);

  const message =
    `${receiverName}, you received ${amount} commission ` +
    `from ${buyerName}'s purchase of ${productNames}. ` +
    `Order ${orderNumber} • Level ${commission.level}.`;

  await emit({
    recipientId: receiver._id,
    recipientRole: receiver.role,
    eventId: `product-commission:${commission._id}:wallet-credited`,
    title: "Product Purchase Commission Received",
    message,
    type: "COMMISSION_RECEIVED",
    referenceId: commission._id,
    referenceType: "ProductOrderCommission",
    metadata: {
      amount: commission.commissionAmount,
      buyerName,
      buyerUserId: buyer.userId,
      receiverName,
      orderNumber,
      productNames: items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
      })),
      level: commission.level,
      receiverType: commission.receiverType,
      commissionType: "PRODUCT_ORDER",
    },
  });
};

/* =========================
   PACKAGING NOTIFICATIONS
========================= */

const processPackagingAssignment = async (assignment) => {
  if (!validObjectId(assignment.staff)) return;

  const staff = await PackagingStaff.findById(assignment.staff)
    .select("_id branchId role")
    .lean();

  if (!staff || staff.isActive === false) return;

  const order = await Order.findById(assignment.order)
    .select("_id orderNumber userId")
    .lean();

  const orderNumber = order?.orderNumber || String(assignment.order);

  const statusType = {
    ASSIGNED: "PACKAGING_ASSIGNED",
    PACKING: "PACKAGING_STARTED",
    PACKED: "PACKAGING_COMPLETED",
    READY_FOR_DISPATCH: "PACKAGE_READY",
  }[assignment.status];

  if (!statusType) return;

  await emit({
    recipientId: staff._id,
    recipientRole: "PACKAGING",
    eventId: `packaging:${assignment._id}:status:${assignment.status}`,
    title: "Packaging Task Update",
    message: `Order ${orderNumber} is ${assignment.status
      .replaceAll("_", " ")
      .toLowerCase()}.`,
    type: statusType,
    referenceId: assignment.order,
    referenceType: "Order",
    branchId: staff.branchId || null,
    metadata: {
      assignmentId: assignment._id,
      assignmentStatus: assignment.status,
      orderNumber,
    },
  });

  if (assignment.status === "READY_FOR_DISPATCH" && order?.userId) {
    const customer = await User.findById(order.userId)
      .select("_id role")
      .lean();

    if (customer) {
      await emit({
        recipientId: customer._id,
        recipientRole: customer.role,
        eventId: `order:${order._id}:packaging:READY_FOR_DISPATCH`,
        title: "Order Ready for Dispatch",
        message: `Your order ${orderNumber} is packed and ready for dispatch.`,
        type: "ORDER_UPDATED",
        referenceId: order._id,
        referenceType: "Order",
      });
    }
  }
};

/* =========================
   DATABASE SCANNER
========================= */

const scanModel = async (Model, lastSuccessfulAt, handler) => {
  const filter = lastSuccessfulAt
    ? {
        updatedAt: {
          $gte: new Date(lastSuccessfulAt.getTime() - 1000),
        },
      }
    : {};

  const cursor = Model.find(filter).lean().cursor();

  for await (const document of cursor) {
    await handler(document);
  }
};

/* =========================
   MAIN SYNC
========================= */

const runNotificationSync = async () => {
  if (running) {
    console.log("[Notification Sync] Previous run still active.");
    return;
  }

  running = true;

  const runStartedAt = new Date();

  try {
    const state = await NotificationSyncState.findById(
      "notification-sync"
    ).lean();

    const lastSuccessfulAt = state?.lastSuccessfulAt || null;

    const admins = await User.find({
      role: "SUPER_ADMIN",
      isActive: { $ne: false },
    })
      .select("_id role")
      .lean();

    await scanModel(Order, lastSuccessfulAt, (doc) =>
      processOrder(doc, admins)
    );

    await scanModel(User, lastSuccessfulAt, (doc) =>
      processUser(doc, admins)
    );

    await scanModel(WalletTransaction, lastSuccessfulAt, (doc) =>
      processWalletTransaction(doc)
    );

    await scanModel(CommissionTransaction, lastSuccessfulAt, (doc) =>
      processCommission(doc)
    );

    // Product commissions: only notify after wallet credit.
    await scanModel(ProductOrderCommission, lastSuccessfulAt, (doc) =>
      processProductOrderCommissionNotification(doc)
    );

    await scanModel(PackagingAssignment, lastSuccessfulAt, (doc) =>
      processPackagingAssignment(doc)
    );

    await NotificationSyncState.findByIdAndUpdate(
      "notification-sync",
      {
        $set: {
          lastSuccessfulAt: runStartedAt,
          lastRunAt: new Date(),
          lastError: "",
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    console.log(
      `[Notification Sync] Completed at ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error("[Notification Sync] Failed:", error);

    await NotificationSyncState.findByIdAndUpdate(
      "notification-sync",
      {
        $set: {
          lastRunAt: new Date(),
          lastError: error.message,
        },
      },
      { upsert: true }
    ).catch((stateError) => {
      console.error("[Notification Sync] Checkpoint error:", stateError);
    });
  } finally {
    running = false;
  }
};

/* =========================
   START / STOP
========================= */

const startNotificationSync = () => {
  if (timer) return;

  console.log("[Notification Sync] Starting 30-second polling.");

  // Run once immediately, then every 30 seconds.
  runNotificationSync();

  timer = setInterval(runNotificationSync, POLL_INTERVAL);

  if (typeof timer.unref === "function") {
    timer.unref();
  }
};

const stopNotificationSync = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

module.exports = {
  startNotificationSync,
  stopNotificationSync,
  runNotificationSync,
};