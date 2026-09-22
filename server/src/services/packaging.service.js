const jwt = require("jsonwebtoken");

const PackagingStaff = require("../models/packagingStaff.model");
const PackagingAssignment = require("../models/packagingAssignment.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const ApiError = require("../utils/ApiError");

/*
=========================================================
CREATE PACKAGING JWT
=========================================================
*/

const signPackagingToken = (staff) => {
    return jwt.sign(
        {
            id: staff._id.toString(),

            packagingStaffId:
                staff._id.toString(),

            role: "PACKAGING",

            loginId:
                staff.loginId,
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

const createStaff = async (
    data,
    adminUserId
) => {

    const name =
        String(
            data.name || ""
        ).trim();

    const loginId =
        String(
            data.loginId || ""
        )
            .trim()
            .toUpperCase();

    const password =
        String(
            data.password || ""
        );

    const branchName =
        String(
            data.branchName || ""
        ).trim();

    const branchMemberNumber =
        String(
            data.branchMemberNumber || ""
        ).trim();


    /*
    =====================================================
    VALIDATION
    =====================================================
    */

    if (!name) {
        throw new ApiError(
            400,
            "Packaging staff name is required"
        );
    }

    if (!loginId) {
        throw new ApiError(
            400,
            "Packaging login ID is required"
        );
    }

    if (!password) {
        throw new ApiError(
            400,
            "Packaging password is required"
        );
    }

    if (password.length < 8) {
        throw new ApiError(
            400,
            "Password must contain at least 8 characters"
        );
    }

    if (!branchName) {
        throw new ApiError(
            400,
            "Branch name is required"
        );
    }

    if (!branchMemberNumber) {
        throw new ApiError(
            400,
            "Branch member number is required"
        );
    }


    /*
    =====================================================
    CHECK LOGIN ID
    =====================================================
    */

    const existing =
        await PackagingStaff.findOne({
            loginId,
        });

    if (existing) {
        throw new ApiError(
            409,
            "This packaging login ID already exists"
        );
    }


    /*
    =====================================================
    CHECK BRANCH MEMBER NUMBER
    =====================================================
    */

    const existingMemberNumber =
        await PackagingStaff.findOne({
            branchMemberNumber,
        });

    if (existingMemberNumber) {
        throw new ApiError(
            409,
            "This branch member number already exists"
        );
    }


    /*
    =====================================================
    CREATE ACCOUNT
    =====================================================
    */

    const staff =
        await PackagingStaff.create({
            name,

            loginId,

            password,

            branchName,

            branchMemberNumber,

            createdBy:
                adminUserId,
        });


    /*
    =====================================================
    RETURN ACCOUNT
    =====================================================
    */

    return {
        id:
            staff._id,

        name:
            staff.name,

        loginId:
            staff.loginId,

        password,

        role:
            "PACKAGING",

        isActive:
            staff.isActive,

        branchId:
            staff.branchId,

        branchName:
            staff.branchName,

        branchMemberNumber:
            staff.branchMemberNumber,

        createdBy:
            staff.createdBy,

        createdAt:
            staff.createdAt,

        lastLoginAt:
            staff.lastLoginAt,
    };
};


/*
=========================================================
PACKAGING LOGIN
=========================================================
*/

const login = async (
    loginId,
    password
) => {

    const cleanLoginId =
        String(
            loginId || ""
        )
            .trim()
            .toUpperCase();


    const staff =
        await PackagingStaff
            .findOne({
                loginId:
                    cleanLoginId,
            })
            .select("+password");


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


    const validPassword =
        await staff.comparePassword(
            password
        );


    if (!validPassword) {
        throw new ApiError(
            401,
            "Invalid packaging login ID or password"
        );
    }


    /*
    =====================================================
    UPDATE LAST LOGIN
    =====================================================
    */

    staff.lastLoginAt =
        new Date();

    await staff.save();


    /*
    =====================================================
    RETURN LOGIN RESPONSE
    =====================================================
    */

    return {
        token:
            signPackagingToken(
                staff
            ),

        user: {

            id:
                staff._id,

            packagingStaffId:
                staff._id,

            name:
                staff.name,

            loginId:
                staff.loginId,

            role:
                "PACKAGING",

            isActive:
                staff.isActive,

            branchId:
                staff.branchId,

            branchName:
                staff.branchName,

            branchMemberNumber:
                staff.branchMemberNumber,

            createdAt:
                staff.createdAt,

            lastLoginAt:
                staff.lastLoginAt,
        },
    };
};


/*
=========================================================
LIST PACKAGING STAFF
=========================================================
*/

const listStaff = async () => {

    return PackagingStaff
        .find()
        .select("-password")
        .populate(
            "createdBy",
            "name email"
        )
        .sort({
            createdAt: -1,
        });
};


/*
=========================================================
UPDATE PACKAGING STAFF
=========================================================
*/

const updateStaff = async (
    staffId,
    data,
    adminUserId
) => {

    /*
    =====================================================
    FIND STAFF
    =====================================================
    */

    const staff =
        await PackagingStaff
            .findById(staffId)
            .select("+password");

    if (!staff) {
        throw new ApiError(
            404,
            "Packaging staff not found"
        );
    }


    /*
    =====================================================
    NORMALIZE DATA
    =====================================================
    */

    const name =
        String(
            data.name ?? staff.name
        ).trim();

    const loginId =
        String(
            data.loginId ?? staff.loginId
        )
            .trim()
            .toUpperCase();

    const branchName =
        String(
            data.branchName ??
            staff.branchName ??
            ""
        ).trim();

    const branchMemberNumber =
        String(
            data.branchMemberNumber ??
            staff.branchMemberNumber ??
            ""
        ).trim();


    /*
    =====================================================
    VALIDATION
    =====================================================
    */

    if (!name) {
        throw new ApiError(
            400,
            "Packaging staff name is required"
        );
    }

    if (!loginId) {
        throw new ApiError(
            400,
            "Packaging login ID is required"
        );
    }

    if (!branchName) {
        throw new ApiError(
            400,
            "Branch name is required"
        );
    }

    if (!branchMemberNumber) {
        throw new ApiError(
            400,
            "Branch member number is required"
        );
    }


    /*
    =====================================================
    CHECK DUPLICATE LOGIN ID
    =====================================================
    */

    const duplicateLogin =
        await PackagingStaff.findOne({
            loginId,

            _id: {
                $ne:
                    staffId,
            },
        });

    if (duplicateLogin) {
        throw new ApiError(
            409,
            "This packaging login ID already exists"
        );
    }


    /*
    =====================================================
    CHECK DUPLICATE BRANCH MEMBER NUMBER
    =====================================================
    */

    const duplicateMemberNumber =
        await PackagingStaff.findOne({
            branchMemberNumber,

            _id: {
                $ne:
                    staffId,
            },
        });

    if (duplicateMemberNumber) {
        throw new ApiError(
            409,
            "This branch member number already exists"
        );
    }


    /*
    =====================================================
    UPDATE BASIC INFORMATION
    =====================================================
    */

    staff.name =
        name;

    staff.loginId =
        loginId;

    staff.branchName =
        branchName;

    staff.branchMemberNumber =
        branchMemberNumber;


    /*
    =====================================================
    UPDATE ACTIVE STATUS
    =====================================================
    */

    if (
        typeof data.isActive ===
        "boolean"
    ) {

        staff.isActive =
            data.isActive;
    }


    /*
    =====================================================
    OPTIONAL PASSWORD UPDATE
    =====================================================
    */

    const newPassword =
        String(
            data.password || ""
        );

    if (newPassword) {

        if (
            newPassword.length <
            8
        ) {
            throw new ApiError(
                400,
                "Password must contain at least 8 characters"
            );
        }

        staff.password =
            newPassword;
    }


    /*
    =====================================================
    SAVE
    =====================================================
    */

    await staff.save();


    /*
    =====================================================
    RETURN UPDATED ACCOUNT
    =====================================================
    */

    return {

        id:
            staff._id,

        name:
            staff.name,

        loginId:
            staff.loginId,

        role:
            "PACKAGING",

        isActive:
            staff.isActive,

        branchId:
            staff.branchId,

        branchName:
            staff.branchName,

        branchMemberNumber:
            staff.branchMemberNumber,

        createdBy:
            staff.createdBy,

        createdAt:
            staff.createdAt,

        lastLoginAt:
            staff.lastLoginAt,

        updatedBy:
            adminUserId,
    };
};


/*
=========================================================
GET OR CREATE ASSIGNMENT
=========================================================
*/

const getOrCreateAssignment =
    async (orderId) => {

        let assignment =
            await PackagingAssignment.findOne({
                order: orderId,
            });


        if (!assignment) {

            assignment =
                await PackagingAssignment.create({
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

const assignOrder = async (
    orderId,
    staffId,
    adminUserId
) => {

    const order =
        await Order.findById(
            orderId
        );


    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }


    const staff =
        await PackagingStaff.findOne({
            _id: staffId,
            isActive: true,
        });


    if (!staff) {
        throw new ApiError(
            404,
            "Active packaging staff not found"
        );
    }


    /*
    =====================================================
    ONLY NORMAL PROCESSING ORDERS
    =====================================================
    */

    if (
        ![
            "PLACED",
            "CONFIRMED",
        ].includes(
            order.status
        )
    ) {

        throw new ApiError(
            400,
            "This order cannot be assigned for packaging"
        );
    }


    const assignment =
        await getOrCreateAssignment(
            orderId
        );


    /*
    =====================================================
    DON'T CHANGE STAFF AFTER PACKING STARTS
    =====================================================
    */

    if (
        [
            "PACKING",
            "PACKED",
            "READY_FOR_DISPATCH",
        ].includes(
            assignment.status
        )
    ) {

        throw new ApiError(
            400,
            "This order is already being processed"
        );
    }


    assignment.staff =
        staff._id;

    assignment.status =
        "ASSIGNED";

    assignment.assignedAt =
        new Date();


    if (
        !Array.isArray(
            assignment.history
        )
    ) {
        assignment.history = [];
    }


    assignment.history.push({

        action:
            "ASSIGNED",

        byAdmin:
            adminUserId,

        byStaff:
            null,

        note:
            `Assigned to packaging staff ${staff.name}`,

        at:
            new Date(),
    });


    await assignment.save();


    await assignment.populate(
        "staff",
        "name loginId"
    );


    return assignment;
};


/*
=========================================================
GET PACKAGING ORDERS
=========================================================

IMPORTANT:
Orders now include their OrderItems.

This is what the Packaging Dashboard needs to
show product names, quantities and prices.
=========================================================
*/

const getOrdersForStaff =
    async (staffId) => {

        const assignments =
            await PackagingAssignment
                .find({
                    staff: staffId,
                })

                .populate({
                    path: "order",

                    populate: {
                        path: "userId",

                        select:
                            "name email mobile",
                    },
                })

                .populate({
                    path: "staff",

                    select:
                        "name loginId",
                })

                .sort({
                    updatedAt: -1,
                });


        /*
        =================================================
        LOAD ORDER ITEMS
        =================================================
        */

        const result =
            await Promise.all(

                assignments.map(
                    async (
                        assignment
                    ) => {

                        const orderId =
                            assignment
                                .order?._id;


                        let items = [];


                        if (orderId) {

                            items =
                                await OrderItem
                                    .find({
                                        orderId,
                                    })

                                    .populate(
                                        "productId",
                                        "name productName images price category brand"
                                    )

                                    .lean();
                        }


                        return {

                            assignmentId:
                                assignment._id,

                            orderId,

                            order:
                                assignment.order,

                            staff:
                                assignment.staff,

                            status:
                                assignment.status,

                            assignedAt:
                                assignment.assignedAt,

                            packingStartedAt:
                                assignment.packingStartedAt,

                            packedAt:
                                assignment.packedAt,

                            readyForDispatchAt:
                                assignment.readyForDispatchAt,

                            notes:
                                assignment.notes,

                            history:
                                assignment.history,

                            createdAt:
                                assignment.createdAt,

                            updatedAt:
                                assignment.updatedAt,

                            items,
                        };
                    }
                )
            );


        return result;
    };


/*
=========================================================
GET ORDER DETAILS
=========================================================

This returns the complete order details and
ensures staff can only open their own orders.
=========================================================
*/

const getOrderDetails = async (
    orderId,
    staffId
) => {

    /*
    =====================================================
    GET ORDER
    =====================================================
    */

    const order =
        await Order.findById(
            orderId
        )
            .populate(
                "userId",
                "name email mobile"
            );


    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }


    /*
    =====================================================
    GET PACKAGING ASSIGNMENT
    =====================================================
    */

    const assignment =
        await PackagingAssignment
            .findOne({
                order: orderId,
            })

            .populate(
                "staff",
                "name loginId"
            );


    if (!assignment) {
        throw new ApiError(
            404,
            "Packaging assignment not found"
        );
    }


    /*
    =====================================================
    SECURITY
    =====================================================
    */

    if (
        String(
            assignment.staff?._id
        ) !== String(
            staffId
        )
    ) {

        throw new ApiError(
            403,
            "This order is not assigned to your account"
        );
    }


    /*
    =====================================================
    GET ORDER ITEMS
    =====================================================
    */

    const items =
        await OrderItem
            .find({
                orderId:
                    order._id,
            })

            .populate(
                "productId",
                "name productName images price category brand"
            )

            .lean();


    /*
    =====================================================
    DEBUG
    =====================================================
    */

    console.log(
        "======================================"
    );

    console.log(
        "PACKAGING ORDER DETAILS"
    );

    console.log(
        "Order ID:",
        order._id.toString()
    );

    console.log(
        "Order Number:",
        order.orderNumber
    );

    console.log(
        "ORDER ITEMS:",
        items
    );

    console.log(
        "ITEM COUNT:",
        items.length
    );

    console.log(
        "DELIVERY DETAILS:",
        order.deliveryDetails
    );

    console.log(
        "======================================"
    );


    /*
    =====================================================
    RETURN COMPLETE ORDER
    =====================================================
    */

    return {

        order,

        items,

        assignment,
    };
};


/*
=========================================================
UPDATE PACKAGING STATUS
=========================================================
*/

const updatePackagingStatus =
    async (
        orderId,
        status,
        staffId
    ) => {

        /*
        =================================================
        GET ASSIGNMENT
        =================================================
        */

        const assignment =
            await PackagingAssignment
                .findOne({
                    order: orderId,
                });


        if (!assignment) {
            throw new ApiError(
                404,
                "Packaging assignment not found"
            );
        }


        /*
        =================================================
        STAFF CAN ONLY UPDATE THEIR OWN ORDER
        =================================================
        */

        if (
            String(
                assignment.staff
            ) !== String(
                staffId
            )
        ) {

            throw new ApiError(
                403,
                "This order is not assigned to your account"
            );
        }


        /*
        =================================================
        GET ORDER
        =================================================
        */

        const order =
            await Order.findById(
                orderId
            );


        if (!order) {
            throw new ApiError(
                404,
                "Order not found"
            );
        }


        /*
        =================================================
        NORMALIZE STATUS
        =================================================
        */

        const cleanStatus =
            String(
                status || ""
            )
                .trim()
                .toUpperCase();


        /*
        =================================================
        VALID STATUS TRANSITIONS
        =================================================
        */

        const transitions = {

            ASSIGNED: [
                "PACKING",
            ],

            PACKING: [
                "PACKED",
            ],

            PACKED: [
                "READY_FOR_DISPATCH",
            ],
        };


        const allowed =
            transitions[
                assignment.status
            ];


        if (
            !allowed ||
            !allowed.includes(
                cleanStatus
            )
        ) {

            throw new ApiError(
                400,
                `Invalid status transition from ${assignment.status} to ${cleanStatus}`
            );
        }


        const now =
            new Date();


        /*
        =================================================
        UPDATE ASSIGNMENT STATUS
        =================================================
        */

        assignment.status =
            cleanStatus;


        /*
        =================================================
        PACKING STARTED
        =================================================
        */

        if (
            cleanStatus ===
            "PACKING"
        ) {

            assignment.packingStartedAt =
                now;

            order.status =
                "PACKING";

            if (
                "packingAt" in
                order
            ) {
                order.packingAt =
                    now;
            }
        }


        /*
        =================================================
        PACKED
        =================================================
        */

        if (
            cleanStatus ===
            "PACKED"
        ) {

            assignment.packedAt =
                now;

            order.status =
                "PACKED";

            if (
                "packedAt" in
                order
            ) {
                order.packedAt =
                    now;
            }
        }


        /*
        =================================================
        READY FOR DISPATCH
        =================================================
        */

        if (
            cleanStatus ===
            "READY_FOR_DISPATCH"
        ) {

            assignment.readyForDispatchAt =
                now;

            order.status =
                "READY_FOR_DISPATCH";

            if (
                "readyForDispatchAt" in
                order
            ) {
                order.readyForDispatchAt =
                    now;
            }
        }


        /*
        =================================================
        HISTORY
        =================================================
        */

        if (
            !Array.isArray(
                assignment.history
            )
        ) {
            assignment.history = [];
        }


        assignment.history.push({

            action:
                cleanStatus,

            byStaff:
                staffId,

            byAdmin:
                null,

            note:
                `Packaging status changed to ${cleanStatus}`,

            at:
                now,
        });


        /*
        =================================================
        SAVE BOTH
        =================================================
        */

        await assignment.save();

        await order.save();


        /*
        =================================================
        RETURN UPDATED DATA
        =================================================
        */

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

const getDashboard =
    async (staffId) => {

        const assignments =
            await PackagingAssignment.find({
                staff: staffId,
            });


        const count =
            (status) =>
                assignments.filter(
                    (item) =>
                        item.status ===
                        status
                ).length;


        return {

            totalOrders:
                assignments.length,

            totalAssigned:
                assignments.length,

            assignedOrders:
                count(
                    "ASSIGNED"
                ),

            assigned:
                count(
                    "ASSIGNED"
                ),

            packingOrders:
                count(
                    "PACKING"
                ),

            packing:
                count(
                    "PACKING"
                ),

            packedOrders:
                count(
                    "PACKED"
                ),

            packed:
                count(
                    "PACKED"
                ),

            readyForDispatchOrders:
                count(
                    "READY_FOR_DISPATCH"
                ),

            readyForDispatch:
                count(
                    "READY_FOR_DISPATCH"
                ),
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
};