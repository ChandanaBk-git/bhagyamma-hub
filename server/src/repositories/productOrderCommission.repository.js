const mongoose = require("mongoose");

const ProductOrderCommission = require(
  "../models/productOrderCommission.model"
);


/* =========================================================
   HELPERS
========================================================= */

const toObjectId = (id) => {
  if (!id) {
    return null;
  }

  if (id instanceof mongoose.Types.ObjectId) {
    return id;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return new mongoose.Types.ObjectId(id);
};


const normalizeIds = (ids) => {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  return ids
    .map(toObjectId)
    .filter(Boolean);
};


/* =========================================================
   CREATE
========================================================= */

const create = async (
  commissionData
) => {
  return ProductOrderCommission.create(
    commissionData
  );
};


/* =========================================================
   CREATE MANY
========================================================= */

const createMany = async (
  commissionData
) => {
  if (
    !Array.isArray(commissionData) ||
    commissionData.length === 0
  ) {
    return [];
  }

  return ProductOrderCommission.insertMany(
    commissionData
  );
};


/* =========================================================
   FIND BY ID
========================================================= */

const findById = async (
  id
) => {
  const objectId =
    toObjectId(id);

  if (!objectId) {
    return null;
  }

  return ProductOrderCommission.findById(
    objectId
  )
    .populate(
      "order",
      "orderNumber subtotal discount deliveryCharge finalAmount paymentStatus"
    )
    .populate(
      "buyer",
      "name email mobile userId role membershipStatus"
    )
    .populate(
      "receiver",
      "name email mobile userId role"
    )
    .lean();
};


/* =========================================================
   FIND ALL
========================================================= */

const findAll = async (
  filter = {}
) => {
  return ProductOrderCommission.find(
    filter
  )
    .populate(
      "order",
      "orderNumber subtotal discount deliveryCharge finalAmount paymentStatus"
    )
    .populate(
      "buyer",
      "name email mobile userId role membershipStatus"
    )
    .populate(
      "receiver",
      "name email mobile userId role"
    )
    .sort({
      createdAt: -1,
    })
    .lean();
};


/* =========================================================
   FIND BY ORDER
========================================================= */

const findByOrder = async (
  orderId
) => {
  const objectId =
    toObjectId(orderId);

  if (!objectId) {
    return [];
  }

  return ProductOrderCommission.find({
    order: objectId,
  })
    .populate(
      "receiver",
      "name email mobile userId role"
    )
    .populate(
      "buyer",
      "name email mobile userId role membershipStatus"
    )
    .sort({
      level: 1,
    })
    .lean();
};


/* =========================================================
   FIND BY BUYER
========================================================= */

const findByBuyer = async (
  buyerId
) => {
  const objectId =
    toObjectId(buyerId);

  if (!objectId) {
    return [];
  }

  return ProductOrderCommission.find({
    buyer: objectId,
  })
    .populate(
      "order",
      "orderNumber subtotal discount deliveryCharge finalAmount paymentStatus"
    )
    .populate(
      "receiver",
      "name email mobile userId role"
    )
    .sort({
      createdAt: -1,
    })
    .lean();
};


/* =========================================================
   FIND BY RECEIVER
========================================================= */

const findByReceiver = async (
  receiverId
) => {
  const objectId =
    toObjectId(receiverId);

  if (!objectId) {
    return [];
  }

  return ProductOrderCommission.find({
    receiver: objectId,
  })
    .populate(
      "order",
      "orderNumber subtotal discount deliveryCharge finalAmount paymentStatus"
    )
    .populate(
      "buyer",
      "name email mobile userId role membershipStatus"
    )
    .sort({
      createdAt: -1,
    })
    .lean();
};


/* =========================================================
   FIND BY RECEIVERS
========================================================= */

const findByReceivers = async (
  receiverIds
) => {
  const objectIds =
    normalizeIds(receiverIds);

  if (objectIds.length === 0) {
    return [];
  }

  return ProductOrderCommission.find({
    receiver: {
      $in: objectIds,
    },
  })
    .populate(
      "order",
      "orderNumber subtotal discount deliveryCharge finalAmount paymentStatus"
    )
    .populate(
      "buyer",
      "name email mobile userId role membershipStatus"
    )
    .sort({
      createdAt: -1,
    })
    .lean();
};


/* =========================================================
   FIND EXISTING COMMISSION
========================================================= */

const findExistingCommission = async ({
  order,
  receiver,
  level,
}) => {
  const orderId =
    toObjectId(order);

  const receiverId =
    toObjectId(receiver);

  if (
    !orderId ||
    !receiverId ||
    level === undefined ||
    level === null
  ) {
    return null;
  }

  return ProductOrderCommission.findOne({
    order: orderId,

    receiver: receiverId,

    level: Number(level),

    type: "PRODUCT_ORDER",
  })
    .sort({
      createdAt: -1,
    })
    .lean();
};


/* =========================================================
   FIND COMMISSIONS FOR ORDER AND RECEIVER
========================================================= */

const findByOrderAndReceiver = async (
  orderId,
  receiverId
) => {
  const orderObjectId =
    toObjectId(orderId);

  const receiverObjectId =
    toObjectId(receiverId);

  if (
    !orderObjectId ||
    !receiverObjectId
  ) {
    return [];
  }

  return ProductOrderCommission.find({
    order: orderObjectId,

    receiver: receiverObjectId,

    type: "PRODUCT_ORDER",
  })
    .sort({
      level: 1,
    })
    .lean();
};


/* =========================================================
   FIND MANAGER COMMISSION
========================================================= */

/*
 * BH000002 is always the Manager.
 *
 * This helper allows the service/reporting layer to
 * retrieve the fixed Manager Level-1 commissions.
 */

const findManagerCommissions = async (
  managerId
) => {
  const objectId =
    toObjectId(managerId);

  if (!objectId) {
    return [];
  }

  return ProductOrderCommission.find({
    receiver: objectId,

    receiverType: "MANAGER",

    level: 1,

    type: "PRODUCT_ORDER",
  })
    .populate(
      "order",
      "orderNumber subtotal discount deliveryCharge finalAmount paymentStatus"
    )
    .populate(
      "buyer",
      "name email mobile userId role membershipStatus"
    )
    .sort({
      createdAt: -1,
    })
    .lean();
};


/* =========================================================
   FIND PENDING COMMISSIONS
========================================================= */

const findPending = async (
  filter = {}
) => {
  return ProductOrderCommission.find({
    ...filter,

    status: "PENDING",
  })
    .populate(
      "order",
      "orderNumber subtotal discount deliveryCharge finalAmount paymentStatus"
    )
    .populate(
      "buyer",
      "name email mobile userId role membershipStatus"
    )
    .populate(
      "receiver",
      "name email mobile userId role"
    )
    .sort({
      createdAt: 1,
    })
    .lean();
};


/* =========================================================
   FIND WALLET-CREDITED COMMISSIONS
========================================================= */

const findWalletCredited = async (
  filter = {}
) => {
  return ProductOrderCommission.find({
    ...filter,

    walletCredited: true,
  })
    .sort({
      createdAt: -1,
    })
    .lean();
};


/* =========================================================
   FIND NOT WALLET-CREDITED COMMISSIONS
========================================================= */

const findNotWalletCredited = async (
  filter = {}
) => {
  return ProductOrderCommission.find({
    ...filter,

    walletCredited: false,

    status: {
      $in: [
        "PENDING",
        "PAID",
      ],
    },
  })
    .sort({
      createdAt: 1,
    })
    .lean();
};


/* =========================================================
   MARK AS PAID
========================================================= */

const markAsPaid = async (
  commissionId
) => {
  const objectId =
    toObjectId(commissionId);

  if (!objectId) {
    return null;
  }

  return ProductOrderCommission.findByIdAndUpdate(
    objectId,

    {
      $set: {
        status: "PAID",
      },
    },

    {
      new: true,

      runValidators: true,
    }
  )
    .populate(
      "receiver",
      "name email mobile userId role"
    )
    .populate(
      "buyer",
      "name email mobile userId role membershipStatus"
    )
    .lean();
};


/* =========================================================
   MARK AS CANCELLED
========================================================= */

const markAsCancelled = async (
  commissionId
) => {
  const objectId =
    toObjectId(commissionId);

  if (!objectId) {
    return null;
  }

  return ProductOrderCommission.findByIdAndUpdate(
    objectId,

    {
      $set: {
        status: "CANCELLED",
      },
    },

    {
      new: true,

      runValidators: true,
    }
  )
    .lean();
};


/* =========================================================
   MARK AS REVERSED
========================================================= */

const markAsReversed = async (
  commissionId
) => {
  const objectId =
    toObjectId(commissionId);

  if (!objectId) {
    return null;
  }

  return ProductOrderCommission.findByIdAndUpdate(
    objectId,

    {
      $set: {
        status: "REVERSED",
      },
    },

    {
      new: true,

      runValidators: true,
    }
  )
    .lean();
};


/* =========================================================
   MARK WALLET CREDITED
========================================================= */

const markWalletCredited = async (
  commissionId,
  walletReference = ""
) => {
  const objectId =
    toObjectId(commissionId);

  if (!objectId) {
    return null;
  }

  return ProductOrderCommission.findByIdAndUpdate(
    objectId,

    {
      $set: {
        walletCredited:
          true,

        walletCreditedAt:
          new Date(),

        walletReference:
          String(
            walletReference || ""
          ).trim(),

        status:
          "PAID",
      },
    },

    {
      new: true,

      runValidators: true,
    }
  )
    .lean();
};


/* =========================================================
   GET TOTAL BY RECEIVER
========================================================= */

const getTotalByReceiver = async (
  receiverId,
  statusFilter = [
    "PAID",
    "COMPLETED",
  ]
) => {
  const objectId =
    toObjectId(receiverId);

  if (!objectId) {
    return 0;
  }

  const result =
    await ProductOrderCommission.aggregate([
      {
        $match: {
          receiver: objectId,

          status: {
            $in: statusFilter,
          },

          type:
            "PRODUCT_ORDER",
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: {
              $ifNull: [
                "$commissionAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

  return Number(
    result?.[0]?.total || 0
  );
};


/* =========================================================
   GET TOTAL BY BUYER
========================================================= */

const getTotalByBuyer = async (
  buyerId
) => {
  const objectId =
    toObjectId(buyerId);

  if (!objectId) {
    return 0;
  }

  const result =
    await ProductOrderCommission.aggregate([
      {
        $match: {
          buyer: objectId,

          type:
            "PRODUCT_ORDER",
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: {
              $ifNull: [
                "$commissionAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

  return Number(
    result?.[0]?.total || 0
  );
};


/* =========================================================
   GET MANAGER TOTAL
========================================================= */

/*
 * Specifically calculates the total product-order
 * commission received by BH000002 / Manager.
 */

const getManagerTotal = async (
  managerId
) => {
  const objectId =
    toObjectId(managerId);

  if (!objectId) {
    return 0;
  }

  const result =
    await ProductOrderCommission.aggregate([
      {
        $match: {
          receiver: objectId,

          receiverType:
            "MANAGER",

          level: 1,

          type:
            "PRODUCT_ORDER",

          status: {
            $in: [
              "PAID",
              "COMPLETED",
            ],
          },
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: {
              $ifNull: [
                "$commissionAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

  return Number(
    result?.[0]?.total || 0
  );
};


/* =========================================================
   GET SUMMARY BY RECEIVER
========================================================= */

const getSummaryByReceiver = async (
  receiverId
) => {
  const objectId =
    toObjectId(receiverId);

  if (!objectId) {
    return {
      total: 0,
      paid: 0,
      pending: 0,
      cancelled: 0,
      reversed: 0,
      count: 0,
    };
  }

  const result =
    await ProductOrderCommission.aggregate([
      {
        $match: {
          receiver:
            objectId,

          type:
            "PRODUCT_ORDER",
        },
      },

      {
        $group: {
          _id: null,

          paid: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    [
                      "PAID",
                      "COMPLETED",
                    ],
                  ],
                },

                {
                  $ifNull: [
                    "$commissionAmount",
                    0,
                  ],
                },

                0,
              ],
            },
          },

          pending: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "PENDING",
                  ],
                },

                {
                  $ifNull: [
                    "$commissionAmount",
                    0,
                  ],
                },

                0,
              ],
            },
          },

          cancelled: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "CANCELLED",
                  ],
                },

                {
                  $ifNull: [
                    "$commissionAmount",
                    0,
                  ],
                },

                0,
              ],
            },
          },

          reversed: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$status",
                    "REVERSED",
                  ],
                },

                {
                  $ifNull: [
                    "$commissionAmount",
                    0,
                  ],
                },

                0,
              ],
            },
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

  const paid =
    Number(
      result?.[0]?.paid || 0
    );

  const pending =
    Number(
      result?.[0]?.pending || 0
    );

  const cancelled =
    Number(
      result?.[0]?.cancelled || 0
    );

  const reversed =
    Number(
      result?.[0]?.reversed || 0
    );

  return {
    total:
      paid +
      pending +
      cancelled +
      reversed,

    paid,

    pending,

    cancelled,

    reversed,

    count:
      Number(
        result?.[0]?.count || 0
      ),
  };
};


/* =========================================================
   COUNT
========================================================= */

const count = async (
  filter = {}
) => {
  return ProductOrderCommission.countDocuments(
    filter
  );
};


/* =========================================================
   COUNT BY RECEIVER
========================================================= */

const countByReceiver = async (
  receiverId
) => {
  const objectId =
    toObjectId(receiverId);

  if (!objectId) {
    return 0;
  }

  return ProductOrderCommission.countDocuments({
    receiver:
      objectId,

    type:
      "PRODUCT_ORDER",
  });
};


/* =========================================================
   DELETE BY ORDER
========================================================= */

/*
 * Normally paid commissions should NOT be deleted.

 * This function exists for controlled cleanup/testing
 * of unpaid or test orders.
 */

const deleteByOrder = async (
  orderId
) => {
  const objectId =
    toObjectId(orderId);

  if (!objectId) {
    return {
      deletedCount: 0,
    };
  }

  return ProductOrderCommission.deleteMany({
    order: objectId,
  });
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  // Create
  create,
  createMany,

  // Find
  findById,
  findAll,
  findByOrder,
  findByBuyer,
  findByReceiver,
  findByReceivers,
  findExistingCommission,
  findByOrderAndReceiver,
  findManagerCommissions,
  findPending,
  findWalletCredited,
  findNotWalletCredited,

  // Status
  markAsPaid,
  markAsCancelled,
  markAsReversed,

  // Wallet
  markWalletCredited,

  // Totals
  getTotalByReceiver,
  getTotalByBuyer,
  getManagerTotal,
  getSummaryByReceiver,

  // Counts
  count,
  countByReceiver,

  // Cleanup
  deleteByOrder,
};