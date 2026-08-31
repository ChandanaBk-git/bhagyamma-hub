const mongoose = require("mongoose");

const CommissionTransaction = require(
    "../models/commissionTransaction.model"
);

// ============================================================
// HELPERS
// ============================================================

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

// ============================================================
// CREATE
// ============================================================

const create = async (commissionData) => {
    return CommissionTransaction.create(
        commissionData
    );
};

// ============================================================
// CREATE MANY
// ============================================================

const createMany = async (commissionData) => {
    if (
        !Array.isArray(commissionData) ||
        commissionData.length === 0
    ) {
        return [];
    }

    return CommissionTransaction.insertMany(
        commissionData
    );
};

// ============================================================
// FIND ALL
// ============================================================

const findAll = async (filter = {}) => {
    return CommissionTransaction.find(filter)
        .populate(
            "receiver",
            "name email mobile userId role"
        )
        .populate(
            "fromUser",
            "name email mobile userId role"
        )
        .sort({
            createdAt: -1,
        })
        .lean();
};

// ============================================================
// FIND BY ID
// ============================================================

const findById = async (id) => {
    const objectId = toObjectId(id);

    if (!objectId) {
        return null;
    }

    return CommissionTransaction.findById(
        objectId
    )
        .populate(
            "receiver",
            "name email mobile userId role"
        )
        .populate(
            "fromUser",
            "name email mobile userId role"
        )
        .lean();
};

// ============================================================
// FIND BY USER
//
// IMPORTANT:
// Commission belongs to RECEIVER.
// ============================================================

const findByUser = async (userId) => {
    const objectId = toObjectId(userId);

    if (!objectId) {
        return [];
    }

    return CommissionTransaction.find({
        receiver: objectId,
    })
        .populate(
            "receiver",
            "name email mobile userId role"
        )
        .populate(
            "fromUser",
            "name email mobile userId role"
        )
        .sort({
            createdAt: -1,
        })
        .lean();
};

// ============================================================
// FIND BY RECEIVERS
//
// Used by Manager Commission page.
// ============================================================

const findByReceivers = async (receiverIds) => {
    const objectIds = normalizeIds(
        receiverIds
    );

    if (objectIds.length === 0) {
        return [];
    }

    return CommissionTransaction.find({
        receiver: {
            $in: objectIds,
        },
    })
        .populate(
            "receiver",
            "name email mobile userId role"
        )
        .populate(
            "fromUser",
            "name email mobile userId role"
        )
        .sort({
            createdAt: -1,
        })
        .lean();
};

// ============================================================
// FIND PAID BY RECEIVERS
// ============================================================

const findPaidByReceivers = async (
    receiverIds
) => {
    const objectIds = normalizeIds(
        receiverIds
    );

    if (objectIds.length === 0) {
        return [];
    }

    return CommissionTransaction.find({
        receiver: {
            $in: objectIds,
        },

        status: {
            $in: [
                "PAID",
                "COMPLETED",
            ],
        },
    })
        .populate(
            "receiver",
            "name email mobile userId role"
        )
        .populate(
            "fromUser",
            "name email mobile userId role"
        )
        .sort({
            createdAt: -1,
        })
        .lean();
};

// ============================================================
// FIND EXISTING COMMISSION
//
// Duplicate protection:
//
// receiver + fromUser + level + type
// ============================================================

const findExistingCommission = async ({
    receiver,
    fromUser,
    level,
    type = "JOINING",
}) => {
    const receiverId =
        toObjectId(receiver);

    const fromUserId =
        toObjectId(fromUser);

    if (
        !receiverId ||
        !fromUserId
    ) {
        return null;
    }

    return CommissionTransaction.findOne({
        receiver: receiverId,
        fromUser: fromUserId,
        level,
        type,
    })
        .sort({
            createdAt: -1,
        })
        .lean();
};

// ============================================================
// FIND BY ORDER
// ============================================================

const findByOrder = async (orderId) => {
    const objectId =
        toObjectId(orderId);

    if (!objectId) {
        return [];
    }

    return CommissionTransaction.find({
        order: objectId,
    })
        .populate(
            "receiver",
            "name email mobile userId role"
        )
        .populate(
            "fromUser",
            "name email mobile userId role"
        )
        .sort({
            createdAt: -1,
        })
        .lean();
};

// ============================================================
// FIND BY FROM USER
//
// The user whose activity generated commission.
// ============================================================

const findByFromUser = async (
    fromUserId
) => {
    const objectId =
        toObjectId(fromUserId);

    if (!objectId) {
        return [];
    }

    return CommissionTransaction.find({
        fromUser: objectId,
    })
        .populate(
            "receiver",
            "name email mobile userId role"
        )
        .populate(
            "fromUser",
            "name email mobile userId role"
        )
        .sort({
            createdAt: -1,
        })
        .lean();
};

// ============================================================
// GET TOTAL BY USER
//
// User = commission receiver.
// ============================================================

