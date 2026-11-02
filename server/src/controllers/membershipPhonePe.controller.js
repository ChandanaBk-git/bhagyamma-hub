
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const User = require("../models/user.model");

const MembershipPaymentRecord = require(
    "../models/membershipPaymentRecord.model"
);

const phonepeService = require("../services/phonepe.service");

const sellingPointService = require(
    "../services/sellingPoint.service"
);

const MEMBERSHIP_AMOUNT = 2000;

/* =====================================================
   HELPERS
===================================================== */

const getUserId = (user) => {
    return (
        user?._id?.toString() ||
        user?.id?.toString() ||
        user?.userId?.toString() ||
        null
    );
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

const getTransactionId = (paymentStatus) => {
    return (
        paymentStatus?.paymentDetails?.find(
            (payment) => payment?.transactionId
        )?.transactionId ||
        paymentStatus?.transactionId ||
        null
    );
};

const getFrontendUrl = () => {
    const url = process.env.PHONEPE_FRONTEND_URL;

    if (!url || !/^https:\/\//i.test(url)) {
        throw new ApiError(
            500,
            "PHONEPE_FRONTEND_URL is missing or invalid"
        );
    }

    return url.replace(/\/+$/, "");
};

/* =====================================================
   CREATE MEMBERSHIP PHONEPE PAYMENT
===================================================== */

const createMembershipPayment = asyncHandler(
    async (req, res) => {

        const userId = getUserId(req.user);

        if (!userId) {
            throw new ApiError(
                401,
                "Please login first"
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        if (
            String(user.membershipStatus).toLowerCase() ===
            "active"
        ) {
            throw new ApiError(
                409,
                "Your membership is already active"
            );
        }

        // Find existing membership payment record.

        let record = await MembershipPaymentRecord.findOne({
            user: userId,
        });

        if (
            record &&
            record.status === "VERIFIED"
        ) {
            throw new ApiError(
                409,
                "Membership payment has already been verified"
            );
        }

        // Generate a unique merchant order ID.

        const merchantOrderId =
            `BH_MEM_${userId}_${Date.now()}`;

        const frontendUrl = getFrontendUrl();

        const redirectUrl =
            `${frontendUrl}/payment/phonepe/callback` +
            `?type=membership` +
            `&merchantOrderId=${encodeURIComponent(
                merchantOrderId
            )}`;

        // Save pending record before creating checkout.

        if (!record) {
            record = new MembershipPaymentRecord({
                user: userId,
            });
        }

        record.amount = MEMBERSHIP_AMOUNT;
        record.status = "PENDING_VERIFICATION";
        record.paymentMethod = "PhonePe";
        record.paymentReference = merchantOrderId;

        await record.save();

        // Create actual PhonePe checkout.

        let payment;

        try {
            payment = await phonepeService.createPayment({
                merchantOrderId,
                amount: MEMBERSHIP_AMOUNT,
                redirectUrl,
            });
        } catch (error) {
            console.error(
                "Membership PhonePe creation error:",
                error.message
            );

            throw new ApiError(
                502,
                "Unable to create membership payment with PhonePe"
            );
        }

        const checkoutUrl = getCheckoutUrl(payment);

        if (
            !checkoutUrl ||
            !/^https:\/\//i.test(checkoutUrl)
        ) {
            throw new ApiError(
                502,
                "PhonePe checkout URL was not received"
            );
        }

        // Store merchant order details.

        record.merchantOrderId = merchantOrderId;
        record.phonePeOrderId = payment?.orderId || null;
        record.phonePeState = "PENDING";

        await record.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                "Membership payment created successfully",
                {
                    amount: MEMBERSHIP_AMOUNT,
                    merchantOrderId,
                    redirectUrl: checkoutUrl,
                    paymentStatus: "PENDING",
                }
            )
        );
    }
);

/* =====================================================
   VERIFY MEMBERSHIP PHONEPE PAYMENT
===================================================== */

const verifyMembershipPayment = asyncHandler(
    async (req, res) => {

        const userId = getUserId(req.user);

        const { merchantOrderId } = req.params;

        if (!userId) {
            throw new ApiError(
                401,
                "Please login first"
            );
        }

        if (!merchantOrderId) {
            throw new ApiError(
                400,
                "Merchant order ID is required"
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        const record =
            await MembershipPaymentRecord.findOne({
                user: userId,
                merchantOrderId,
            });

        if (!record) {
            throw new ApiError(
                404,
                "Membership payment record not found"
            );
        }

        // Already verified and activated.

        if (
            record.status === "VERIFIED" &&
            String(user.membershipStatus).toLowerCase() ===
            "active"
        ) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Membership is already active",
                    {
                        success: true,
                        paymentStatus: "COMPLETED",
                        membershipStatus: "Active",
                        sellingPoints: user.sellingPoints,
                    }
                )
            );
        }

        // Verify directly with PhonePe.

        let paymentStatus;

        try {
            paymentStatus =
                await phonepeService.getPaymentStatus(
                    merchantOrderId
                );
        } catch (error) {
            console.error(
                "Membership payment verification error:",
                error.message
            );

            throw new ApiError(
                502,
                "Unable to verify payment with PhonePe. Please retry."
            );
        }

        const state = String(
            paymentStatus?.state || ""
        ).toUpperCase();

        // PAYMENT COMPLETED

        if (state === "COMPLETED") {

            // PhonePe amount is in paise.

            const paidAmount = Number(
                paymentStatus?.amount
            );

            const expectedAmount =
                MEMBERSHIP_AMOUNT * 100;

            if (
                !Number.isFinite(paidAmount) ||
                paidAmount !== expectedAmount
            ) {
                throw new ApiError(
                    409,
                    "PhonePe payment amount does not match ₹2,000"
                );
            }

            const transactionId =
                getTransactionId(paymentStatus);

            // Activate membership using existing business logic.
            // This preserves existing SP and commission rules.

            const activation =
                await sellingPointService.activateMembership(
                    userId,
                    "MembershipPayment",
                    {}
                );

            const updatedUser =
                await User.findById(userId);

            if (
                String(
                    updatedUser?.membershipStatus
                ).toLowerCase() !== "active"
            ) {
                throw new ApiError(
                    500,
                    "Payment completed but membership activation failed. Contact support."
                );
            }

            // Save verified payment details.

            record.status = "VERIFIED";
            record.paymentMethod = "PhonePe";
            record.paymentReference =
                transactionId || merchantOrderId;

            record.paymentDate = new Date();
            record.verifiedAt = new Date();

            record.phonePeState = "COMPLETED";
            record.phonePeTransactionId =
                transactionId;

            record.phonePePaidAt = new Date();
            record.paidAmount = MEMBERSHIP_AMOUNT;

            record.verificationNotes =
                "Payment verified directly through PhonePe";

            await record.save();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Membership activated successfully",
                    {
                        success: true,
                        paymentStatus: "COMPLETED",
                        membershipStatus:
                            updatedUser.membershipStatus,

                        sellingPoints:
                            updatedUser.sellingPoints,

                        transactionId,

                        newlyActivated:
                            activation?.newlyActivated || false,
                    }
                )
            );
        }

        // PAYMENT FAILED

        if (
            state === "FAILED" ||
            state === "CANCELLED"
        ) {

            record.phonePeState = state;

            await record.save();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Membership payment was not successful",
                    {
                        success: false,
                        paymentStatus: state,
                        membershipStatus:
                            user.membershipStatus,
                    }
                )
            );
        }

        // PAYMENT STILL PENDING

        return res.status(200).json(
            new ApiResponse(
                200,
                "Membership payment is still pending",
                {
                    success: false,
                    paymentStatus: "PENDING",
                    membershipStatus:
                        user.membershipStatus,
                }
            )
        );
    }
);

/* =====================================================
   EXPORTS
===================================================== */

module.exports = {
    createMembershipPayment,
    verifyMembershipPayment,
};
