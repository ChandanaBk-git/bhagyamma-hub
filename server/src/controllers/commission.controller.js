const commissionRepository =
    require("../repositories/commission.repository");

const commissionService =
    require("../services/commission.service");

console.log("Commission controller loaded");

// ============================================================
// GET ALL COMMISSIONS
// ============================================================

const getAllCommissions =
    async (req, res, next) => {

        try {

            const commissions =
                await commissionService.findAll();

            return res.status(200).json({

                success: true,

                count:
                    commissions.length,

                data:
                    commissions,

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// GET MY COMMISSIONS
// ============================================================

const getMyCommissions =
    async (req, res, next) => {

        try {

            const userId =
                req.user?._id ||
                req.user?.id;

            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Authenticated user ID not found.",

                });
            }

            const commissions =
                await commissionService.findByUser(
                    userId
                );

            return res.status(200).json({

                success: true,

                count:
                    commissions.length,

                data:
                    commissions,

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// GET COMMISSION BY ID
// ============================================================

const getCommissionById =
    async (req, res, next) => {

        try {

            const commission =
                await commissionService.findById(
                    req.params.id
                );

            if (!commission) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Commission not found.",

                });
            }

            const userId =
                req.user?._id ||
                req.user?.id;

            const role =
                String(
                    req.user?.role || ""
                ).toUpperCase();

            const receiverId =
                commission.receiver
                    ? String(
                        commission.receiver._id ||
                        commission.receiver
                    )
                    : null;

            const isOwner =
                receiverId &&
                String(userId) === receiverId;

            const isSuperAdmin =
                role === "SUPER_ADMIN";

            if (
                !isOwner &&
                !isSuperAdmin
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You are not authorized to view this commission.",

                });
            }

            return res.status(200).json({

                success: true,

                data:
                    commission,

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// GET MY COMMISSION SUMMARY
// ============================================================

const getMyCommissionSummary =
    async (req, res, next) => {

        try {

            const userId =
                req.user?._id ||
                req.user?.id;

            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Authenticated user ID not found.",

                });
            }

            const summary =
                await commissionService
                    .getCommissionSummary(
                        userId
                    );

            return res.status(200).json({

                success: true,

                data:
                    summary,

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// GET MY COMMISSION TOTAL
// ============================================================

const getMyCommissionTotal =
    async (req, res, next) => {

        try {

            const userId =
                req.user?._id ||
                req.user?.id;

            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Authenticated user ID not found.",

                });
            }

            const total =
                await commissionService
                    .getTotalCommission(
                        userId
                    );

            return res.status(200).json({

                success: true,

                data: {

                    total,

                },

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// BACKFILL EXISTING PAID MEMBERS
// ============================================================
//
// POST
// /api/v1/commissions/backfill-paid-memberships
//
// Route-level authentication / SUPER_ADMIN authorization
// should remain in your commission.routes.js.
//
// ============================================================

const backfillPaidMembershipCommissions =
    async (req, res, next) => {

        try {

            const result =
                await commissionService
                    .backfillPaidMembershipCommissions();

            return res.status(200).json({

                success: true,

                message:
                    "Existing paid membership commissions processed successfully.",

                data:
                    result,

            });

        } catch (error) {

            next(error);

        }
    };


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getAllCommissions,

    getMyCommissions,

    getCommissionById,

    getMyCommissionSummary,

    getMyCommissionTotal,

    backfillPaidMembershipCommissions,

};