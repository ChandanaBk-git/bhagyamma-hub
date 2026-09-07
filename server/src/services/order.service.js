const mongoose = require("mongoose");

const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const User = require("../models/user.model");

const cartService = require("./cart.service");
const sellingPointService = require("./sellingPoint.service");


const generateOrderNumber = async () => {
    const lastOrder = await Order.findOne({})
        .sort({ createdAt: -1 })
        .select("orderNumber")
        .lean();

    let nextNumber = 1;

    if (lastOrder?.orderNumber) {
        const match =
            String(lastOrder.orderNumber).match(/(\d+)$/);

        if (match) {
            nextNumber = Number(match[1]) + 1;
        }
    }

    return `BHORD${String(nextNumber).padStart(6, "0")}`;
};


const normalizeMobile = (mobile) => {
    return String(mobile || "")
        .replace(/\D/g, "");
};


const calculateOrderSellingPoints = (amount) => {
    const purchaseAmount = Number(amount || 0);

    if (purchaseAmount < 100) {
        return 0;
    }

    return Math.floor(purchaseAmount / 100) * 2;
};


const calculateGuestOrderSellingPoints = async (order) => {
    const currentMobile = normalizeMobile(
        order.customerMobile
    );

    const purchaseAmount = Math.max(
        0,
        Number(order.subtotal || 0)
    );

    let previousCarry = 0;

    if (currentMobile.length === 10) {
        const previousOrders = await Order.find({
            _id: {
                $ne: order._id,
            },

            orderType: "GUEST",

            userId: null,

            customerMobile: currentMobile,

            paymentStatus: "PAID",

            sellingPointsProcessed: true,
        })
            .sort({
                createdAt: 1,
                _id: 1,
            })
            .select(
                "subtotal spCarryForward sellingPoints sellingPointsProcessed"
            )
            .lean();

        for (const previousOrder of previousOrders) {
            if (
                previousOrder.spCarryForward !==
                    undefined &&
                previousOrder.spCarryForward !== null
            ) {
                previousCarry = Math.max(
                    0,
                    Number(
                        previousOrder.spCarryForward || 0
                    )
                );
            } else {
                const oldAmount = Math.max(
                    0,
                    Number(
                        previousOrder.subtotal || 0
                    )
                );

                const oldTotal =
                    oldAmount + previousCarry;

                previousCarry =
                    oldTotal % 100;
            }
        }
    }

    const calculationTotal =
        purchaseAmount + previousCarry;

    const completedBlocks =
        Math.floor(
            calculationTotal / 100
        );

    const pointsEarned =
        completedBlocks * 2;

    const pendingAmount =
        calculationTotal % 100;

    return {
        purchaseAmount,
        previousPendingAmount: previousCarry,
        totalAmount: calculationTotal,
        completeBlocks: completedBlocks,
        pointsEarned,
        pendingAmount,
    };
};


