const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const orderService = require("../services/order.service");

const placeOrder = asyncHandler(async (req, res) => {
    const order = await orderService.placeOrder(req.user.id);

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order placed successfully"
        )
    );
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getMyOrders(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(
        req.params.id,
        req.user
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order fetched successfully"
        )
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await orderService.getAllOrders();

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await orderService.updateOrderStatus(
        req.params.id,
        req.body.status
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order status updated successfully"
        )
    );
});

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};