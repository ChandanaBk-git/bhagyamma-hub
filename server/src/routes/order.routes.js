const express = require("express");

const router = express.Router();

const controller = require("../controllers/order.controller");

const { protect, authorize } = require("../middleware/auth.middleware");

const validate = require("../middleware/validate.middleware");

const {
    updateOrderStatusValidation,
} = require("../validations/order.validation");

router.post(
    "/",
    protect,
    controller.placeOrder
);

router.get(
    "/my-orders",
    protect,
    controller.getMyOrders
);

router.get(
    "/:id",
    protect,
    controller.getOrderById
);

router.get(
    "/",
    protect,
    authorize("ADMIN"),
    controller.getAllOrders
);

router.patch(
    "/:id/status",
    protect,
    authorize("ADMIN"),
    updateOrderStatusValidation,
    validate,
    controller.updateOrderStatus
);

module.exports = router;