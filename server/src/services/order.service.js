const orderRepository = require("../repositories/order.repository");

const cartRepository = require("../repositories/cart.repository");

const sellingPointService = require("./sellingPoint.service");

const commissionService = require("./commission.service");

const User = require("../models/user.model");

const Product = require("../models/product");

const ApiError = require("../utils/ApiError");

/* ==========================================
   Generate Order Number
========================================== */

const generateOrderNumber =
  (prefix = "ORD") => {
    const timestamp =
      Date.now();

    const random =
      Math.floor(
        1000 +
          Math.random() *
            9000
      );

    return `${prefix}-${timestamp}-${random}`;
  };

/* ==========================================
   Normalize Mobile
========================================== */

const normalizeMobile = (
  mobile
) => {
  return String(
    mobile || ""
  ).replace(
    /\D/g,
    ""
  );
};

/* ==========================================
   MEMBER ORDER
========================================== */

const placeOrder = async (
  userId,
  payload = {}
) => {
  const cart =
    await cartRepository.findByUser(
      userId
    );

  if (
    !cart ||
    !cart.items ||
    !cart.items.length
  ) {
    throw new ApiError(
      400,
      "Cart is empty"
    );
  }

  /*
  ========================================================
  CALCULATE FROM SERVER CART
  ========================================================
  */

  const subtotal =
    cart.items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (Number(
          item.price
        ) || 0) *
          (Number(
            item.quantity
          ) || 0),
      0
    );

  const discount = 0;

  const walletAmount = 0;

  const deliveryCharge =
    Number(
      payload.deliveryCharge ||
        0
    );

  const finalAmount =
    subtotal -
    discount -
    walletAmount +
    deliveryCharge;

  if (
    finalAmount <= 0
  ) {
    throw new ApiError(
      400,
      "Invalid order amount"
    );
  }

  /*
  ========================================================
  DELIVERY DETAILS
  ========================================================
  */

  const deliveryDetails =
    {
      name:
        String(
          payload.name ||
            ""
        ).trim(),

      mobile:
        normalizeMobile(
          payload.mobile
        ),

      address:
        String(
          payload.address ||
            ""
        ).trim(),

      city:
        String(
          payload.city ||
            ""
        ).trim(),

      state:
        String(
          payload.state ||
            ""
        ).trim(),

      pincode:
        String(
          payload.pincode ||
            ""
        ).replace(
          /\D/g,
          ""
        ),
    };

  /*
  ========================================================
  CREATE MEMBER ORDER
  ========================================================
  */

  const order =
    await orderRepository.createOrder(
      {
        userId,

        orderType:
          "MEMBER",

        customerName:
          deliveryDetails.name,

        customerMobile:
          deliveryDetails.mobile,

        customerEmail:
          String(
            payload.email ||
              ""
          )
            .trim()
            .toLowerCase(),

        membershipLinked:
          true,

        linkedAt:
          new Date(),

        orderNumber:
          generateOrderNumber(
            "ORD"
          ),

        subtotal,

        discount,

        walletAmount,

        deliveryCharge,

        finalAmount,

        sellingPoints: 0,

        sellingPointsProcessed:
          false,

        sellingPointsProcessedAt:
          null,

        status:
          "PLACED",

        paymentStatus:
          "PENDING",

        paymentMethod:
          "PHONEPE",

        deliveryDetails,
      }
    );

  /*
  ========================================================
  CREATE ORDER ITEMS
  ========================================================
  */

  const orderItems =
    cart.items.map(
      (item) => ({
        orderId:
          order._id,

        productId:
          item.product?._id ||
          item.productId ||
          item.product,

        productName:
          item.product
            ?.productName ||
          "Product",

        quantity:
          Number(
            item.quantity
          ),

        price:
          Number(
            item.price
          ),

        total:
          Number(
            item.price
          ) *
          Number(
            item.quantity
          ),
      })
    );

  await orderRepository.createOrderItems(
    orderItems
  );

  /*
  IMPORTANT:
  Do NOT clear the member cart here.
  Payment verification handles that later.
  */

  return {
    ...order.toObject(),

    items:
      orderItems,
  };
};

/* ==========================================
   GUEST ORDER
========================================== */

