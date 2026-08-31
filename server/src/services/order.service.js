const mongoose = require("mongoose");

const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const User = require("../models/user.model");

const cartService = require("./cart.service");
const sellingPointService = require("./sellingPoint.service");

/* ==========================================================================
   GENERATE ORDER NUMBER
   ========================================================================== */

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
            nextNumber =
                Number(match[1]) + 1;
        }
    }

    return `BHORD${String(nextNumber).padStart(6, "0")}`;
};


/* ==========================================================================
   CALCULATE ORDER SELLING POINTS
   ==========================================================================

   ₹100 = 2 SP

   ₹100  = 2 SP
   ₹200  = 4 SP
   ₹300  = 6 SP
   ₹400  = 8 SP
   ₹450  = 8 SP
   ₹578  = 10 SP

   IMPORTANT:
   SP is calculated ONLY from product subtotal.

   Delivery charges are NEVER included.
   ========================================================================== */

const calculateOrderSellingPoints = (amount) => {
    const purchaseAmount =
        Number(amount || 0);

    if (purchaseAmount < 100) {
        return 0;
    }

    return (
        Math.floor(
            purchaseAmount / 100
        ) * 2
    );
};


/* ==========================================================================
   CREATE / PLACE ORDER
   ========================================================================== */

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


        /* ------------------------------------------------------------------
           DETERMINE GUEST / MEMBER
           ------------------------------------------------------------------ */

        const isGuest =
            !userId ||
            userId === null ||
            userId === undefined;

        const orderType =
            isGuest
                ? "GUEST"
                : "MEMBER";


        /* ------------------------------------------------------------------
           GET MEMBER CART
           ------------------------------------------------------------------ */

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
                !Array.isArray(
                    cart.items
                ) ||
                cart.items.length === 0
            ) {
                throw new Error(
                    "Cart is empty"
                );
            }
        }


        /* ------------------------------------------------------------------
           CALCULATE PRICE
           ------------------------------------------------------------------

           MEMBER:

           subtotal =
           cart.totalAmount

           delivery =
           cart.deliveryCharge

           finalAmount =
           subtotal
           - discount
           - wallet
           + delivery

           IMPORTANT:
           Delivery is part of payment,
           but NOT part of SP.
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           FINAL PAYMENT AMOUNT
           ------------------------------------------------------------------ */

        const finalAmount =
            Math.max(
                0,
                subtotal -
                    discount -
                    walletAmount +
                    deliveryCharge
            );


        /* ------------------------------------------------------------------
           SELLING POINTS
           ------------------------------------------------------------------

           VERY IMPORTANT:

           SP uses SUBTOTAL ONLY.

           Example:

           Product subtotal = ₹450
           Delivery          = ₹50
           Customer pays     = ₹500

           SP:

           ₹450 / ₹100
           = 4 blocks
           = 8 SP

           NOT 10 SP.

           ------------------------------------------------------------------ */

        const sellingPoints =
            calculateOrderSellingPoints(
                subtotal
            );


        /* ------------------------------------------------------------------
           ORDER NUMBER
           ------------------------------------------------------------------ */

        const orderNumber =
            await generateOrderNumber();


        /* ------------------------------------------------------------------
           CREATE ORDER
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           CREATE ORDER ITEMS
           ------------------------------------------------------------------ */

        let itemsToSave = [];


        if (!isGuest) {

            itemsToSave =
                Array.isArray(
                    cart?.items
                )
                    ? cart.items
                    : [];

        } else {

            itemsToSave =
                Array.isArray(
                    guestItems
                )
                    ? guestItems
                    : [];
        }


        if (
            itemsToSave.length > 0
        ) {

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


        /* ------------------------------------------------------------------
           IMPORTANT CART RULE
           ------------------------------------------------------------------

           DO NOT CLEAR THE CART HERE.

           The customer has only CREATED the order.

           Payment is still PENDING.

           Therefore:

           Checkout
                ↓
           Create Order
                ↓
           Cart remains
                ↓
           Scanner
                ↓
           Customer can go back
                ↓
           Cart still available

           The cart must NOT disappear simply because
           the order was created.

           ------------------------------------------------------------------ */


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


/* ==========================================================================
   PLACE ORDER
   ========================================================================== */

const placeOrder = async (
    userId,
    orderData = {}
) => {

    return createOrder(
        userId,
        orderData
    );
};


/* ==========================================================================
   GET ORDER BY ID
   ========================================================================== */

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


/* ==========================================================================
   GET MY ORDERS
   ========================================================================== */

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

/* ==========================================================================
   GET ALL ORDERS
   ========================================================================== */

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


        const formattedOrders =
            orders.map(
                (order) => ({

                    ...order,

                    items:
                        itemsByOrder[
                            order._id.toString()
                        ] || [],

                })
            );


        return {

            orders:
                formattedOrders,

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


/* ==========================================================================
   GET ORDERS BY MOBILE
   ========================================================================== */

const getOrdersByMobile = async (
    mobile
) => {

    try {

        if (!mobile) {
            return [];
        }


        const cleanMobile =
            String(mobile).trim();


        const orders =
            await Order.find({

                customerMobile:
                    cleanMobile,

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
            "GET ORDERS BY MOBILE ERROR:",
            error
        );

        throw error;
    }
};


/* ==========================================================================
   LINK GUEST ORDERS TO USER
   ========================================================================== */

const linkGuestOrdersToUser =
    async (
        userId,
        mobile
    ) => {

        try {

            if (
                !userId ||
                !mobile
            ) {

                return {

                    matched: 0,

                    linked: 0,

                };
            }


            const cleanMobile =
                String(
                    mobile
                ).trim();


            const result =
                await Order.updateMany(

                    {

                        customerMobile:
                            cleanMobile,

                        $or: [

                            {
                                userId:
                                    null,
                            },

                            {
                                userId: {
                                    $exists:
                                        false,
                                },
                            },

                        ],

                        orderType:
                            "GUEST",

                    },

                    {

                        $set: {

                            userId,

                            membershipLinked:
                                true,

                            linkedAt:
                                new Date(),

                            orderType:
                                "MEMBER",

                        },

                    }

                );


            console.log(
                "======================================"
            );

            console.log(
                "GUEST ORDERS LINKED"
            );

            console.log(
                "Mobile:",
                cleanMobile
            );

            console.log(
                "User:",
                userId
            );

            console.log(
                "Linked:",
                result.modifiedCount
            );

            console.log(
                "======================================"
            );


            return {

                matched:
                    result.matchedCount ||
                    0,

                linked:
                    result.modifiedCount ||
                    0,

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
   PROCESS SELLING POINTS
   ==========================================================================

   IMPORTANT:

   SP is processed ONLY after payment becomes PAID.

   Delivery charge is NEVER included.

   Example:

   Product subtotal = ₹450
   Delivery         = ₹50
   Final payment    = ₹500

   SP = 8

   NOT 10.

   ========================================================================== */

const processSellingPoints =
    async (
        orderId
    ) => {

        try {

            if (!orderId) {

                return {

                    success:
                        false,

                    message:
                        "Order ID is required",

                };
            }


            const order =
                await Order.findById(
                    orderId
                );


            if (!order) {

                return {

                    success:
                        false,

                    message:
                        "Order not found",

                };
            }


            /* --------------------------------------------------------------
               ALREADY PROCESSED
               -------------------------------------------------------------- */

            if (
                order.sellingPointsProcessed ===
                true
            ) {

                console.log(
                    `SP SKIPPED: Already processed ${order.orderNumber}`
                );


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

                };
            }


            /* --------------------------------------------------------------
               PAYMENT CHECK
               -------------------------------------------------------------- */

            if (
                String(
                    order.paymentStatus ||
                    ""
                ).toUpperCase() !==
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


            /* --------------------------------------------------------------
               GUEST CHECK
               -------------------------------------------------------------- */

            if (!order.userId) {

                console.log(
                    `SP WAITING: Guest order ${order.orderNumber}`
                );


                return {

                    success:
                        true,

                    waitingForMembership:
                        true,

                    sellingPoints:
                        Number(
                            order.sellingPoints ||
                            0
                        ),

                };
            }


            /* --------------------------------------------------------------
               FIND USER
               -------------------------------------------------------------- */

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


            /* --------------------------------------------------------------
               ROLE CHECK
               -------------------------------------------------------------- */

            const allowedRoles = [

                "MEMBER",

                "MANAGER",

            ];


            const userRole =
                String(
                    user.role || ""
                ).toUpperCase();


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


            /* --------------------------------------------------------------
               SELLING POINT QUALIFYING AMOUNT
               --------------------------------------------------------------

               ONLY subtotal.

               Delivery charge is excluded.

               -------------------------------------------------------------- */

            const amount =
                Number(
                    order.subtotal ||
                    0
                );


            const calculatedSP =
                calculateOrderSellingPoints(
                    amount
                );


            /* --------------------------------------------------------------
               ZERO SP
               -------------------------------------------------------------- */

            if (
                calculatedSP <= 0
            ) {

                await Order.findByIdAndUpdate(

                    order._id,

                    {

                        $set: {

                            sellingPoints:
                                0,

                            sellingPointsProcessed:
                                true,

                            sellingPointsProcessedAt:
                                new Date(),

                        },

                    }

                );


                console.log(
                    `SP PROCESSED: 0 SP for ${order.orderNumber}`
                );


                return {

                    success:
                        true,

                    sellingPoints:
                        0,

                };
            }


            /* --------------------------------------------------------------
               SELLING POINT SERVICE
               -------------------------------------------------------------- */

            let spResult =
                null;


            const sellingPointAmount =
                Number(
                    order.subtotal ||
                    0
                );


            /* --------------------------------------------------------------
               METHOD 1
               -------------------------------------------------------------- */

            if (
                typeof
                    sellingPointService
                        .updateSellingPoints ===
                "function"
            ) {

                spResult =
                    await
                        sellingPointService
                            .updateSellingPoints(

                                user._id,

                                sellingPointAmount,

                                order._id

                            );

            }

            /* --------------------------------------------------------------
               METHOD 2
               -------------------------------------------------------------- */

            else if (
                typeof
                    sellingPointService
                        .processPurchaseSellingPoints ===
                "function"
            ) {

                spResult =
                    await
                        sellingPointService
                            .processPurchaseSellingPoints(

                                user._id,

                                sellingPointAmount,

                                order._id

                            );

            }

            /* --------------------------------------------------------------
               METHOD 3
               -------------------------------------------------------------- */

            else if (
                typeof
                    sellingPointService
                        .addPurchaseSellingPoints ===
                "function"
            ) {

                spResult =
                    await
                        sellingPointService
                            .addPurchaseSellingPoints(

                                user._id,

                                sellingPointAmount,

                                order._id

                            );

            }

            else {

                throw new Error(
                    "No compatible selling point service method found"
                );
            }


            /* --------------------------------------------------------------
               MARK ORDER SP AS PROCESSED
               -------------------------------------------------------------- */

            await Order.findByIdAndUpdate(

                order._id,

                {

                    $set: {

                        sellingPoints:
                            calculatedSP,

                        sellingPointsProcessed:
                            true,

                        sellingPointsProcessedAt:
                            new Date(),

                    },

                }

            );


            console.log(
                "======================================"
            );

            console.log(
                "SP PROCESSED"
            );

            console.log(
                "User:",
                user.userId
            );

            console.log(
                "Role:",
                user.role
            );

            console.log(
                "Order:",
                order.orderNumber
            );

            console.log(
                "Product Subtotal: ₹",
                Number(
                    order.subtotal ||
                    0
                )
            );

            console.log(
                "Delivery Charge: ₹",
                Number(
                    order.deliveryCharge ||
                    0
                )
            );

            console.log(
                "Customer Payment: ₹",
                Number(
                    order.finalAmount ||
                    0
                )
            );

            console.log(
                "Selling Point Basis: ₹",
                amount
            );

            console.log(
                "Selling Points Awarded:",
                calculatedSP
            );

            console.log(
                "======================================"
            );


            return {

                success:
                    true,

                sellingPoints:
                    calculatedSP,

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

const updatePaymentStatus =
    async (
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
                ).toUpperCase();


            const allowedStatuses = [

                "PENDING",

                "PAID",

                "FAILED",

                "REFUNDED",

            ];


            if (
                !allowedStatuses.includes(
                    normalizedStatus
                )
            ) {

                throw new Error(
                    "Invalid payment status"
                );
            }


            const update = {

                paymentStatus:
                    normalizedStatus,

            };


            if (
                paymentData.phonePeOrderId
            ) {

                update.phonePeOrderId =
                    paymentData.phonePeOrderId;
            }


            if (
                paymentData.phonePeTransactionId
            ) {

                update.phonePeTransactionId =
                    paymentData.phonePeTransactionId;
            }


            /* --------------------------------------------------------------
               PAYMENT SUCCESS
               -------------------------------------------------------------- */

            if (
                normalizedStatus ===
                "PAID"
            ) {

                update.paidAt =
                    new Date();

                update.status =
                    "CONFIRMED";

                update.confirmedAt =
                    new Date();
            }


            const order =
                await Order.findByIdAndUpdate(

                    orderId,

                    {

                        $set:
                            update,

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


            /* --------------------------------------------------------------
               PROCESS SP ONLY AFTER PAYMENT IS PAID
               -------------------------------------------------------------- */

            if (
                normalizedStatus ===
                "PAID"
            ) {

                try {

                    await processSellingPoints(
                        order._id
                    );

                } catch (spError) {

                    console.error(
                        "SP PROCESSING FAILED:",
                        spError
                    );

                    /*
                     * Payment remains PAID.
                     *
                     * SP processing can be retried later.
                     */
                }
            }


            return await getOrderById(
                order._id
            );


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

const updateOrderStatus =
    async (
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
                ).toUpperCase();


            const allowedStatuses = [

                "PLACED",

                "CONFIRMED",

                "PACKED",

                "SHIPPED",

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


            const update = {

                status:
                    normalizedStatus,

            };


            const now =
                new Date();


            if (
                normalizedStatus ===
                "CONFIRMED"
            ) {

                update.confirmedAt =
                    now;
            }


            if (
                normalizedStatus ===
                "PACKED"
            ) {

                update.packedAt =
                    now;
            }


            if (
                normalizedStatus ===
                "SHIPPED"
            ) {

                update.shippedAt =
                    now;
            }


            if (
                normalizedStatus ===
                "DELIVERED"
            ) {

                update.deliveredAt =
                    now;
            }


            if (
                normalizedStatus ===
                "CANCELLED"
            ) {

                update.cancelledAt =
                    now;
            }


            const order =
                await Order.findByIdAndUpdate(

                    orderId,

                    {

                        $set:
                            update,

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


            return await getOrderById(
                order._id
            );


        } catch (error) {

            console.error(
                "UPDATE ORDER STATUS ERROR:",
                error
            );

            throw error;
        }
    };


/* ==========================================================================
   UPDATE ORDER STATUS ALIAS
   ========================================================================== */

const updateStatus =
    async (
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

const cancelOrder =
    async (
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

                _id:
                    orderId,

            };


            if (userId) {

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


            if (
                String(
                    order.status ||
                    ""
                ).toUpperCase() ===
                "DELIVERED"
            ) {

                throw new Error(
                    "Delivered orders cannot be cancelled"
                );
            }


            if (
                String(
                    order.status ||
                    ""
                ).toUpperCase() ===
                "CANCELLED"
            ) {

                return await getOrderById(
                    order._id
                );
            }


            order.status =
                "CANCELLED";


            order.cancelledAt =
                new Date();


            await order.save();


            return await getOrderById(
                order._id
            );


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

const deleteOrder =
    async (
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


            await OrderItem.deleteMany({

                orderId:
                    order._id,

            });


            await Order.findByIdAndDelete(
                order._id
            );


            return {

                success:
                    true,

                message:
                    "Order deleted successfully",

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
   GET ORDERS FOR MANAGER
   ========================================================================== */

const getManagerOrders =
    async (
        managerId,
        options = {}
    ) => {

        try {

            if (!managerId) {

                throw new Error(
                    "Manager ID is required"
                );
            }


            const manager =
                await User.findById(
                    managerId
                )
                    .select(
                        "userId role"
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
                                managerId,
                        },

                        {
                            managerId:
                                managerId,
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
                        managerId.toString()
                )
            ) {

                userIds.push(
                    managerId
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
                        "name userId email mobile role referralCode"
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


            return {

                orders,

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
                "GET MANAGER ORDERS ERROR:",
                error
            );

            throw error;
        }
    };


/* ==========================================================================
   GET ORDER STATISTICS
   ========================================================================== */

const getOrderStats =
    async (
        filter = {}
    ) => {

        try {

            const [

                totalOrders,

                placedOrders,

                confirmedOrders,

                packedOrders,

                shippedOrders,

                deliveredOrders,

                cancelledOrders,

                paidOrders,

            ] = await Promise.all([

                Order.countDocuments(
                    filter
                ),

                Order.countDocuments({

                    ...filter,

                    status:
                        "PLACED",

                }),

                Order.countDocuments({

                    ...filter,

                    status:
                        "CONFIRMED",

                }),

                Order.countDocuments({

                    ...filter,

                    status:
                        "PACKED",

                }),

                Order.countDocuments({

                    ...filter,

                    status:
                        "SHIPPED",

                }),

                Order.countDocuments({

                    ...filter,

                    status:
                        "DELIVERED",

                }),

                Order.countDocuments({

                    ...filter,

                    status:
                        "CANCELLED",

                }),

                Order.countDocuments({

                    ...filter,

                    paymentStatus:
                        "PAID",

                }),

            ]);


            return {

                totalOrders,

                placedOrders,

                confirmedOrders,

                packedOrders,

                shippedOrders,

                deliveredOrders,

                cancelledOrders,

                paidOrders,

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
   CLAIM GUEST ORDERS
   ========================================================================== */

const claimGuestOrders =
    async (
        userId,
        mobile
    ) => {

        try {

            const linkResult =
                await linkGuestOrdersToUser(
                    userId,
                    mobile
                );


            const linkedOrders =
                await Order.find({

                    userId,

                    customerMobile:
                        String(
                            mobile
                        ).trim(),

                    paymentStatus:
                        "PAID",

                    sellingPointsProcessed:
                        false,

                })
                    .select(
                        "_id"
                    )
                    .lean();


            let processed =
                0;


            for (
                const order
                of linkedOrders
            ) {

                try {

                    const result =
                        await processSellingPoints(
                            order._id
                        );


                    if (
                        result?.success &&
                        !result?.waitingForMembership
                    ) {

                        processed++;
                    }


                } catch (error) {

                    console.error(

                        `SP retry failed for ${order._id}:`,

                        error

                    );
                }
            }


            return {

                ...linkResult,

                processed,

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
   MODULE EXPORTS
   ========================================================================== */

module.exports = {

    createOrder,

    placeOrder,

    getOrderById,

    getMyOrders,

    getAllOrders,

    getOrdersByMobile,

    linkGuestOrdersToUser,

    claimGuestOrders,

    processSellingPoints,

    updatePaymentStatus,

    updateOrderStatus,

    updateStatus,

    cancelOrder,

    deleteOrder,

    getManagerOrders,

    getOrderStats,

    calculateOrderSellingPoints,

};