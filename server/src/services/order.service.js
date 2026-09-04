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
           ₹50

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

            /* MEMBER DELIVERY CHARGE */

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

            /*
             * Guest checkout also uses
             * fixed ₹50 delivery.
             *
             * Even if frontend sends another
             * value, use ₹50 here so the backend
             * remains the source of truth.
             */

            deliveryCharge = 50;
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
   PLACE GUEST ORDER
   ==========================================================================

   IMPORTANT FIX:

   order.controller.js calls:

       orderService.placeGuestOrder(req.body)

   Therefore this function MUST exist and MUST be exported.

   Guest checkout sends:

       name
       mobile
       email
       address
       city
       state
       pincode

   createOrder() internally uses:

       customerName
       customerMobile
       customerEmail
       deliveryDetails

   This function converts the guest checkout payload into
   the format expected by createOrder().

   ========================================================================== */

const placeGuestOrder = async (
    orderData = {}
) => {

    try {

        /* ------------------------------------------------------------------
           CUSTOMER NAME
           ------------------------------------------------------------------ */

        const customerName =
            String(
                orderData.customerName ||
                orderData.name ||
                ""
            ).trim();


        /* ------------------------------------------------------------------
           CUSTOMER MOBILE
           ------------------------------------------------------------------ */

        const customerMobile =
            String(
                orderData.customerMobile ||
                orderData.mobile ||
                ""
            )
                .replace(
                    /\D/g,
                    ""
                );


        /* ------------------------------------------------------------------
           CUSTOMER EMAIL
           ------------------------------------------------------------------ */

        const customerEmail =
            String(
                orderData.customerEmail ||
                orderData.email ||
                ""
            )
                .trim()
                .toLowerCase();


        /* ------------------------------------------------------------------
           EXISTING DELIVERY DETAILS
           ------------------------------------------------------------------ */

        const existingDeliveryDetails =
            orderData.deliveryDetails ||
            {};


        /* ------------------------------------------------------------------
           NORMALIZED DELIVERY DETAILS
           ------------------------------------------------------------------ */

        const deliveryDetails = {

            name:
                String(
                    existingDeliveryDetails.name ||
                    customerName ||
                    ""
                ).trim(),

            mobile:
                String(
                    existingDeliveryDetails.mobile ||
                    customerMobile ||
                    ""
                )
                    .replace(
                        /\D/g,
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


        /* ------------------------------------------------------------------
           VALIDATION
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           NORMALIZED ORDER DATA
           ------------------------------------------------------------------ */

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

            /*
             * Backend source of truth:
             * guest delivery = ₹50.
             */

            deliveryCharge:
                50,

            items:
                Array.isArray(
                    orderData.items
                )
                    ? orderData.items
                    : [],
        };


        /* ------------------------------------------------------------------
           CREATE GUEST ORDER
           ------------------------------------------------------------------ */

        const order =
            await createOrder(
                null,
                normalizedOrderData
            );


        return order;


    } catch (error) {

        console.error(
            "PLACE GUEST ORDER ERROR:",
            error
        );

        throw error;
    }
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
    filters = {}
) => {

    try {

        const {
            status,
            paymentStatus,
            orderType,
            userId,
            search,
            startDate,
            endDate,
        } = filters;


        /* ------------------------------------------------------------------
           BUILD QUERY
           ------------------------------------------------------------------ */

        const query = {};


        if (status) {
            query.status =
                status;
        }


        if (paymentStatus) {
            query.paymentStatus =
                paymentStatus;
        }


        if (orderType) {
            query.orderType =
                orderType;
        }


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


        /* ------------------------------------------------------------------
           DATE FILTER
           ------------------------------------------------------------------ */

        if (
            startDate ||
            endDate
        ) {

            query.createdAt = {};


            if (startDate) {

                const start =
                    new Date(
                        startDate
                    );

                if (
                    !Number.isNaN(
                        start.getTime()
                    )
                ) {

                    start.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    query.createdAt.$gte =
                        start;
                }
            }


            if (endDate) {

                const end =
                    new Date(
                        endDate
                    );

                if (
                    !Number.isNaN(
                        end.getTime()
                    )
                ) {

                    end.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    query.createdAt.$lte =
                        end;
                }
            }


            if (
                Object.keys(
                    query.createdAt
                ).length === 0
            ) {

                delete query.createdAt;
            }
        }


        /* ------------------------------------------------------------------
           SEARCH
           ------------------------------------------------------------------ */

        if (search) {

            const searchText =
                String(
                    search
                ).trim();


            if (searchText) {

                const regex =
                    new RegExp(
                        searchText,
                        "i"
                    );


                const searchConditions = [
                    {
                        orderNumber:
                            regex,
                    },
                    {
                        customerName:
                            regex,
                    },
                    {
                        customerMobile:
                            regex,
                    },
                    {
                        customerEmail:
                            regex,
                    },
                ];


                if (
                    query.$or
                ) {

                    query.$and = [
                        {
                            $or:
                                query.$or,
                        },
                        {
                            $or:
                                searchConditions,
                        },
                    ];

                    delete query.$or;

                } else {

                    query.$or =
                        searchConditions;
                }
            }
        }


        /* ------------------------------------------------------------------
           FETCH ORDERS
           ------------------------------------------------------------------ */

        const orders =
            await Order.find(
                query
            )
                .populate(
                    "userId",
                    "name userId email mobile role referralCode"
                )
                .sort({
                    createdAt: -1,
                })
                .lean();


        if (!orders.length) {
            return [];
        }


        /* ------------------------------------------------------------------
           FETCH ORDER ITEMS
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           GROUP ITEMS BY ORDER
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           RETURN ORDERS
           ------------------------------------------------------------------ */

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

        const normalizedMobile =
            String(
                mobile || ""
            )
                .replace(
                    /\D/g,
                    ""
                );


        if (
            normalizedMobile.length !== 10
        ) {

            throw new Error(
                "Valid 10-digit mobile number is required"
            );
        }


        /* ------------------------------------------------------------------
           FIND ORDERS
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           GET ORDER IDS
           ------------------------------------------------------------------ */

        const orderIds =
            orders.map(
                (order) =>
                    order._id
            );


        /* ------------------------------------------------------------------
           GET ITEMS
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           GROUP ITEMS
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           RETURN
           ------------------------------------------------------------------ */

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
            String(
                mobile || ""
            )
                .replace(
                    /\D/g,
                    ""
                );


        if (
            normalizedMobile.length !== 10
        ) {

            throw new Error(
                "Valid 10-digit mobile number is required"
            );
        }


        /* ------------------------------------------------------------------
           LINK GUEST ORDERS
           ------------------------------------------------------------------ */

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
                    },
                }
            );


        console.log(
            "GUEST ORDERS LINKED:",
            result.modifiedCount
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
            String(
                mobile || ""
            )
                .replace(
                    /\D/g,
                    ""
                );


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
   PROCESS SELLING POINTS
   ==========================================================================

   Selling points are processed only after payment is successful.

   IMPORTANT:

   - Order must be PAID.
   - SP must not already be processed.
   - Delivery charge is excluded.
   - SP is calculated from product subtotal only.

   ========================================================================== */

const processSellingPoints = async (
    orderId
) => {

    try {

        /* ------------------------------------------------------------------
           VALIDATE ORDER ID
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


        /* ------------------------------------------------------------------
           FETCH ORDER
           ------------------------------------------------------------------ */

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
           PAYMENT CHECK
           ------------------------------------------------------------------ */

        if (
            String(
                order.paymentStatus ||
                ""
            ).toUpperCase() !==
            "PAID"
        ) {

            throw new Error(
                "Selling points can only be processed for paid orders"
            );
        }


        /* ------------------------------------------------------------------
           DUPLICATE CHECK
           ------------------------------------------------------------------ */

        if (
            order.sellingPointsProcessed
        ) {

            return {
                alreadyProcessed:
                    true,

                sellingPoints:
                    Number(
                        order.sellingPoints ||
                        0
                    ),
            };
        }


        /* ------------------------------------------------------------------
           CALCULATE SP
           ------------------------------------------------------------------ */

        const sellingPoints =
            calculateOrderSellingPoints(
                order.subtotal
            );


        /* ------------------------------------------------------------------
           GUEST ORDER
           
           Guests do not have a member
           referral tree, so there is
           no member SP distribution.
           ------------------------------------------------------------------ */

        if (
            !order.userId
        ) {

            order.sellingPoints =
                sellingPoints;

            order.sellingPointsProcessed =
                true;

            order.sellingPointsProcessedAt =
                new Date();

            await order.save();


            return {
                alreadyProcessed:
                    false,

                sellingPoints,
            };
        }


        /* ------------------------------------------------------------------
           MEMBER ORDER
           ------------------------------------------------------------------ */

        const user =
            await User.findById(
                order.userId
            );


        if (!user) {

            throw new Error(
                "Order member not found"
            );
        }


        /* ------------------------------------------------------------------
           UPDATE ORDER
           ------------------------------------------------------------------ */

        order.sellingPoints =
            sellingPoints;

        order.sellingPointsProcessed =
            true;

        order.sellingPointsProcessedAt =
            new Date();


        await order.save();


        /* ------------------------------------------------------------------
           DISTRIBUTE SP
           
           sellingPointService is responsible
           for the actual referral-tree logic.
           ------------------------------------------------------------------ */

        if (
            sellingPoints > 0 &&
            sellingPointService
        ) {

            if (
                typeof
                    sellingPointService
                        .processOrderSellingPoints ===
                "function"
            ) {

                await
                    sellingPointService
                        .processOrderSellingPoints(
                            order,
                            user,
                            sellingPoints
                        );

            } else if (
                typeof
                    sellingPointService
                        .processSellingPoints ===
                "function"
            ) {

                await
                    sellingPointService
                        .processSellingPoints(
                            order,
                            user,
                            sellingPoints
                        );
            }
        }


        return {
            alreadyProcessed:
                false,

            sellingPoints,
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
            "CANCELLED",
            "REFUNDED",
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


        /* ------------------------------------------------------------------
           PHONEPE ORDER ID
           ------------------------------------------------------------------ */

        if (
            paymentData.phonePeOrderId
        ) {

            updateData.phonePeOrderId =
                paymentData.phonePeOrderId;
        }


        /* ------------------------------------------------------------------
           PHONEPE TRANSACTION ID
           ------------------------------------------------------------------ */

        if (
            paymentData.phonePeTransactionId
        ) {

            updateData.phonePeTransactionId =
                paymentData.phonePeTransactionId;
        }


        /* ------------------------------------------------------------------
           PAYMENT RESPONSE
           ------------------------------------------------------------------ */

        if (
            paymentData.paymentResponse
        ) {

            updateData.paymentResponse =
                paymentData.paymentResponse;
        }


        /* ------------------------------------------------------------------
           PAID DATE
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           UPDATE
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           PROCESS SP AFTER PAYMENT
           ------------------------------------------------------------------ */

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
                 * Payment itself succeeded.
                 *
                 * SP processing failure must be logged
                 * separately rather than changing payment
                 * status back to failed.
                 */

                console.error(
                    "SELLING POINT PROCESSING ERROR AFTER PAYMENT:",
                    spError
                );
            }
        }


        return order;


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


        /* ------------------------------------------------------------------
           DO NOT ALLOW DELIVERED ORDER TO BE REOPENED
           ------------------------------------------------------------------ */

        if (
            String(
                order.status || ""
            ).toUpperCase() ===
            "DELIVERED" &&
            normalizedStatus !==
            "DELIVERED"
        ) {

            throw new Error(
                "Delivered order cannot be moved to another status"
            );
        }


        /* ------------------------------------------------------------------
           DO NOT ALLOW CANCELLED ORDER TO BE REOPENED
           ------------------------------------------------------------------ */

        if (
            String(
                order.status || ""
            ).toUpperCase() ===
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


        /* ------------------------------------------------------------------
           STATUS DATES
           ------------------------------------------------------------------ */

        if (
            normalizedStatus ===
            "CONFIRMED"
        ) {

            order.confirmedAt =
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
   UPDATE STATUS
   ==========================================================================

   Alias used by older controller/routes.

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
            _id: orderId,
        };


        /* ------------------------------------------------------------------
           MEMBER OWNERSHIP
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           PAYMENT CHECK
           ------------------------------------------------------------------ */

        const paymentStatus =
            String(
                order.paymentStatus ||
                ""
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


        /* ------------------------------------------------------------------
           STATUS CHECK
           ------------------------------------------------------------------ */

        const currentStatus =
            String(
                order.status ||
                ""
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


        /* ------------------------------------------------------------------
           CANCEL
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           PAID ORDERS SHOULD NOT BE DELETED
           ------------------------------------------------------------------ */

        if (
            String(
                order.paymentStatus ||
                ""
            ).toUpperCase() ===
            "PAID"
        ) {

            throw new Error(
                "Paid orders cannot be deleted"
            );
        }


        /* ------------------------------------------------------------------
           DELETE ORDER ITEMS FIRST
           ------------------------------------------------------------------ */

        await OrderItem.deleteMany({
            orderId:
                order._id,
        });


        /* ------------------------------------------------------------------
           DELETE ORDER
           ------------------------------------------------------------------ */

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
    managerId
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
                    "_id name userId role referralCode"
                )
                .lean();


        if (!manager) {

            throw new Error(
                "Manager not found"
            );
        }


        /* ------------------------------------------------------------------
           FIND MEMBERS UNDER MANAGER
           ------------------------------------------------------------------ */

        const members =
            await User.find({
                managerId:
                    manager._id,
            })
                .select(
                    "_id name userId email mobile"
                )
                .lean();


        const memberIds =
            members.map(
                (member) =>
                    member._id
            );


        /* ------------------------------------------------------------------
           INCLUDE MANAGER'S OWN ORDERS
           ------------------------------------------------------------------ */

        memberIds.push(
            manager._id
        );


        /* ------------------------------------------------------------------
           FETCH ORDERS
           ------------------------------------------------------------------ */

        const orders =
            await Order.find({

                userId: {
                    $in:
                        memberIds,
                },

            })
                .populate(
                    "userId",
                    "name userId email mobile role referralCode"
                )
                .sort({
                    createdAt: -1,
                })
                .lean();


        if (!orders.length) {
            return [];
        }


        /* ------------------------------------------------------------------
           FETCH ITEMS
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           GROUP ITEMS
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           RETURN
           ------------------------------------------------------------------ */

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


        /* ------------------------------------------------------------------
           TOTAL ORDERS
           ------------------------------------------------------------------ */

        const totalOrders =
            await Order.countDocuments(
                query
            );


        /* ------------------------------------------------------------------
           PAID ORDERS
           ------------------------------------------------------------------ */

        const paidOrders =
            await Order.countDocuments({
                ...query,

                paymentStatus:
                    "PAID",
            });


        /* ------------------------------------------------------------------
           PENDING PAYMENT
           ------------------------------------------------------------------ */

        const pendingPaymentOrders =
            await Order.countDocuments({
                ...query,

                paymentStatus:
                    "PENDING",
            });


        /* ------------------------------------------------------------------
           FAILED PAYMENT
           ------------------------------------------------------------------ */

        const failedPaymentOrders =
            await Order.countDocuments({
                ...query,

                paymentStatus:
                    "FAILED",
            });


        /* ------------------------------------------------------------------
           CANCELLED
           ------------------------------------------------------------------ */

        const cancelledOrders =
            await Order.countDocuments({
                ...query,

                status:
                    "CANCELLED",
            });


        /* ------------------------------------------------------------------
           DELIVERED
           ------------------------------------------------------------------ */

        const deliveredOrders =
            await Order.countDocuments({
                ...query,

                status:
                    "DELIVERED",
            });


        /* ------------------------------------------------------------------
           TOTAL REVENUE
           ------------------------------------------------------------------ */

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
                    ?.totalRevenue || 0
            );


        /* ------------------------------------------------------------------
           TOTAL SUBTOTAL
           ------------------------------------------------------------------ */

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
                    ?.totalSubtotal || 0
            );


        /* ------------------------------------------------------------------
           TOTAL DELIVERY
           ------------------------------------------------------------------ */

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
                    ?.totalDelivery || 0
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
   MODULE EXPORTS
   ========================================================================== */

module.exports = {

    /* ------------------------------------------------------------------
       ORDER CREATION
       ------------------------------------------------------------------ */

    createOrder,

    placeOrder,

    /*
     * IMPORTANT:
     * Required by:
     *
     * order.controller.js
     * → orderService.placeGuestOrder()
     */

    placeGuestOrder,


    /* ------------------------------------------------------------------
       ORDER FETCHING
       ------------------------------------------------------------------ */

    getOrderById,

    getMyOrders,

    getAllOrders,

    getOrdersByMobile,


    /* ------------------------------------------------------------------
       GUEST ORDER MANAGEMENT
       ------------------------------------------------------------------ */

    linkGuestOrdersToUser,

    claimGuestOrders,


    /* ------------------------------------------------------------------
       SELLING POINTS
       ------------------------------------------------------------------ */

    processSellingPoints,

    calculateOrderSellingPoints,


    /* ------------------------------------------------------------------
       PAYMENT
       ------------------------------------------------------------------ */

    updatePaymentStatus,


    /* ------------------------------------------------------------------
       ORDER STATUS
       ------------------------------------------------------------------ */

    updateOrderStatus,

    updateStatus,


    /* ------------------------------------------------------------------
       ORDER MANAGEMENT
       ------------------------------------------------------------------ */

    cancelOrder,

    deleteOrder,


    /* ------------------------------------------------------------------
       MANAGER
       ------------------------------------------------------------------ */

    getManagerOrders,


    /* ------------------------------------------------------------------
       STATISTICS
       ------------------------------------------------------------------ */

    getOrderStats,

};