const placeGuestOrder =
  async (
    payload = {}
  ) => {
    /*
    ========================================================
    CUSTOMER DETAILS
    ========================================================
    */

    const customerName =
      String(
        payload.name ||
          payload.customerName ||
          ""
      ).trim();

    const customerMobile =
      normalizeMobile(
        payload.mobile ||
          payload.customerMobile
      );

    const customerEmail =
      String(
        payload.email ||
          payload.customerEmail ||
          ""
      )
        .trim()
        .toLowerCase();

    const address =
      String(
        payload.address ||
          ""
      ).trim();

    const city =
      String(
        payload.city ||
          ""
      ).trim();

    const state =
      String(
        payload.state ||
          ""
      ).trim();

    const pincode =
      String(
        payload.pincode ||
          ""
      ).replace(
        /\D/g,
        ""
      );

    /*
    ========================================================
    VALIDATE CUSTOMER DETAILS
    ========================================================
    */

    if (!customerName) {
      throw new ApiError(
        400,
        "Customer name is required"
      );
    }

    if (
      customerMobile.length !==
      10
    ) {
      throw new ApiError(
        400,
        "Valid 10-digit mobile number is required"
      );
    }

    if (!address) {
      throw new ApiError(
        400,
        "Delivery address is required"
      );
    }

    if (!city) {
      throw new ApiError(
        400,
        "City is required"
      );
    }

    if (!state) {
      throw new ApiError(
        400,
        "State is required"
      );
    }

    if (
      pincode.length !==
      6
    ) {
      throw new ApiError(
        400,
        "Valid 6-digit pincode is required"
      );
    }

    /*
    ========================================================
    GUEST CART ITEMS
    ========================================================

    Phase 4 will send the localStorage cart here.

    Expected:

    items: [
      {
        productId,
        quantity
      }
    ]
    */

    if (
      !Array.isArray(
        payload.items
      ) ||
      !payload.items.length
    ) {
      throw new ApiError(
        400,
        "Cart items are required"
      );
    }

    /*
    ========================================================
    NORMALIZE ITEM QUANTITIES
    ========================================================
    */

    const requestedItems =
      payload.items.map(
        (item) => ({
          productId:
            item.productId ||
            item.product?._id ||
            item.product,

          quantity:
            Number(
              item.quantity
            ),
        })
      );

    for (const item of requestedItems) {
      if (!item.productId) {
        throw new ApiError(
          400,
          "Product ID is required for every cart item"
        );
      }

      if (
        !Number.isInteger(
          item.quantity
        ) ||
        item.quantity < 1
      ) {
        throw new ApiError(
          400,
          "Invalid product quantity"
        );
      }
    }

    /*
    ========================================================
    FETCH PRODUCTS FROM DATABASE
    ========================================================

    IMPORTANT:
    Never trust the guest browser for price.

    The server retrieves the actual
    product price from MongoDB.
    */

    const productIds =
      requestedItems.map(
        (item) =>
          item.productId
      );

    const products =
      await Product.find({
        _id: {
          $in: productIds,
        },

        status: "Active",
      });

    if (
      products.length !==
      requestedItems.length
    ) {
      throw new ApiError(
        400,
        "One or more products are unavailable"
      );
    }

    /*
    ========================================================
    CREATE PRODUCT MAP
    ========================================================
    */

    const productMap =
      new Map();

    products.forEach(
      (product) => {
        productMap.set(
          product._id.toString(),
          product
        );
      }
    );

    /*
    ========================================================
    BUILD ORDER ITEMS
    ========================================================
    */

    const orderItemsData =
      [];

    let subtotal = 0;

    for (const item of requestedItems) {
      const product =
        productMap.get(
          item.productId.toString()
        );

      if (!product) {
        throw new ApiError(
          400,
          "Product not found"
        );
      }

      const price =
        Number(
          product.price
        );

      const quantity =
        Number(
          item.quantity
        );

      const total =
        price * quantity;

      subtotal += total;

      orderItemsData.push(
        {
          productId:
            product._id,

          productName:
            product.productName,

          quantity,

          price,

          total,
        }
      );
    }

    /*
    ========================================================
    DELIVERY CHARGE
    ========================================================
    */

    const discount = 0;

    const walletAmount = 0;

    const deliveryCharge =
      Number(
        payload.deliveryCharge ||
          0
      );

    const finalAmount =
      subtotal -
      discount -
      walletAmount +
      deliveryCharge;

    if (
      finalAmount <= 0
    ) {
      throw new ApiError(
        400,
        "Invalid order amount"
      );
    }

    /*
    ========================================================
    CREATE GUEST ORDER
    ========================================================
    */

    const order =
      await orderRepository.createOrder(
        {
          userId:
            null,

          orderType:
            "GUEST",

          customerName,

          customerMobile,

          customerEmail,

          membershipLinked:
            false,

          linkedAt:
            null,

          orderNumber:
            generateOrderNumber(
              "GST"
            ),

          subtotal,

          discount,

          walletAmount,

          deliveryCharge,

          finalAmount,

          sellingPoints: 0,

          sellingPointsProcessed:
            false,

          sellingPointsProcessedAt:
            null,

          status:
            "PLACED",

          paymentStatus:
            "PENDING",

          paymentMethod:
            "PHONEPE",

          deliveryDetails:
            {
              name:
                customerName,

              mobile:
                customerMobile,

              address,

              city,

              state,

              pincode,
            },
        }
      );

    /*
    ========================================================
    ATTACH ORDER ID TO ITEMS
    ========================================================
    */

    const orderItems =
      orderItemsData.map(
        (item) => ({
          ...item,

          orderId:
            order._id,
        })
      );

    await orderRepository.createOrderItems(
      orderItems
    );

    return {
      ...order.toObject(),

      items:
        orderItems,
    };
  };

/* ==========================================
   MEMBER ORDERS
========================================== */

const getMyOrders =
  async (
    userId
  ) => {
    const orders =
      await orderRepository.getMyOrders(
        userId
      );

    return await Promise.all(
      orders.map(
        async (order) => ({
          ...order.toObject(),

          items:
            await orderRepository.findByOrderId(
              order._id
            ),
        })
      )
    );
  };

