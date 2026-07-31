const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");

const createOrder = async (payload) => {
    return await Order.create(payload);
};

const createOrderItems = async (items) => {
    return await OrderItem.insertMany(items);
};

const findById = async (id) => {
    return await Order.findById(id)
        .populate("userId");
};

const findByOrderId = async (orderId) => {
    return await OrderItem.find({
        orderId,
    }).populate("productId");
};

const getMyOrders = async (userId) => {
    return await Order.find({
        userId,
    }).sort({
        createdAt: -1,
    });
};

const getAllOrders = async () => {
    return await Order.find()
        .populate("userId")
        .sort({
            createdAt: -1,
        });
};

const updateStatus = async (
    id,
    status
) => {
    return await Order.findByIdAndUpdate(
        id,
        {
            status,
        },
        {
            new: true,
        }
    );
};

const getLastOrder = async () => {
    return await Order.findOne().sort({ createdAt: -1 });
};

const updatePaymentStatus = async (
    id,
    paymentStatus
) => {
    return await Order.findByIdAndUpdate(
        id,
        {
            paymentStatus,
        },
        {
            new: true,
        }
    );
};

module.exports = {
    createOrder,
    createOrderItems,
    findById,
    findByOrderId,
    getMyOrders,
    getAllOrders,
    updateStatus,
    updatePaymentStatus,
    getLastOrder,
};