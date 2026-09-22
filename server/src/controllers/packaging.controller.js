const asyncHandler =
    require("../utils/asyncHandler");

const ApiResponse =
    require("../utils/ApiResponse");

const ApiError =
    require("../utils/ApiError");

const packagingService =
    require("../services/packaging.service");

/*
=========================================================
PACKAGING LOGIN
=========================================================
*/

const login = asyncHandler(
    async (req, res) => {

        const result =
            await packagingService.login(
                req.body.loginId,
                req.body.password
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Packaging login successful",
                result
            )
        );
    }
);

/*
=========================================================
ADMIN CREATE PACKAGING ACCOUNT
=========================================================
*/

const createStaff =
    asyncHandler(
        async (req, res) => {

            if (!req.user?.id) {
                throw new ApiError(
                    401,
                    "Authentication required"
                );
            }

            const result =
                await packagingService.createStaff(
                    req.body,
                    req.user.id
                );

            return res.status(201).json(
                new ApiResponse(
                    201,
                    "Packaging account created successfully",
                    result
                )
            );
        }
    );

/*
=========================================================
ADMIN LIST PACKAGING STAFF
=========================================================
*/

const listStaff =
    asyncHandler(
        async (req, res) => {

            const staff =
                await packagingService.listStaff();

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Packaging staff fetched",
                    staff
                )
            );
        }
    );

/*
=========================================================
ADMIN UPDATE PACKAGING ACCOUNT
=========================================================
*/

const updateStaff =
    asyncHandler(
        async (req, res) => {

            if (!req.user?.id) {
                throw new ApiError(
                    401,
                    "Authentication required"
                );
            }

            if (!req.params.id) {
                throw new ApiError(
                    400,
                    "Packaging staff ID is required"
                );
            }

            const result =
                await packagingService.updateStaff(
                    req.params.id,
                    req.body,
                    req.user.id
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Packaging account updated successfully",
                    result
                )
            );
        }
    );

/*
=========================================================
PACKAGING DASHBOARD
=========================================================
*/

const dashboard =
    asyncHandler(
        async (req, res) => {

            if (!req.user?.id) {
                throw new ApiError(
                    401,
                    "Packaging authentication required"
                );
            }

            const data =
                await packagingService.getDashboard(
                    req.user.id
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Packaging dashboard fetched",
                    data
                )
            );
        }
    );

/*
=========================================================
PACKAGING ORDERS
=========================================================
*/

const orders =
    asyncHandler(
        async (req, res) => {

            if (!req.user?.id) {
                throw new ApiError(
                    401,
                    "Packaging authentication required"
                );
            }

            const data =
                await packagingService.getOrdersForStaff(
                    req.user.id
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Packaging orders fetched",
                    data
                )
            );
        }
    );

/*
=========================================================
PACKAGING ORDER DETAILS
=========================================================
*/

const orderDetails =
    asyncHandler(
        async (req, res) => {

            if (!req.user?.id) {
                throw new ApiError(
                    401,
                    "Packaging authentication required"
                );
            }

            if (!req.params.id) {
                throw new ApiError(
                    400,
                    "Order ID is required"
                );
            }

            const data =
                await packagingService.getOrderDetails(
                    req.params.id,
                    req.user.id
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Order details fetched",
                    data
                )
            );
        }
    );

/*
=========================================================
PACKAGING STATUS UPDATE
=========================================================
*/

const updateStatus =
    asyncHandler(
        async (req, res) => {

            if (!req.user?.id) {
                throw new ApiError(
                    401,
                    "Packaging authentication required"
                );
            }

            if (!req.params.id) {
                throw new ApiError(
                    400,
                    "Order ID is required"
                );
            }

            const status =
                String(
                    req.body.status || ""
                )
                    .trim()
                    .toUpperCase();

            if (!status) {
                throw new ApiError(
                    400,
                    "Packaging status is required"
                );
            }

            const result =
                await packagingService.updatePackagingStatus(
                    req.params.id,
                    status,
                    req.user.id
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Packaging status updated",
                    result
                )
            );
        }
    );

/*
=========================================================
ADMIN ASSIGN ORDER
=========================================================
*/

const assignOrder =
    asyncHandler(
        async (req, res) => {

            if (!req.user?.id) {
                throw new ApiError(
                    401,
                    "Authentication required"
                );
            }

            if (!req.params.id) {
                throw new ApiError(
                    400,
                    "Order ID is required"
                );
            }

            if (!req.body.staffId) {
                throw new ApiError(
                    400,
                    "Packaging staff ID is required"
                );
            }

            const assignment =
                await packagingService.assignOrder(
                    req.params.id,
                    req.body.staffId,
                    req.user.id
                );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    "Order assigned to packaging staff",
                    assignment
                )
            );
        }
    );

/*
=========================================================
EXPORTS
=========================================================
*/

module.exports = {
    login,
    createStaff,
    listStaff,
    updateStaff,
    dashboard,
    orders,
    orderDetails,
    updateStatus,
    assignOrder,
};