/* ==========================================
   ORDER DETAILS
========================================== */

const getOrderById =
  async (
    orderId,
    userId
  ) => {
    const order =
      await orderRepository.findById(
        orderId
      );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    /*
    Guest orders cannot be accessed
    through this authenticated member
    endpoint.
    */

    if (
      !order.userId ||
      order.userId._id
        ?.toString() !==
        userId.toString()
    ) {
      throw new ApiError(
        403,
        "Unauthorized"
      );
    }

    return {
      ...order.toObject(),

      items:
        await orderRepository.findByOrderId(
          order._id
        ),
    };
  };

/* ==========================================
   ADMIN ORDERS
========================================== */

const getAllOrders =
  async () => {
    const orders =
      await orderRepository.getAllOrders();

    return await Promise.all(
      orders.map(
        async (order) => ({
          ...order.toObject(),

          items:
            await orderRepository.findByOrderId(
              order._id
            ),
        })
      )
    );
  };

/* ==========================================
   UPDATE ORDER STATUS
========================================== */

const updateOrderStatus =
  async (
    orderId,
    status
  ) => {
    const order =
      await orderRepository.updateStatus(
        orderId,
        status
      );

    if (!order) {
      throw new ApiError(
        404,
        "Order not found"
      );
    }

    /*
    ========================================================
    SELLING POINT PROCESSING
    ========================================================
    */

    if (
      order.paymentStatus ===
        "PAID" &&
      (
        status ===
          "SHIPPED" ||
        status ===
          "DELIVERED"
      ) &&
      !order.sellingPointsProcessed
    ) {
      /*
      Guest orders must not receive
      member selling points.
      */

      if (
        !order.userId
      ) {
        return {
          ...order.toObject(),

          items:
            await orderRepository.findByOrderId(
              order._id
            ),
        };
      }

      const user =
        await User.findById(
          order.userId
        );

      if (user) {
        const updatedUser =
          await sellingPointService.updateSellingPoints(
            user._id,
            order.finalAmount,
            order._id
          );

        const orderSellingPoints =
          Math.floor(
            Number(
              order.finalAmount ||
                0
            ) / 100
          ) * 2;

        order.sellingPoints =
          orderSellingPoints;

        order.sellingPointsProcessed =
          true;

        order.sellingPointsProcessedAt =
          new Date();

        await order.save();

        if (
          updatedUser?.sponsorId
        ) {
          await commissionService.distributeCommission(
            updatedUser._id,
            updatedUser.sponsorId,
            order.finalAmount
          );
        }
      }
    }

    return {
      ...order.toObject(),

      items:
        await orderRepository.findByOrderId(
          order._id
        ),
    };
  };

/* ==========================================
   GUEST ORDERS BY MOBILE
========================================== */

const getGuestOrdersByMobile =
  async (
    customerMobile
  ) => {

    const normalizedMobile =
      String(
        customerMobile || ""
      ).replace(
        /\D/g,
        ""
      );


    if (
      normalizedMobile.length !==
      10
    ) {

      throw new ApiError(
        400,
        "Valid 10-digit mobile number is required"
      );

    }


    const orders =
      await orderRepository.findGuestOrdersByMobile(
        normalizedMobile
      );


    return await Promise.all(

      orders.map(
        async (
          order
        ) => {

          return {
            ...order.toObject(),

            items:
              await orderRepository.findByOrderId(
                order._id
              ),

          };

        }
      )

    );

  };

/* ==========================================
   MANAGER ORDERS
========================================== */

const getManagerOrders =
  async () => {

    const orders =
      await orderRepository.getAllOrders();


    return await Promise.all(

      orders.map(
        async (
          order
        ) => {

          return {
            ...order.toObject(),

            items:
              await orderRepository.findByOrderId(
                order._id
              ),

          };

        }
      )

    );

  };


/* ==========================================
   UPDATE PAYMENT STATUS
========================================== */

const updatePaymentStatus =
  async (
    orderId,
    paymentStatus
  ) => {

    const order =
      await orderRepository.updatePaymentStatus(
        orderId,
        paymentStatus
      );


    if (!order) {

      throw new ApiError(
        404,
        "Order not found"
      );

    }


    /*
    If payment is manually confirmed
    by Admin, record paidAt.
    */

    if (
      paymentStatus ===
      "PAID"
    ) {

      order.paidAt =
        new Date();

      /*
      If the order is still PLACED,
      payment confirmation can move
      it to CONFIRMED.

      We do NOT automatically change
      orders that are already further
      in the lifecycle.
      */

      if (
        order.status ===
        "PLACED"
      ) {

        order.status =
          "CONFIRMED";

        order.confirmedAt =
          new Date();

      }

      await order.save();

    }


    return {
      ...order.toObject(),

      items:
        await orderRepository.findByOrderId(
          order._id
        ),
    };

  };

module.exports = {
  placeOrder,
  placeGuestOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  getManagerOrders,
  updateOrderStatus,
  getGuestOrdersByMobile,
  updatePaymentStatus,
};