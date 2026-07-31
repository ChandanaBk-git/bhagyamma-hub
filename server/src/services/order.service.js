const orderRepository = require("../repositories/order.repository");
const cartRepository = require("../repositories/cart.repository");
const productRepository = require("../repositories/product.repository");
const walletService = require("./wallet.service");
const userRepository = require("../repositories/user.repository");

const ApiError = require("../utils/ApiError");

const placeOrder = async (userId) => {

    const user = await userRepository.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const cart = await cartRepository.findByUser(userId);

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    let subtotal = 0;
    let orderItems = [];

    for (const item of cart.items) {

        const product = await productRepository.findById(
            item.productId._id || item.productId
        );

        if (!product) {
            throw new ApiError(
                404,
                `${item.productId.name || "Product"} not found`
            );
        }

        if (!product.isActive) {
            throw new ApiError(
                400,
                `${product.name} is inactive`
            );
        }

        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `${product.name} has only ${product.stock} stock left`
            );
        }

        const total =
            product.sellingPrice * item.quantity;

        subtotal += total;

        orderItems.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.sellingPrice,
            total,
        });
    }

    let discount = 0;

    if (user.role === "SUPERVISOR") {
        discount = subtotal * 0.5;
    }

    const grandTotal = subtotal - discount;

    const sellingPoints = Math.floor(grandTotal / 100) * 2;


    // Generate Order Number
const lastOrder = await orderRepository.getLastOrder();

let orderNumber = "ORD000001";

if (lastOrder) {
    const number = parseInt(lastOrder.orderNumber.replace("ORD", ""));
    orderNumber = "ORD" + String(number + 1).padStart(6, "0");
}

        // Debit Wallet
    await walletService.debitWallet(
        userId,
        grandTotal,
        "Product Purchase"
    );

    // Create Order
const order = await orderRepository.createOrder({
    userId,
    orderNumber,
    subtotal,
    discount,
    walletAmount: grandTotal,
    finalAmount: grandTotal,
    sellingPoints,
    paymentStatus: "PAID",
    status: "PENDING",
});


    // Create Order Items
    const items = orderItems.map((item) => ({
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
    }));

    await orderRepository.createOrderItems(items);

    // Reduce Product Stock
    for (const item of orderItems) {

        const product =
            await productRepository.findById(item.productId);

        await productRepository.updateById(
            product._id,
            {
                stock:
                    product.stock - item.quantity,
            }
        );
    }

    // Add Selling Points
    const updatedUser =
        await userRepository.addSellingPoints(
            userId,
            sellingPoints
        );

    // Auto Promotion
    if (
        updatedUser.role === "MEMBER" &&
        updatedUser.spBalance >= 500
    ) {

        await userRepository.promoteToSupervisor(
            userId
        );
    }

    // Clear Cart
    await cartRepository.clearCart(userId);

    return {
        order,
        items,
        sellingPoints,
    };

};

module.exports = {
    placeOrder,
};