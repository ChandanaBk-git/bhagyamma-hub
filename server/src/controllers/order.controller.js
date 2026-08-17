const asyncHandler =
  require("../utils/asyncHandler");

const ApiResponse =
  require("../utils/ApiResponse");

const orderService =
  require("../services/order.service");


/* ==========================================
   MEMBER PLACE ORDER
========================================== */

const placeOrder =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const order =
        await orderService.placeOrder(
          req.user.id,
          req.body
        );

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            "Order created successfully",
            order
          )
        );

    }
  );


/* ==========================================
   GUEST PLACE ORDER
========================================== */

const placeGuestOrder =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const order =
        await orderService.placeGuestOrder(
          req.body
        );

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            "Guest order created successfully",
            order
          )
        );

    }
  );


/* ==========================================
   GUEST ORDERS BY MOBILE
========================================== */

const getGuestOrdersByMobile =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const mobile =
        String(
          req.params.mobile || ""
        ).replace(
          /\D/g,
          ""
        );


      if (
        mobile.length !== 10
      ) {

        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              "Please enter a valid 10-digit mobile number",
              []
            )
          );

      }


      const orders =
        await orderService.getGuestOrdersByMobile(
          mobile
        );


      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            orders.length
              ? "Orders fetched successfully"
              : "No orders found for this mobile number",
            orders
          )
        );

    }
  );


/* ==========================================
   MEMBER ORDERS
========================================== */

const getMyOrders =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const orders =
        await orderService.getMyOrders(
          req.user.id
        );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Orders fetched successfully",
            orders
          )
        );

    }
  );


/* ==========================================
   ADMIN - ALL ORDERS
========================================== */

const getAllOrders =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const orders =
        await orderService.getAllOrders();


      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "All orders fetched successfully",
            orders
          )
        );

    }
  );


/* ==========================================
   MANAGER - VIEW ALL ORDERS
========================================== */

const getManagerOrders =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const orders =
        await orderService.getManagerOrders();


      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Orders fetched successfully",
            orders
          )
        );

    }
  );


/* ==========================================
   ORDER DETAILS
========================================== */

const getOrderById =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const order =
        await orderService.getOrderById(
          req.params.id,
          req.user.id
        );


      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Order fetched successfully",
            order
          )
        );

    }
  );


/* ==========================================
   ADMIN - UPDATE ORDER STATUS
========================================== */

const updateOrderStatus =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const order =
        await orderService.updateOrderStatus(
          req.params.id,
          req.body.status
        );


      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Order status updated successfully",
            order
          )
        );

    }
  );


/* ==========================================
   ADMIN - UPDATE PAYMENT STATUS
========================================== */

const updatePaymentStatus =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const paymentStatus =
        String(
          req.body.paymentStatus || ""
        )
          .trim()
          .toUpperCase();


      const allowedStatuses = [
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
      ];


      if (
        !allowedStatuses.includes(
          paymentStatus
        )
      ) {

        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              "Invalid payment status",
              null
            )
          );

      }


      const order =
        await orderService.updatePaymentStatus(
          req.params.id,
          paymentStatus
        );


      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Payment status updated successfully",
            order
          )
        );

    }
  );


module.exports = {

  placeOrder,

  placeGuestOrder,

  getGuestOrdersByMobile,

  getMyOrders,

  getAllOrders,

  getManagerOrders,

  getOrderById,

  updateOrderStatus,

  updatePaymentStatus,

};