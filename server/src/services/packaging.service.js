const jwt = require("jsonwebtoken");

const PackagingStaff = require("../models/packagingStaff.model");
const PackagingAssignment = require("../models/packagingAssignment.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const ApiError = require("../utils/ApiError");

const {
    createOrderBillPdf,
} = require("../utils/orderBillPdf");

/*
=========================================================
CREATE PACKAGING JWT
=========================================================
*/

const signPackagingToken = (staff) => {
    return jwt.sign(
        {
            id: staff._id.toString(),
            packagingStaffId: staff._id.toString(),
            role: "PACKAGING",
            loginId: staff.loginId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

/*
=========================================================
CREATE PACKAGING ACCOUNT
=========================================================
*/

const createStaff = async (data, adminUserId) => {
    const name = String(data.name || "").trim();

    const loginId = String(data.loginId || "")
        .trim()
        .toUpperCase();

    const password = String(data.password || "");

    const branchName = String(data.branchName || "").trim();

    const branchMemberNumber = String(
        data.branchMemberNumber || ""
    ).trim();

    if (!name) {
        throw new ApiError(400, "Packaging staff name is required");
    }

    if (!loginId) {
        throw new ApiError(400, "Packaging login ID is required");
    }

    if (!password) {
        throw new ApiError(400, "Packaging password is required");
    }

    if (password.length < 8) {
        throw new ApiError(
            400,
            "Password must contain at least 8 characters"
        );
    }

    if (!branchName) {
        throw new ApiError(400, "Branch name is required");
    }

    if (!branchMemberNumber) {
        throw new ApiError(400, "Branch member number is required");
    }

    const existing = await PackagingStaff.findOne({ loginId });

    if (existing) {
        throw new ApiError(
            409,
            "This packaging login ID already exists"
        );
    }

    const existingMemberNumber = await PackagingStaff.findOne({
        branchMemberNumber,
    });

    if (existingMemberNumber) {
        throw new ApiError(
            409,
            "This branch member number already exists"
        );
    }

    const staff = await PackagingStaff.create({
        name,
        loginId,
        password,
        branchName,
        branchMemberNumber,
        createdBy: adminUserId,
    });

    return {
        id: staff._id,
        name: staff.name,
        loginId: staff.loginId,
        password,
        role: "PACKAGING",
        isActive: staff.isActive,
        branchId: staff.branchId,
        branchName: staff.branchName,
        branchMemberNumber: staff.branchMemberNumber,
        createdBy: staff.createdBy,
        createdAt: staff.createdAt,
        lastLoginAt: staff.lastLoginAt,
    };
};

/*
=========================================================
PACKAGING LOGIN
=========================================================
*/

const login = async (loginId, password) => {
    const cleanLoginId = String(loginId || "")
        .trim()
        .toUpperCase();

    const staff = await PackagingStaff.findOne({
        loginId: cleanLoginId,
    }).select("+password");

    if (!staff) {
        throw new ApiError(
            401,
            "Invalid packaging login ID or password"
        );
    }

    if (!staff.isActive) {
        throw new ApiError(
            403,
            "This packaging account is inactive"
        );
    }

    const validPassword = await staff.comparePassword(password);

    if (!validPassword) {
        throw new ApiError(
            401,
            "Invalid packaging login ID or password"
        );
    }

    staff.lastLoginAt = new Date();

    await staff.save();

    return {
        token: signPackagingToken(staff),
        user: {
            id: staff._id,
            packagingStaffId: staff._id,
            name: staff.name,
            loginId: staff.loginId,
            role: "PACKAGING",
            isActive: staff.isActive,
            branchId: staff.branchId,
            branchName: staff.branchName,
            branchMemberNumber: staff.branchMemberNumber,
            createdAt: staff.createdAt,
            lastLoginAt: staff.lastLoginAt,
        },
    };
};

/*
=========================================================
LIST PACKAGING STAFF
=========================================================
*/

const listStaff = async () => {
    return PackagingStaff.find()
        .select("-password")
        .populate("createdBy", "name email")
        .sort({
            createdAt: -1,
        });
};

/*
=========================================================
UPDATE PACKAGING STAFF
=========================================================
*/

const updateStaff = async (staffId, data, adminUserId) => {
    const staff = await PackagingStaff.findById(staffId)
        .select("+password");

    if (!staff) {
        throw new ApiError(404, "Packaging staff not found");
    }

    const name = String(data.name ?? staff.name).trim();

    const loginId = String(data.loginId ?? staff.loginId)
        .trim()
        .toUpperCase();

    const branchName = String(
        data.branchName ?? staff.branchName ?? ""
    ).trim();

    const branchMemberNumber = String(
        data.branchMemberNumber ?? staff.branchMemberNumber ?? ""
    ).trim();

    if (!name) {
        throw new ApiError(400, "Packaging staff name is required");
    }

    if (!loginId) {
        throw new ApiError(400, "Packaging login ID is required");
    }

    if (!branchName) {
        throw new ApiError(400, "Branch name is required");
    }

    if (!branchMemberNumber) {
        throw new ApiError(400, "Branch member number is required");
    }

    const duplicateLogin = await PackagingStaff.findOne({
        loginId,
        _id: {
            $ne: staffId,
        },
    });

    if (duplicateLogin) {
        throw new ApiError(
            409,
            "This packaging login ID already exists"
        );
    }

    const duplicateMemberNumber = await PackagingStaff.findOne({
        branchMemberNumber,
        _id: {
            $ne: staffId,
        },
    });

    if (duplicateMemberNumber) {
        throw new ApiError(
            409,
            "This branch member number already exists"
        );
    }

    staff.name = name;
    staff.loginId = loginId;
    staff.branchName = branchName;
    staff.branchMemberNumber = branchMemberNumber;

    if (typeof data.isActive === "boolean") {
        staff.isActive = data.isActive;
    }

    const newPassword = String(data.password || "");

    if (newPassword) {
        if (newPassword.length < 8) {
            throw new ApiError(
                400,
                "Password must contain at least 8 characters"
            );
        }

        staff.password = newPassword;
    }

    await staff.save();

    return {
        id: staff._id,
        name: staff.name,
        loginId: staff.loginId,
        role: "PACKAGING",
        isActive: staff.isActive,
        branchId: staff.branchId,
        branchName: staff.branchName,
        branchMemberNumber: staff.branchMemberNumber,
        createdBy: staff.createdBy,
        createdAt: staff.createdAt,
        lastLoginAt: staff.lastLoginAt,
        updatedBy: adminUserId,
    };
};

/*
=========================================================
GET OR CREATE ASSIGNMENT
=========================================================
*/

const getOrCreateAssignment = async (orderId) => {
    let assignment = await PackagingAssignment.findOne({
        order: orderId,
    });

    if (!assignment) {
        assignment = await PackagingAssignment.create({
            order: orderId,
        });
    }

    return assignment;
};

/*
=========================================================
ASSIGN ORDER
=========================================================
*/

const assignOrder = async (orderId, staffId, adminUserId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const staff = await PackagingStaff.findOne({
        _id: staffId,
        isActive: true,
    });

    if (!staff) {
        throw new ApiError(
            404,
            "Active packaging staff not found"
        );
    }

    if (!["PLACED", "CONFIRMED"].includes(order.status)) {
        throw new ApiError(
            400,
            "This order cannot be assigned for packaging"
        );
    }

    const assignment = await getOrCreateAssignment(orderId);

    if (
        ["PACKING", "PACKED", "READY_FOR_DISPATCH"].includes(
            assignment.status
        )
    ) {
        throw new ApiError(
            400,
            "This order is already being processed"
        );
    }

    assignment.staff = staff._id;
    assignment.status = "ASSIGNED";
    assignment.assignedAt = new Date();

    if (!Array.isArray(assignment.history)) {
        assignment.history = [];
    }

    assignment.history.push({
        action: "ASSIGNED",
        byAdmin: adminUserId,
        byStaff: null,
        note: `Assigned to packaging staff ${staff.name}`,
        at: new Date(),
    });

    await assignment.save();

    // Once an order is assigned to packaging, move a newly placed order
    // into CONFIRMED so the customer bill reflects the workflow.
    if (String(order.status || "").toUpperCase() === "PLACED") {
        order.status = "CONFIRMED";
        if (!order.confirmedAt) {
            order.confirmedAt = new Date();
        }
        await order.save();
    }

    await assignment.populate("staff", "name loginId");

    return assignment;
};

/*
=========================================================
GET PACKAGING ORDERS
=========================================================
*/

const getOrdersForStaff = async (staffId) => {
    const assignments = await PackagingAssignment.find({
        staff: staffId,
    })
        .populate({
            path: "order",
            populate: {
                path: "userId",
                select: "name email mobile",
            },
        })
        .populate({
            path: "staff",
            select: "name loginId",
        })
        .sort({
            updatedAt: -1,
        });

    const result = await Promise.all(
        assignments.map(async (assignment) => {
            const orderId = assignment.order?._id;

            let items = [];

            if (orderId) {
                items = await OrderItem.find({
                    orderId,
                })
                    .populate(
                        "productId",
                        "name productName images price category brand"
                    )
                    .lean();
            }

            return {
                assignmentId: assignment._id,
                orderId,
                order: assignment.order,
                staff: assignment.staff,
                status: assignment.status,
                assignedAt: assignment.assignedAt,
                packingStartedAt: assignment.packingStartedAt,
                packedAt: assignment.packedAt,
                readyForDispatchAt: assignment.readyForDispatchAt,
                notes: assignment.notes,
                history: assignment.history,
                createdAt: assignment.createdAt,
                updatedAt: assignment.updatedAt,
                items,
            };
        })
    );

    return result;
};

/*
=========================================================
GET ORDER DETAILS
=========================================================
*/

const getOrderDetails = async (orderId, staffId) => {
    const order = await Order.findById(orderId).populate(
        "userId",
        "name email mobile"
    );

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const assignment = await PackagingAssignment.findOne({
        order: orderId,
    }).populate("staff", "name loginId");

    if (!assignment) {
        throw new ApiError(
            404,
            "Packaging assignment not found"
        );
    }

    if (
        String(assignment.staff?._id) !==
        String(staffId)
    ) {
        throw new ApiError(
            403,
            "This order is not assigned to your account"
        );
    }

    const items = await OrderItem.find({
        orderId: order._id,
    })
        .populate(
            "productId",
            "name productName images price category brand"
        )
        .lean();

    console.log("======================================");
    console.log("PACKAGING ORDER DETAILS");
    console.log("Order ID:", order._id.toString());
    console.log("Order Number:", order.orderNumber);
    console.log("ORDER ITEMS:", items);
    console.log("ITEM COUNT:", items.length);
    console.log("DELIVERY DETAILS:", order.deliveryDetails);
    console.log("======================================");

    return {
        order,
        items,
        assignment,
    };
};

/*
=========================================================
GENERATE ORDER BILL PDF FOR PACKAGING STAFF
=========================================================
*/

const getOrderBillPdf = async (orderId, staffId) => {
    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    // Get order and customer details
    const order = await Order.findById(orderId).populate(
        "userId",
        "name email mobile"
    );

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Verify packaging assignment
    const assignment = await PackagingAssignment.findOne({
        order: order._id,
    });

    if (!assignment) {
        throw new ApiError(
            404,
            "Packaging assignment not found"
        );
    }

    // Allow only the assigned packaging staff
    if (String(assignment.staff) !== String(staffId)) {
        throw new ApiError(
            403,
            "This order is not assigned to your account"
        );
    }

    // Fetch order items
    const items = await OrderItem.find({
        orderId: order._id,
    })
        .populate(
            "productId",
            "name productName images price category brand"
        )
        .lean();

    // Generate PDF using the existing PDF utility
    const pdfBuffer = await createOrderBillPdf(order, items);

    return {
        orderNumber: order.orderNumber,
        fileName: `Bhagyamma-Hub-${order.orderNumber || order._id}-Bill.pdf`,
        pdfBuffer,
    };
};

/*
=========================================================
UPDATE PACKAGING STATUS
=========================================================
*/

const updatePackagingStatus = async (
    orderId,
    status,
    staffId
) => {
    const assignment = await PackagingAssignment.findOne({
        order: orderId,
    });

    if (!assignment) {
        throw new ApiError(
            404,
            "Packaging assignment not found"
        );
    }

    // Verify assigned staff
    if (String(assignment.staff) !== String(staffId)) {
        throw new ApiError(
            403,
            "This order is not assigned to your account"
        );
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const cleanStatus = String(status || "")
        .trim()
        .toUpperCase();

    // Valid status transitions
    const transitions = {
        ASSIGNED: ["PACKING"],
        PACKING: ["PACKED"],
        PACKED: ["READY_FOR_DISPATCH"],
    };

    const allowed = transitions[assignment.status];

    if (!allowed || !allowed.includes(cleanStatus)) {
        throw new ApiError(
            400,
            `Invalid status transition from ${assignment.status} to ${cleanStatus}`
        );
    }

    const now = new Date();

    assignment.status = cleanStatus;

    if (cleanStatus === "PACKING") {
        assignment.packingStartedAt = now;
        order.status = "PACKING";

        if ("packingAt" in order) {
            order.packingAt = now;
        }
    }

    if (cleanStatus === "PACKED") {
        assignment.packedAt = now;
        order.status = "PACKED";

        if ("packedAt" in order) {
            order.packedAt = now;
        }
    }

    if (cleanStatus === "READY_FOR_DISPATCH") {
        assignment.readyForDispatchAt = now;
        order.status = "READY_FOR_DISPATCH";

        if ("readyForDispatchAt" in order) {
            order.readyForDispatchAt = now;
        }
    }

    if (!Array.isArray(assignment.history)) {
        assignment.history = [];
    }

    assignment.history.push({
        action: cleanStatus,
        byStaff: staffId,
        byAdmin: null,
        note: `Packaging status changed to ${cleanStatus}`,
        at: now,
    });

    await assignment.save();
    await order.save();

    return {
        order,
        assignment,
    };
};

/*
=========================================================
PACKAGING DASHBOARD
=========================================================
*/

const getDashboard = async (staffId) => {
    const assignments = await PackagingAssignment.find({
        staff: staffId,
    });

    const count = (status) =>
        assignments.filter(
            (item) => item.status === status
        ).length;

    return {
        totalOrders: assignments.length,
        totalAssigned: assignments.length,

        assignedOrders: count("ASSIGNED"),
        assigned: count("ASSIGNED"),

        packingOrders: count("PACKING"),
        packing: count("PACKING"),

        packedOrders: count("PACKED"),
        packed: count("PACKED"),

        readyForDispatchOrders: count("READY_FOR_DISPATCH"),
        readyForDispatch: count("READY_FOR_DISPATCH"),
    };
};

/*
=========================================================
EXPORTS
=========================================================
*/

module.exports = {
    createStaff,
    login,
    listStaff,
    updateStaff,
    assignOrder,
    getOrdersForStaff,
    getOrderDetails,
    updatePackagingStatus,
    getDashboard,
    getOrderBillPdf,
};