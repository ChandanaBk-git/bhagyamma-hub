const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/order.controller");

const {
  protect,
  authorize,
} = require("../middleware/auth.middleware");

const validate =
  require("../middleware/validate.middleware");

const {
  updateOrderStatusValidation,
  guestOrderValidation,
} = require("../validations/order.validation");


/* ======================================================
   GUEST CREATE ORDER
====================================================== */

router.post(
  "/guest",
  guestOrderValidation,
  validate,
  controller.placeGuestOrder
);


/* ======================================================
   GUEST ORDERS BY MOBILE
====================================================== */

router.get(
  "/guest/mobile/:mobile",
  controller.getGuestOrdersByMobile
);


/* ======================================================
   MEMBER CREATE ORDER
====================================================== */

router.post(
  "/",
  protect,
  controller.placeOrder
);


/* ======================================================
   MEMBER ORDERS
====================================================== */

router.get(
  "/my-orders",
  protect,
  controller.getMyOrders
);


/* ======================================================
   ADMIN - GET ALL ORDERS
======================================================

   IMPORTANT:
   Your actual admin role is SUPER_ADMIN.

   Therefore this MUST be:

   authorize("SUPER_ADMIN")

   NOT:

   authorize("ADMIN")
====================================================== */

router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  controller.getAllOrders
);


/* ======================================================
   MANAGER - VIEW ALL ORDERS
======================================================

   Manager can view orders.

   Manager cannot edit payment/order status.
====================================================== */

router.get(
  "/manager-orders",
  protect,
  authorize("MANAGER"),
  controller.getManagerOrders
);


/* ======================================================
   ADMIN - UPDATE PAYMENT STATUS
======================================================

   Only SUPER_ADMIN can change payment status.

====================================================== */

router.patch(
  "/:id/payment-status",
  protect,
  authorize("SUPER_ADMIN"),
  controller.updatePaymentStatus
);


/* ======================================================
   ADMIN - UPDATE ORDER STATUS
======================================================

   Only SUPER_ADMIN can change order status.

====================================================== */

router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN"),
  updateOrderStatusValidation,
  validate,
  controller.updateOrderStatus
);


/* ======================================================
   GET SINGLE ORDER
====================================================== */

router.get(
  "/:id",
  protect,
  controller.getOrderById
);


/* ======================================================
   EXPORT
====================================================== */

module.exports = router;