const getTotalByUser = async (
    userId
) => {
    const objectId =
        toObjectId(userId);

    if (!objectId) {
        return 0;
    }

    const result =
        await CommissionTransaction.aggregate([
            {
                $match: {
                    receiver: objectId,
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

// ============================================================
// GET COMMISSION SUMMARY
// ============================================================

const getCommissionSummary = async (
    userId
) => {
    const objectId =
        toObjectId(userId);

    if (!objectId) {
        return {
            total: 0,
            paid: 0,
            pending: 0,
            cancelled: 0,
            count: 0,
        };
    }

    const result =
        await CommissionTransaction.aggregate([
            {
                $match: {
                    receiver: objectId,
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
                                        {
                                            $toUpper: {
                                                $ifNull: [
                                                    "$status",
                                                    "",
                                                ],
                                            },
                                        },
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
                                        {
                                            $toUpper: {
                                                $ifNull: [
                                                    "$status",
                                                    "",
                                                ],
                                            },
                                        },
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
                                    $in: [
                                        {
                                            $toUpper: {
                                                $ifNull: [
                                                    "$status",
                                                    "",
                                                ],
                                            },
                                        },

                                        [
                                            "CANCELLED",
                                            "REVERSED",
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

                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

    const summary = {
        total: 0,
        paid: Number(
            result?.[0]?.paid || 0
        ),
        pending: Number(
            result?.[0]?.pending || 0
        ),
        cancelled: Number(
            result?.[0]?.cancelled || 0
        ),
        count: Number(
            result?.[0]?.count || 0
        ),
    };

    summary.total =
        summary.paid +
        summary.pending +
        summary.cancelled;

    return summary;
};

// ============================================================
// GET SUMMARY BY RECEIVERS
// ============================================================

const getSummaryByReceivers = async (
    receiverIds
) => {
    const objectIds =
        normalizeIds(receiverIds);

    if (objectIds.length === 0) {
        return {
            paid: 0,
            pending: 0,
            cancelled: 0,
            count: 0,
        };
    }

    const result =
        await CommissionTransaction.aggregate([
            {
                $match: {
                    receiver: {
                        $in: objectIds,
                    },
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
                                        {
                                            $toUpper: {
                                                $ifNull: [
                                                    "$status",
                                                    "",
                                                ],
                                            },
                                        },

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
                                        {
                                            $toUpper: {
                                                $ifNull: [
                                                    "$status",
                                                    "",
                                                ],
                                            },
                                        },

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
                                    $in: [
                                        {
                                            $toUpper: {
                                                $ifNull: [
                                                    "$status",
                                                    "",
                                                ],
                                            },
                                        },

                                        [
                                            "CANCELLED",
                                            "REVERSED",
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

                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

    return {
        paid: Number(
            result?.[0]?.paid || 0
        ),

        pending: Number(
            result?.[0]?.pending || 0
        ),

        cancelled: Number(
            result?.[0]?.cancelled || 0
        ),

        count: Number(
            result?.[0]?.count || 0
        ),
    };
};

// ============================================================
// GET TOTAL COMMISSION BY RECEIVERS
//
// Only PAID / COMPLETED.
// ============================================================

const getTotalCommissionByReceivers =
    async (
        receiverIds
    ) => {
        const objectIds =
            normalizeIds(
                receiverIds
            );

        if (objectIds.length === 0) {
            return 0;
        }

        const result =
            await CommissionTransaction.aggregate([
                {
                    $match: {
                        receiver: {
                            $in: objectIds,
                        },

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

                        totalCommission: {
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
            result?.[0]
                ?.totalCommission || 0
        );
    };

// ============================================================
// COUNT
// ============================================================

const count = async (
    filter = {}
) => {
    return CommissionTransaction.countDocuments(
        filter
    );
};

// ============================================================
// COUNT BY RECEIVERS
// ============================================================

const countByReceivers = async (
    receiverIds
) => {
    const objectIds =
        normalizeIds(
            receiverIds
        );

    if (objectIds.length === 0) {
        return 0;
    }

    return CommissionTransaction.countDocuments({
        receiver: {
            $in: objectIds,
        },
    });
};

// ============================================================
// UPDATE STATUS
// ============================================================

const updateStatus = async (
    commissionId,
    status
) => {
    const objectId =
        toObjectId(
            commissionId
        );

    if (!objectId) {
        return null;
    }

    return CommissionTransaction.findByIdAndUpdate(
        objectId,

        {
            $set: {
                status,
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
            "fromUser",
            "name email mobile userId role"
        )
        .lean();
};

// ============================================================
// MARK AS PAID
//
// THIS WAS MISSING.
// commission.service.js calls this function.
// ============================================================

const markAsPaid = async (
    commissionId
) => {
    return updateStatus(
        commissionId,
        "PAID"
    );
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    // Create
    create,
    createMany,

    // Find
    findAll,
    findById,
    findByUser,
    findByReceivers,
    findPaidByReceivers,
    findExistingCommission,
    findByOrder,
    findByFromUser,

    // Totals
    getTotalByUser,
    getCommissionSummary,
    getSummaryByReceivers,
    getTotalCommissionByReceivers,

    // Counts
    count,
    countByReceivers,

    // Update
    updateStatus,
    markAsPaid,
};