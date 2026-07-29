const Cart = require("../models/cart.model");

const create = async (payload) => {
    return await Cart.create(payload);
};

const findByUser = async (userId) => {
    return await Cart.findOne({ userId })
        .populate("items.productId");
};

const updateById = async (id, payload) => {
    return await Cart.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true,
        }
    ).populate("items.productId");
};

const clearCart = async (userId) => {
    return await Cart.findOneAndUpdate(
        { userId },
        {
            items: [],
            totalQuantity: 0,
            subtotal: 0,
        },
        {
            new: true,
        }
    );
};

const deleteCart = async (userId) => {
    return await Cart.findOneAndDelete({ userId });
};

module.exports = {
    create,
    findByUser,
    updateById,
    clearCart,
    deleteCart,
};