const createOrder = async (
    userId,
    orderData = {}
) => {
    try {
        const {
            customerName = "",
            customerMobile = "",
            customerEmail = "",
            deliveryDetails = {},
            paymentMethod = "PHONEPE",

            subtotal: guestSubtotal = 0,
            discount: guestDiscount = 0,
            walletAmount: guestWalletAmount = 0,
            deliveryCharge: guestDeliveryCharge = 0,

            items: guestItems = [],
        } = orderData;

        const isGuest =
            !userId ||
            userId === null ||
            userId === undefined;

        const orderType =
            isGuest
                ? "GUEST"
                : "MEMBER";

        let cart = null;

        if (!isGuest) {
            console.log(
                "======================================"
            );

            console.log(
                "CREATE ORDER - MEMBER CART DEBUG"
            );

            console.log(
                "ORDER userId:",
                userId
            );

            console.log(
                "ORDER userId string:",
                String(userId)
            );

            cart =
                await cartService.getCart(
                    userId
                );

            console.log(
                "CART FOUND:",
                !!cart
            );

            console.log(
                "CART ID:",
                cart?._id
            );

            console.log(
                "CART userId:",
                cart?.userId
            );

            console.log(
                "CART userId string:",
                cart?.userId
                    ? String(cart.userId)
                    : null
            );

            console.log(
                "CART ITEMS:",
                cart?.items
            );

            console.log(
                "CART ITEM COUNT:",
                cart?.items?.length
            );

            console.log(
                "CART TOTAL AMOUNT:",
                cart?.totalAmount
            );

            console.log(
                "CART TOTAL ITEMS:",
                cart?.totalItems
            );

            console.log(
                "======================================"
            );

            if (!cart) {
                throw new Error(
                    "Cart not found"
                );
            }

            if (
                !Array.isArray(cart.items) ||
                cart.items.length === 0
            ) {
                throw new Error(
                    "Cart is empty"
                );
            }
        }

        let subtotal = 0;
        let discount = 0;
        let walletAmount = 0;
        let deliveryCharge = 0;

        if (!isGuest) {
            subtotal =
                Number(
                    cart.totalAmount || 0
                );

            discount =
                Number(
                    cart.discount || 0
                );

            walletAmount =
                Number(
                    cart.walletAmount || 0
                );

            deliveryCharge = 50;
        } else {
            subtotal =
                Number(
                    guestSubtotal || 0
                );

            discount =
                Number(
                    guestDiscount || 0
                );

            walletAmount =
                Number(
                    guestWalletAmount || 0
                );

            deliveryCharge =
                Number(
                    guestDeliveryCharge || 0
                );
        }

        const finalAmount =
            Math.max(
                0,
                subtotal -
                    discount -
                    walletAmount +
                    deliveryCharge
            );

        const sellingPoints =
            calculateOrderSellingPoints(
                subtotal
            );

        const orderNumber =
            await generateOrderNumber();

        const order =
            await Order.create({
                userId:
                    isGuest
                        ? null
                        : userId,

                orderType,

                customerName:
                    String(
                        customerName || ""
                    ).trim(),

                customerMobile:
                    String(
                        customerMobile || ""
                    ).trim(),

                customerEmail:
                    String(
                        customerEmail || ""
                    ).trim(),

                orderNumber,

                subtotal,

                discount,

                walletAmount,

                deliveryCharge,

                finalAmount,

                sellingPoints,

                sellingPointsProcessed:
                    false,

                sellingPointsProcessedAt:
                    null,

                spPreviousCarryForward:
                    0,

                spCalculationTotal:
                    0,

                spCompletedBlocks:
                    0,

                spEligibleAmount:
                    0,

                spCarryForward:
                    0,

                status:
                    "PLACED",

                paymentMethod,

                paymentStatus:
                    "PENDING",

                phonePeOrderId:
                    null,

                phonePeTransactionId:
                    null,

                paidAt:
                    null,

                membershipLinked:
                    false,

                linkedAt:
                    null,

                deliveryDetails: {
                    name:
                        deliveryDetails.name ||
                        customerName ||
                        "",

                    mobile:
                        deliveryDetails.mobile ||
                        customerMobile ||
                        "",

                    address:
                        deliveryDetails.address ||
                        "",

                    city:
                        deliveryDetails.city ||
                        "",

                    state:
                        deliveryDetails.state ||
                        "",

                    pincode:
                        deliveryDetails.pincode ||
                        "",
                },

                placedAt:
                    new Date(),
            });

        let itemsToSave = [];

        if (!isGuest) {
            itemsToSave =
                Array.isArray(cart?.items)
                    ? cart.items
                    : [];
        } else {
            itemsToSave =
                Array.isArray(guestItems)
                    ? guestItems
                    : [];
        }

        if (itemsToSave.length > 0) {
            const orderItems =
                itemsToSave.map(
                    (item) => {
                        const quantity =
                            Number(
                                item.quantity || 1
                            );

                        const price =
                            Number(
                                item.price ||
                                item.productId?.price ||
                                0
                            );

                        const total =
                            Number(
                                item.total ||
                                price * quantity
                            );

                        return {
                            orderId:
                                order._id,

                            productId:
                                item.productId?._id ||
                                item.productId ||
                                null,

                            productName:
                                item.productId?.name ||
                                item.productId?.productName ||
                                item.productName ||
                                item.name ||
                                "Product",

                            quantity,

                            price,

                            total,
                        };
                    }
                );

            const validOrderItems =
                orderItems.filter(
                    (item) =>
                        item.productId
                );

            if (
                validOrderItems.length > 0
            ) {
                await OrderItem.insertMany(
                    validOrderItems
                );
            }
        }

        console.log(
            "======================================"
        );

        console.log(
            "ORDER CREATED"
        );

        console.log(
            "Order:",
            order.orderNumber
        );

        console.log(
            "Type:",
            order.orderType
        );

        console.log(
            "User:",
            userId || "GUEST"
        );

        console.log(
            "Product Subtotal: ₹",
            subtotal
        );

        console.log(
            "Delivery Charge: ₹",
            deliveryCharge
        );

        console.log(
            "Final Amount: ₹",
            finalAmount
        );

        console.log(
            "Order SP:",
            sellingPoints
        );

        console.log(
            "Payment Status:",
            "PENDING"
        );

        console.log(
            "CART WAS NOT CLEARED"
        );

        console.log(
            "======================================"
        );

        return await Order.findById(
            order._id
        ).lean();

    } catch (error) {
        console.error(
            "CREATE ORDER ERROR:",
            error
        );

        throw error;
    }
};


const placeOrder = async (
    userId,
    orderData = {}
) => {
    return createOrder(
        userId,
        orderData
    );
};


const placeGuestOrder = async (
    orderData = {}
) => {
    try {
        const customerName =
            String(
                orderData.customerName ||
                orderData.name ||
                ""
            ).trim();

        const customerMobile =
            normalizeMobile(
                orderData.customerMobile ||
                orderData.mobile ||
                ""
            );

        const customerEmail =
            String(
                orderData.customerEmail ||
                orderData.email ||
                ""
            )
                .trim()
                .toLowerCase();

        const existingDeliveryDetails =
            orderData.deliveryDetails ||
            {};

        const deliveryDetails = {
            name:
                String(
                    existingDeliveryDetails.name ||
                    customerName ||
                    ""
                ).trim(),

            mobile:
                normalizeMobile(
                    existingDeliveryDetails.mobile ||
                    customerMobile ||
                    ""
                ),

            address:
                String(
                    existingDeliveryDetails.address ||
                    orderData.address ||
                    ""
                ).trim(),

            city:
                String(
                    existingDeliveryDetails.city ||
                    orderData.city ||
                    ""
                ).trim(),

            state:
                String(
                    existingDeliveryDetails.state ||
                    orderData.state ||
                    ""
                ).trim(),

            pincode:
                String(
                    existingDeliveryDetails.pincode ||
                    orderData.pincode ||
                    ""
                )
                    .replace(
                        /\D/g,
                        ""
                    ),
        };

        if (!customerName) {
            throw new Error(
                "Customer name is required"
            );
        }

        if (
            customerMobile.length !== 10
        ) {
            throw new Error(
                "Valid 10-digit mobile number is required"
            );
        }

        if (
            !deliveryDetails.address
        ) {
            throw new Error(
                "Delivery address is required"
            );
        }

        if (
            !deliveryDetails.city
        ) {
            throw new Error(
                "City is required"
            );
        }

        if (
            !deliveryDetails.state
        ) {
            throw new Error(
                "State is required"
            );
        }

        if (
            deliveryDetails.pincode.length !== 6
        ) {
            throw new Error(
                "Valid 6-digit pincode is required"
            );
        }

        const normalizedOrderData = {
            ...orderData,

            customerName,

            customerMobile,

            customerEmail,

            deliveryDetails,

            paymentMethod:
                orderData.paymentMethod ||
                "PHONEPE",

            subtotal:
                Number(
                    orderData.subtotal || 0
                ),

            discount:
                Number(
                    orderData.discount || 0
                ),

            walletAmount:
                Number(
                    orderData.walletAmount || 0
                ),

            deliveryCharge:
                50,

            items:
                Array.isArray(
                    orderData.items
                )
                    ? orderData.items
                    : [],
        };

        return await createOrder(
            null,
            normalizedOrderData
        );

    } catch (error) {
        console.error(
            "PLACE GUEST ORDER ERROR:",
            error
        );

        throw error;
    }
};


const getOrderById = async (
    orderId,
    userId = null
) => {
    try {
        if (
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {
            throw new Error(
                "Invalid order ID"
            );
        }

        const query = {
            _id: orderId,
        };

        if (userId) {
            query.userId =
                userId;
        }

        const order =
            await Order.findOne(
                query
            )
                .populate(
                    "userId",
                    "name userId email mobile role referralCode"
                )
                .lean();

        if (!order) {
            throw new Error(
                "Order not found"
            );
        }

        const items =
            await OrderItem.find({
                orderId:
                    order._id,
            })
                .populate(
                    "productId",
                    "name productName images price"
                )
                .lean();

        return {
            ...order,
            items,
        };

    } catch (error) {
        console.error(
            "GET ORDER BY ID ERROR:",
            error
        );

        throw error;
    }
};


const getMyOrders = async (
    userId
) => {
    try {
        if (!userId) {
            return [];
        }

        const orders =
            await Order.find({
                userId,
            })
                .sort({
                    createdAt: -1,
                })
                .lean();

        if (!orders.length) {
            return [];
        }

        const orderIds =
            orders.map(
                (order) =>
                    order._id
            );

        const items =
            await OrderItem.find({
                orderId: {
                    $in:
                        orderIds,
                },
            })
                .populate(
                    "productId",
                    "name productName images price"
                )
                .lean();

        const itemsByOrder = {};

        for (
            const item
            of items
        ) {
            const key =
                item.orderId.toString();

            if (
                !itemsByOrder[key]
            ) {
                itemsByOrder[key] =
                    [];
            }

            itemsByOrder[key].push(
                item
            );
        }

        return orders.map(
            (order) => ({
                ...order,

                items:
                    itemsByOrder[
                        order._id.toString()
                    ] || [],
            })
        );

    } catch (error) {
        console.error(
            "GET MY ORDERS ERROR:",
            error
        );

        throw error;
    }
};


const getAllOrders = async (
    options = {}
) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            paymentStatus,
            orderType,
            search,
        } = options;

        const filter = {};

        if (status) {
            filter.status =
                status;
        }

        if (paymentStatus) {
            filter.paymentStatus =
                paymentStatus;
        }

        if (orderType) {
            filter.orderType =
                orderType;
        }

        if (search) {
            filter.$or = [
                {
                    orderNumber: {
                        $regex:
                            search,
                        $options:
                            "i",
                    },
                },

                {
                    customerName: {
                        $regex:
                            search,
                        $options:
                            "i",
                    },
                },

                {
                    customerMobile: {
                        $regex:
                            search,
                        $options:
                            "i",
                    },
                },

                {
                    customerEmail: {
                        $regex:
                            search,
                        $options:
                            "i",
                    },
                },
            ];
        }

        const skip =
            (Number(page) - 1) *
            Number(limit);

        const [
            orders,
            total,
        ] = await Promise.all([
            Order.find(filter)
                .populate(
                    "userId",
                    "name userId email mobile role referralCode sellingPoints membershipStatus"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(
                    Number(limit)
                )
                .lean(),

            Order.countDocuments(
                filter
            ),
        ]);

        if (!orders.length) {
            return {
                orders: [],

                pagination: {
                    page:
                        Number(page),

                    limit:
                        Number(limit),

                    total: 0,

                    pages: 0,
                },
            };
        }

        const orderIds =
            orders.map(
                (order) =>
                    order._id
            );

        const items =
            await OrderItem.find({
                orderId: {
                    $in:
                        orderIds,
                },
            })
                .populate(
                    "productId",
                    "name productName images price category brand"
                )
                .lean();

        const itemsByOrder = {};

        for (
            const item
            of items
        ) {
            const key =
                item.orderId.toString();

            if (
                !itemsByOrder[key]
            ) {
                itemsByOrder[key] =
                    [];
            }

            itemsByOrder[key].push(
                item
            );
        }

        return {
            orders:
                orders.map(
                    (order) => ({
                        ...order,

                        items:
                            itemsByOrder[
                                order._id.toString()
                            ] || [],
                    })
                ),

            pagination: {
                page:
                    Number(page),

                limit:
                    Number(limit),

                total,

                pages:
                    Math.ceil(
                        total /
                        Number(limit)
                    ),
            },
        };

    } catch (error) {
        console.error(
            "GET ALL ORDERS ERROR:",
            error
        );

        throw error;
    }
};

const getOrdersByMobile = async (
    mobile
) => {
    try {
        const normalizedMobile =
            normalizeMobile(mobile);

        if (
            normalizedMobile.length !== 10
        ) {
            throw new Error(
                "Valid 10-digit mobile number is required"
            );
        }

        const orders =
            await Order.find({
                customerMobile:
                    normalizedMobile,
            })
                .sort({
                    createdAt: -1,
                })
                .lean();

        if (!orders.length) {
            return [];
        }

        const orderIds =
            orders.map(
                (order) =>
                    order._id
            );

        const items =
            await OrderItem.find({
                orderId: {
                    $in:
                        orderIds,
                },
            })
                .populate(
                    "productId",
                    "name productName images price category brand"
                )
                .lean();

        const itemsByOrder = {};

        for (
            const item
            of items
        ) {
            const key =
                item.orderId.toString();

            if (
                !itemsByOrder[key]
            ) {
                itemsByOrder[key] =
                    [];
            }

            itemsByOrder[key].push(
                item
            );
        }

        return orders.map(
            (order) => ({
                ...order,

                items:
                    itemsByOrder[
                        order._id.toString()
                    ] || [],
            })
        );

    } catch (error) {
        console.error(
            "GET ORDERS BY MOBILE ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   LINK GUEST ORDERS TO USER
   ========================================================================== */

const linkGuestOrdersToUser = async (
    userId,
    mobile
) => {
    try {
        if (!userId) {
            throw new Error(
                "User ID is required"
            );
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                userId
            )
        ) {
            throw new Error(
                "Invalid user ID"
            );
        }

        const normalizedMobile =
            normalizeMobile(mobile);

        if (
            normalizedMobile.length !== 10
        ) {
            throw new Error(
                "Valid 10-digit mobile number is required"
            );
        }

        const result =
            await Order.updateMany(
                {
                    orderType:
                        "GUEST",

                    userId:
                        null,

                    customerMobile:
                        normalizedMobile,
                },

                {
                    $set: {
                        userId,

                        orderType:
                            "MEMBER",

                        membershipLinked:
                            true,

                        linkedAt:
                            new Date(),
                    },
                }
            );

        return {
            matchedCount:
                result.matchedCount,

            modifiedCount:
                result.modifiedCount,
        };

    } catch (error) {
        console.error(
            "LINK GUEST ORDERS ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   CLAIM GUEST ORDERS
   ==========================================================================

   Backward-compatible function.

   ========================================================================== */

const claimGuestOrders = async (
    userId,
    mobile
) => {
    try {
        if (!userId) {
            throw new Error(
                "User ID is required"
            );
        }

        const normalizedMobile =
            normalizeMobile(mobile);

        if (
            normalizedMobile.length !== 10
        ) {
            throw new Error(
                "Valid 10-digit mobile number is required"
            );
        }

        const result =
            await Order.updateMany(
                {
                    orderType:
                        "GUEST",

                    userId:
                        null,

                    customerMobile:
                        normalizedMobile,

                    paymentStatus:
                        "PAID",

                    membershipLinked:
                        false,
                },

                {
                    $set: {
                        userId,

                        orderType:
                            "MEMBER",

                        membershipLinked:
                            true,

                        linkedAt:
                            new Date(),
                    },
                }
            );

        return {
            matchedCount:
                result.matchedCount,

            modifiedCount:
                result.modifiedCount,
        };

    } catch (error) {
        console.error(
            "CLAIM GUEST ORDERS ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   CLAIM GUEST ORDERS FOR MEMBER
   ==========================================================================

   MAIN REGISTRATION RECOVERY FLOW.

   Example:

   Guest order 1 = ₹2,888

   Guest registers later with same mobile.

   This function:

       - finds PAID guest orders
       - processes oldest first
       - gives SP
       - preserves carry-forward
       - creates ORDER_PURCHASE history
       - links orders
       - updates qualifying purchase
       - activates membership when qualified

   ========================================================================== */

const claimGuestOrdersForMember = async (
    userId,
    mobile
) => {
    try {

        /* ------------------------------------------------------------------
           VALIDATE USER
           ------------------------------------------------------------------ */

        if (!userId) {
            throw new Error(
                "User ID is required"
            );
        }

        if (
            !mongoose.Types.ObjectId.isValid(
                userId
            )
        ) {
            throw new Error(
                "Invalid user ID"
            );
        }


        /* ------------------------------------------------------------------
           NORMALIZE MOBILE
           ------------------------------------------------------------------ */

        const normalizedMobile =
            normalizeMobile(mobile);

        if (
            normalizedMobile.length !== 10
        ) {
            throw new Error(
                "Valid 10-digit mobile number is required"
            );
        }


        /* ------------------------------------------------------------------
           FIND USER
           ------------------------------------------------------------------ */

        let user =
            await User.findById(
                userId
            );

        if (!user) {
            throw new Error(
                "User not found"
            );
        }


        /* ------------------------------------------------------------------
           FIND PREVIOUS PAID GUEST ORDERS
           ------------------------------------------------------------------

           VERY IMPORTANT:

           We do NOT search for:

               sellingPointsProcessed: false

           because guest orders may already have had their
           guest SP calculated when payment was completed.

           We need to recover those orders into the member account.
           ------------------------------------------------------------------ */

        const guestOrders =
            await Order.find({
                orderType:
                    "GUEST",

                userId:
                    null,

                customerMobile:
                    normalizedMobile,

                paymentStatus:
                    "PAID",

                membershipLinked:
                    false,
            })
                .sort({
                    createdAt: 1,
                    _id: 1,
                });


        /* ------------------------------------------------------------------
           NO ORDERS
           ------------------------------------------------------------------ */

        if (
            guestOrders.length === 0
        ) {
            return {
                claimedCount:
                    0,

                totalPurchaseAmount:
                    0,

                sellingPoints:
                    Number(
                        user.sellingPoints ||
                        0
                    ),

                pendingPurchaseAmount:
                    Number(
                        user.pendingPurchaseAmount ||
                        0
                    ),

                lifetimePurchase:
                    Number(
                        user.lifetimePurchase ||
                        0
                    ),

                qualifyingPurchaseAmount:
                    Number(
                        user.qualifyingPurchaseAmount ||
                        0
                    ),

                membershipStatus:
                    user.membershipStatus ||
                    "Pending",

                membershipActivated:
                    String(
                        user.membershipStatus ||
                        ""
                    )
                        .trim()
                        .toUpperCase() ===
                    "ACTIVE",

                user,
            };
        }


        /* ------------------------------------------------------------------
           PROCESS ORDERS ONE BY ONE
           ------------------------------------------------------------------ */

        let claimedCount =
            0;

        let totalPurchaseAmount =
            0;


        for (
            const guestOrder
            of guestOrders
        ) {

            const purchaseAmount =
                Math.max(
                    0,
                    Number(
                        guestOrder.subtotal ||
                        0
                    )
                );


            /* --------------------------------------------------------------
               PROCESS SP
               -------------------------------------------------------------- */

            if (
                purchaseAmount > 0
            ) {

                /*
                 * Use the existing SP service.
                 *
                 * It handles:
                 *
                 * previous pendingPurchaseAmount
                 * current purchase
                 * complete ₹100 blocks
                 * SP
                 * new carry-forward
                 * lifetime purchase
                 * ORDER_PURCHASE history
                 */

                await sellingPointService
                    .updateSellingPoints(
                        user._id,
                        purchaseAmount,
                        guestOrder._id
                    );


                totalPurchaseAmount +=
                    purchaseAmount;
            }


            /* --------------------------------------------------------------
               LINK ORDER
               -------------------------------------------------------------- */

            guestOrder.userId =
                user._id;

            guestOrder.orderType =
                "MEMBER";

            guestOrder.membershipLinked =
                true;

            guestOrder.linkedAt =
                new Date();


            await guestOrder.save();


            claimedCount +=
                1;


            /* --------------------------------------------------------------
               REFRESH USER
               -------------------------------------------------------------- */

            user =
                await User.findById(
                    user._id
                );


            if (!user) {
                throw new Error(
                    "User not found while recovering guest orders"
                );
            }
        }


        /* ------------------------------------------------------------------
           UPDATE QUALIFYING PURCHASE
           ------------------------------------------------------------------ */

        const existingQualifyingPurchase =
            Number(
                user.qualifyingPurchaseAmount ||
                0
            );


        const newQualifyingPurchase =
            existingQualifyingPurchase +
            totalPurchaseAmount;


        user.qualifyingPurchaseAmount =
            newQualifyingPurchase;


        await user.save();


        /* ------------------------------------------------------------------
           REFRESH USER
           ------------------------------------------------------------------ */

        user =
            await User.findById(
                user._id
            );


        /* ------------------------------------------------------------------
           MEMBERSHIP ACTIVATION
           ------------------------------------------------------------------

           Normally sellingPoint.service.js will activate
           membership when the user reaches the required SP.

           This is a safety check using the ₹2,000 purchase
           qualification rule.

           We DO NOT award another 40 SP here.
           ------------------------------------------------------------------ */

        if (
            user &&

            String(
                user.membershipStatus ||
                ""
            )
                .trim()
                .toUpperCase() !==
            "ACTIVE" &&

            Number(
                user.qualifyingPurchaseAmount ||
                0
            ) >= 2000
        ) {

            if (
                typeof
                    sellingPointService
                        .activateMembership ===
                "function"
            ) {

                const lastOrder =
                    guestOrders[
                        guestOrders.length - 1
                    ];


                const activation =
                    await sellingPointService
                        .activateMembership(
                            user._id,

                            "ProductPurchase",

                            {
                                orderId:
                                    lastOrder?._id ||
                                    null,
                            }
                        );


                user =
                    activation.user;
            }
        }


        /* ------------------------------------------------------------------
           FINAL REFRESH
           ------------------------------------------------------------------ */

        user =
            await User.findById(
                user._id
            );


        /* ------------------------------------------------------------------
           RESULT
           ------------------------------------------------------------------ */

        return {
            claimedCount,

            totalPurchaseAmount,

            sellingPoints:
                Number(
                    user?.sellingPoints ||
                    0
                ),

            pendingPurchaseAmount:
                Number(
                    user?.pendingPurchaseAmount ||
                    0
                ),

            lifetimePurchase:
                Number(
                    user?.lifetimePurchase ||
                    0
                ),

            qualifyingPurchaseAmount:
                Number(
                    user?.qualifyingPurchaseAmount ||
                    0
                ),

            membershipStatus:
                user?.membershipStatus ||
                "Pending",

            membershipActivated:
                String(
                    user?.membershipStatus ||
                    ""
                )
                    .trim()
                    .toUpperCase() ===
                "ACTIVE",

            user,
        };

    } catch (error) {

        console.error(
            "CLAIM GUEST ORDERS FOR MEMBER ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   PROCESS SELLING POINTS
   ========================================================================== */

const processSellingPoints = async (
    orderId
) => {
    try {

        /* ------------------------------------------------------------------
           FIND ORDER
           ------------------------------------------------------------------ */

        if (
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {
            throw new Error(
                "Invalid order ID"
            );
        }


        const order =
            await Order.findById(
                orderId
            );


        if (!order) {
            throw new Error(
                "Order not found"
            );
        }


        /* ------------------------------------------------------------------
           ONLY PAID ORDERS
           ------------------------------------------------------------------ */

        if (
            String(
                order.paymentStatus ||
                ""
            )
                .trim()
                .toUpperCase() !==
            "PAID"
        ) {

            console.log(
                `SP SKIPPED: Payment not PAID ${order.orderNumber}`
            );

            return {
                success:
                    false,

                message:
                    "Order payment is not PAID",
            };
        }


        /* ------------------------------------------------------------------
           DUPLICATE PROTECTION
           ------------------------------------------------------------------ */

        if (
            order.sellingPointsProcessed
        ) {

            return {
                success:
                    true,

                alreadyProcessed:
                    true,

                sellingPoints:
                    Number(
                        order.sellingPoints ||
                        0
                    ),

                carryForward:
                    Number(
                        order.spCarryForward ||
                        0
                    ),
            };
        }


        /* ==================================================================
           GUEST ORDER
           ================================================================== */

        if (
            !order.userId
        ) {

            const calculation =
                await calculateGuestOrderSellingPoints(
                    order
                );


            /* --------------------------------------------------------------
               STORE GUEST SP CALCULATION
               -------------------------------------------------------------- */

            order.sellingPoints =
                Number(
                    calculation.pointsEarned ||
                    0
                );


            order.spPreviousCarryForward =
                Number(
                    calculation.previousPendingAmount ||
                    0
                );


            order.spCalculationTotal =
                Number(
                    calculation.totalAmount ||
                    0
                );


            order.spCompletedBlocks =
                Number(
                    calculation.completeBlocks ||
                    0
                );


            order.spEligibleAmount =
                Number(
                    calculation.purchaseAmount ||
                    0
                );


            order.spCarryForward =
                Number(
                    calculation.pendingAmount ||
                    0
                );


            order.sellingPointsProcessed =
                true;


            order.sellingPointsProcessedAt =
                new Date();


            await order.save();


            console.log(
                "======================================"
            );

            console.log(
                "GUEST SELLING POINTS PROCESSED"
            );

            console.log(
                "Order:",
                order.orderNumber
            );

            console.log(
                "Mobile:",
                order.customerMobile
            );

            console.log(
                "Purchase Amount: ₹",
                calculation.purchaseAmount
            );

            console.log(
                "Previous Carry: ₹",
                calculation.previousPendingAmount
            );

            console.log(
                "Calculation Total: ₹",
                calculation.totalAmount
            );

            console.log(
                "Completed Blocks:",
                calculation.completeBlocks
            );

            console.log(
                "SP Earned:",
                calculation.pointsEarned
            );

            console.log(
                "Carry Forward: ₹",
                calculation.pendingAmount
            );

            console.log(
                "======================================"
            );


            return {
                success:
                    true,

                alreadyProcessed:
                    false,

                waitingForMembership:
                    true,

                sellingPoints:
                    calculation.pointsEarned,

                previousCarry:
                    calculation.previousPendingAmount,

                calculationTotal:
                    calculation.totalAmount,

                completedBlocks:
                    calculation.completeBlocks,

                eligibleAmount:
                    calculation.purchaseAmount,

                carryForward:
                    calculation.pendingAmount,
            };
        }


        /* ==================================================================
           MEMBER ORDER
           ================================================================== */

        const user =
            await User.findById(
                order.userId
            );


        if (!user) {

            console.log(
                `SP SKIPPED: User not found for ${order.orderNumber}`
            );

            return {
                success:
                    false,

                message:
                    "User not found",
            };
        }


        /* ------------------------------------------------------------------
           VALID MEMBER ROLES
           ------------------------------------------------------------------ */

        const allowedRoles = [
            "MEMBER",
            "MANAGER",
            "SUPERVISOR",
        ];


        const userRole =
            String(
                user.role || ""
            )
                .trim()
                .toUpperCase();


        if (
            !allowedRoles.includes(
                userRole
            )
        ) {

            console.log(
                `SP SKIPPED: Role ${user.role} not eligible`
            );

            return {
                success:
                    false,

                message:
                    "User role is not eligible for selling points",
            };
        }


        /* ------------------------------------------------------------------
           SP ELIGIBLE AMOUNT
           ------------------------------------------------------------------ */

        const sellingPointAmount =
            Number(
                order.subtotal ||
                0
            );


        if (
            sellingPointAmount <= 0
        ) {

            order.sellingPoints =
                0;

            order.sellingPointsProcessed =
                true;

            order.sellingPointsProcessedAt =
                new Date();

            await order.save();


            return {
                success:
                    true,

                sellingPoints:
                    0,
            };
        }


        /* ------------------------------------------------------------------
           USE EXISTING SELLING POINT SERVICE
           ------------------------------------------------------------------ */

        let spResult =
            null;


        if (
            typeof
                sellingPointService
                    .updateSellingPoints ===
            "function"
        ) {

            spResult =
                await sellingPointService
                    .updateSellingPoints(
                        user._id,
                        sellingPointAmount,
                        order._id
                    );

        } else if (
            typeof
                sellingPointService
                    .processPurchaseSellingPoints ===
            "function"
        ) {

            spResult =
                await sellingPointService
                    .processPurchaseSellingPoints(
                        user._id,
                        sellingPointAmount,
                        order._id
                    );

        } else if (
            typeof
                sellingPointService
                    .addPurchaseSellingPoints ===
            "function"
        ) {

            spResult =
                await sellingPointService
                    .addPurchaseSellingPoints(
                        user._id,
                        sellingPointAmount,
                        order._id
                    );

        } else {

            throw new Error(
                "No compatible selling point service method found"
            );
        }


        /* ------------------------------------------------------------------
           REFRESH ORDER
           ------------------------------------------------------------------ */

        const updatedOrder =
            await Order.findById(
                order._id
            );


        /*
         * IMPORTANT:
         *
         * Do NOT calculate:
         *
         *     floor(subtotal / 100) * 2
         *
         * here again.
         *
         * The existing SP service already handles
         * carry-forward.
         */

        if (
            updatedOrder
        ) {

            updatedOrder.sellingPoints =
                Number(
                    updatedOrder.sellingPoints ||
                    0
                );


            updatedOrder.sellingPointsProcessed =
                true;


            updatedOrder.sellingPointsProcessedAt =
                updatedOrder.sellingPointsProcessedAt ||
                new Date();


            await updatedOrder.save();
        }


        return {
            success:
                true,

            alreadyProcessed:
                false,

            sellingPoints:
                Number(
                    updatedOrder?.sellingPoints ||
                    0
                ),

            result:
                spResult,
        };

    } catch (error) {

        console.error(
            "PROCESS SELLING POINTS ERROR:",
            error
        );

        throw error;
    }
};
/* ==========================================================================
   UPDATE PAYMENT STATUS
   ========================================================================== */

const updatePaymentStatus = async (
    orderId,
    paymentStatus,
    paymentData = {}
) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {
            throw new Error(
                "Invalid order ID"
            );
        }


        const normalizedStatus =
            String(
                paymentStatus || ""
            )
                .trim()
                .toUpperCase();


        const allowedStatuses = [
            "PENDING",
            "PAID",
            "FAILED",
            "REFUNDED",
            "CANCELLED",
        ];


        if (
            !allowedStatuses.includes(
                normalizedStatus
            )
        ) {
            throw new Error(
                `Invalid payment status: ${paymentStatus}`
            );
        }


        const updateData = {
            paymentStatus:
                normalizedStatus,
        };


        if (
            paymentData.phonePeOrderId
        ) {
            updateData.phonePeOrderId =
                paymentData.phonePeOrderId;
        }


        if (
            paymentData.phonePeTransactionId
        ) {
            updateData.phonePeTransactionId =
                paymentData.phonePeTransactionId;
        }


        if (
            paymentData.paymentResponse
        ) {
            updateData.paymentResponse =
                paymentData.paymentResponse;
        }


        if (
            normalizedStatus ===
            "PAID"
        ) {
            updateData.paidAt =
                paymentData.paidAt
                    ? new Date(
                        paymentData.paidAt
                    )
                    : new Date();
        }


        const order =
            await Order.findByIdAndUpdate(
                orderId,

                {
                    $set:
                        updateData,
                },

                {
                    new:
                        true,

                    runValidators:
                        true,
                }
            );


        if (!order) {
            throw new Error(
                "Order not found"
            );
        }


        /*
         * ONLY PAID ORDERS ARE PROCESSED.
         *
         * FAILED orders NEVER receive SP.
         */

        if (
            normalizedStatus ===
            "PAID"
        ) {

            try {

                await processSellingPoints(
                    order._id
                );

            } catch (spError) {

                /*
                 * Payment is already successful.
                 *
                 * Do not change PAID to FAILED
                 * if SP processing has an error.
                 */

                console.error(
                    "SELLING POINT PROCESSING ERROR AFTER PAYMENT:",
                    spError
                );
            }
        }


        return await Order.findById(
            order._id
        ).lean();

    } catch (error) {

        console.error(
            "UPDATE PAYMENT STATUS ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   UPDATE ORDER STATUS
   ========================================================================== */

const updateOrderStatus = async (
    orderId,
    status
) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {
            throw new Error(
                "Invalid order ID"
            );
        }


        const normalizedStatus =
            String(
                status || ""
            )
                .trim()
                .toUpperCase();


        const allowedStatuses = [
            "PLACED",
            "CONFIRMED",
            "PROCESSING",
            "PACKED",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
        ];


        if (
            !allowedStatuses.includes(
                normalizedStatus
            )
        ) {
            throw new Error(
                `Invalid order status: ${status}`
            );
        }


        const order =
            await Order.findById(
                orderId
            );


        if (!order) {
            throw new Error(
                "Order not found"
            );
        }


        const currentStatus =
            String(
                order.status || ""
            )
                .trim()
                .toUpperCase();


        if (
            currentStatus ===
            "DELIVERED" &&
            normalizedStatus !==
            "DELIVERED"
        ) {
            throw new Error(
                "Delivered order cannot be moved to another status"
            );
        }


        if (
            currentStatus ===
            "CANCELLED" &&
            normalizedStatus !==
            "CANCELLED"
        ) {
            throw new Error(
                "Cancelled order cannot be reopened"
            );
        }


        order.status =
            normalizedStatus;


        if (
            normalizedStatus ===
            "CONFIRMED"
        ) {
            order.confirmedAt =
                new Date();
        }


        if (
            normalizedStatus ===
            "PACKED"
        ) {
            order.packedAt =
                new Date();
        }


        if (
            normalizedStatus ===
            "SHIPPED"
        ) {
            order.shippedAt =
                new Date();
        }


        if (
            normalizedStatus ===
            "OUT_FOR_DELIVERY"
        ) {
            order.outForDeliveryAt =
                new Date();
        }


        if (
            normalizedStatus ===
            "DELIVERED"
        ) {
            order.deliveredAt =
                new Date();
        }


        if (
            normalizedStatus ===
            "CANCELLED"
        ) {
            order.cancelledAt =
                new Date();
        }


        await order.save();


        return order;

    } catch (error) {

        console.error(
            "UPDATE ORDER STATUS ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   UPDATE STATUS ALIAS
   ========================================================================== */

const updateStatus = async (
    orderId,
    status
) => {

    return updateOrderStatus(
        orderId,
        status
    );
};


/* ==========================================================================
   CANCEL ORDER
   ========================================================================== */

const cancelOrder = async (
    orderId,
    userId = null,
    reason = ""
) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {
            throw new Error(
                "Invalid order ID"
            );
        }


        const query = {
            _id:
                orderId,
        };


        if (userId) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    userId
                )
            ) {
                throw new Error(
                    "Invalid user ID"
                );
            }


            query.userId =
                userId;
        }


        const order =
            await Order.findOne(
                query
            );


        if (!order) {
            throw new Error(
                "Order not found"
            );
        }


        const paymentStatus =
            String(
                order.paymentStatus || ""
            )
                .trim()
                .toUpperCase();


        if (
            paymentStatus ===
            "PAID"
        ) {
            throw new Error(
                "Paid order cannot be cancelled from this action"
            );
        }


        const currentStatus =
            String(
                order.status || ""
            )
                .trim()
                .toUpperCase();


        if (
            [
                "SHIPPED",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
            ].includes(
                currentStatus
            )
        ) {
            throw new Error(
                "Order cannot be cancelled after shipping"
            );
        }


        if (
            currentStatus ===
            "CANCELLED"
        ) {
            return order;
        }


        order.status =
            "CANCELLED";


        order.cancelledAt =
            new Date();


        order.cancellationReason =
            String(
                reason || ""
            ).trim();


        await order.save();


        return order;

    } catch (error) {

        console.error(
            "CANCEL ORDER ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   DELETE ORDER
   ========================================================================== */

const deleteOrder = async (
    orderId
) => {
    try {

        if (
            !mongoose.Types.ObjectId.isValid(
                orderId
            )
        ) {
            throw new Error(
                "Invalid order ID"
            );
        }


        const order =
            await Order.findById(
                orderId
            );


        if (!order) {
            throw new Error(
                "Order not found"
            );
        }


        if (
            String(
                order.paymentStatus || ""
            )
                .trim()
                .toUpperCase() ===
            "PAID"
        ) {
            throw new Error(
                "Paid orders cannot be deleted"
            );
        }


        await OrderItem.deleteMany({
            orderId:
                order._id,
        });


        await Order.deleteOne({
            _id:
                order._id,
        });


        return {
            success:
                true,

            orderId:
                order._id,
        };

    } catch (error) {

        console.error(
            "DELETE ORDER ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   GET MANAGER ORDERS
   ========================================================================== */

const getManagerOrders = async (
    managerId,
    options = {}
) => {
    try {

        if (!managerId) {
            throw new Error(
                "Manager ID is required"
            );
        }


        if (
            !mongoose.Types.ObjectId.isValid(
                managerId
            )
        ) {
            throw new Error(
                "Invalid manager ID"
            );
        }


        const manager =
            await User.findById(
                managerId
            )
                .select(
                    "_id userId role"
                )
                .lean();


        if (!manager) {
            throw new Error(
                "Manager not found"
            );
        }


        const networkUsers =
            await User.find({
                $or: [
                    {
                        _id:
                            manager._id,
                    },

                    {
                        managerId:
                            manager._id,
                    },
                ],
            })
                .select(
                    "_id"
                )
                .lean();


        const userIds =
            networkUsers.map(
                (user) =>
                    user._id
            );


        if (
            !userIds.some(
                (id) =>
                    id.toString() ===
                    manager._id.toString()
            )
        ) {
            userIds.push(
                manager._id
            );
        }


        const {
            page = 1,
            limit = 20,
            status,
            paymentStatus,
        } = options;


        const filter = {
            userId: {
                $in:
                    userIds,
            },
        };


        if (status) {
            filter.status =
                status;
        }


        if (paymentStatus) {
            filter.paymentStatus =
                paymentStatus;
        }


        const pageNumber =
            Math.max(
                1,
                Number(page) || 1
            );


        const limitNumber =
            Math.max(
                1,
                Number(limit) || 20
            );


        const skip =
            (
                pageNumber - 1
            ) *
            limitNumber;


        const [
            orders,
            total,
        ] = await Promise.all([

            Order.find(
                filter
            )
                .populate(
                    "userId",
                    "name userId email mobile role referralCode"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            Order.countDocuments(
                filter
            ),
        ]);


        return {
            orders,

            pagination: {
                page:
                    pageNumber,

                limit:
                    limitNumber,

                total,

                pages:
                    Math.ceil(
                        total /
                        limitNumber
                    ),
            },
        };

    } catch (error) {

        console.error(
            "GET MANAGER ORDERS ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   GET ORDER STATS
   ========================================================================== */

const getOrderStats = async (
    filters = {}
) => {
    try {

        const {
            userId,
            orderType,
        } = filters;


        const query = {};


        if (userId) {

            if (
                mongoose.Types.ObjectId.isValid(
                    userId
                )
            ) {
                query.userId =
                    userId;
            }
        }


        if (orderType) {
            query.orderType =
                orderType;
        }


        const [
            totalOrders,

            paidOrders,

            pendingPaymentOrders,

            failedPaymentOrders,

            cancelledOrders,

            deliveredOrders,
        ] = await Promise.all([

            Order.countDocuments(
                query
            ),

            Order.countDocuments({
                ...query,

                paymentStatus:
                    "PAID",
            }),

            Order.countDocuments({
                ...query,

                paymentStatus:
                    "PENDING",
            }),

            Order.countDocuments({
                ...query,

                paymentStatus:
                    "FAILED",
            }),

            Order.countDocuments({
                ...query,

                status:
                    "CANCELLED",
            }),

            Order.countDocuments({
                ...query,

                status:
                    "DELIVERED",
            }),
        ]);


        const revenueResult =
            await Order.aggregate([
                {
                    $match: {
                        ...query,

                        paymentStatus:
                            "PAID",
                    },
                },

                {
                    $group: {
                        _id:
                            null,

                        totalRevenue: {
                            $sum:
                                "$finalAmount",
                        },
                    },
                },
            ]);


        const totalRevenue =
            Number(
                revenueResult?.[0]
                    ?.totalRevenue ||
                0
            );


        const subtotalResult =
            await Order.aggregate([
                {
                    $match: {
                        ...query,

                        paymentStatus:
                            "PAID",
                    },
                },

                {
                    $group: {
                        _id:
                            null,

                        totalSubtotal: {
                            $sum:
                                "$subtotal",
                        },
                    },
                },
            ]);


        const totalSubtotal =
            Number(
                subtotalResult?.[0]
                    ?.totalSubtotal ||
                0
            );


        const deliveryResult =
            await Order.aggregate([
                {
                    $match: {
                        ...query,

                        paymentStatus:
                            "PAID",
                    },
                },

                {
                    $group: {
                        _id:
                            null,

                        totalDelivery: {
                            $sum:
                                "$deliveryCharge",
                        },
                    },
                },
            ]);


        const totalDelivery =
            Number(
                deliveryResult?.[0]
                    ?.totalDelivery ||
                0
            );


        return {
            totalOrders,

            paidOrders,

            pendingPaymentOrders,

            failedPaymentOrders,

            cancelledOrders,

            deliveredOrders,

            totalRevenue,

            totalSubtotal,

            totalDelivery,
        };

    } catch (error) {

        console.error(
            "GET ORDER STATS ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   EXPORTS
   ========================================================================== */

module.exports = {

    createOrder,

    placeOrder,

    placeGuestOrder,

    getOrderById,

    getMyOrders,

    getAllOrders,

    getOrdersByMobile,

    linkGuestOrdersToUser,

    claimGuestOrders,

    /*
     * THIS WAS THE MISSING FUNCTION.
     *
     * auth.service.js calls this during registration.
     */
    claimGuestOrdersForMember,

    processSellingPoints,

    calculateOrderSellingPoints,

    updatePaymentStatus,

    updateOrderStatus,

    updateStatus,

    cancelOrder,

    deleteOrder,

    getManagerOrders,

    getOrderStats,
};