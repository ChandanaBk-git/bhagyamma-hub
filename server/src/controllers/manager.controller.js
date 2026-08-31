const managerService =
    require("../services/manager.service");

const sellingPointService =
    require("../services/sellingPoint.service");

const ApiError =
    require("../utils/ApiError");


/*
=========================================================
GET MANAGER ID
=========================================================
*/

const getManagerId = (req) => {

    const managerId =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId;

    if (!managerId) {

        throw new ApiError(
            401,
            "Manager ID not found in authentication token."
        );

    }

    return String(managerId);

};


/*
=========================================================
DASHBOARD
=========================================================
*/

const getDashboard = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        const data =
            await managerService.getDashboard(
                managerId
            );

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {

        console.error(
            "MANAGER DASHBOARD ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
MEMBERS
=========================================================
*/

const getMembers = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        const members =
            await managerService.getMembers(
                managerId
            );

        return res.status(200).json({
            success: true,
            data: members,
        });

    } catch (error) {

        console.error(
            "MANAGER MEMBERS ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
BASIC MEMBER
=========================================================
*/

const getMemberById = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        const memberId =
            req.params.id;

        if (!memberId) {

            throw new ApiError(
                400,
                "Member ID is required."
            );

        }

        const member =
            await managerService.getMemberById(
                managerId,
                memberId
            );

        if (!member) {

            throw new ApiError(
                404,
                "Member not found."
            );

        }

        return res.status(200).json({
            success: true,
            data: member,
        });

    } catch (error) {

        console.error(
            "MANAGER MEMBER ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
COMPLETE MEMBER DETAILS
=========================================================
*/

const getMemberDetails = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        const memberId =
            req.params.id;

        if (!memberId) {

            throw new ApiError(
                400,
                "Member ID is required."
            );

        }

        const data =
            await managerService.getMemberDetails(
                managerId,
                memberId
            );

        if (!data) {

            throw new ApiError(
                404,
                "Member not found."
            );

        }

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {

        console.error(
            "MANAGER MEMBER DETAILS ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
MANAGER JOINING COMMISSION
=========================================================
*/

const getCommissionPage = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        console.log(
            "=========================================="
        );

        console.log(
            "MANAGER JOINING COMMISSION"
        );

        console.log(
            "MANAGER ID:",
            managerId
        );

        const data =
            await managerService.getCommissionPage(
                managerId
            );

        console.log(
            "JOINING COMMISSION DATA:",
            data
        );

        console.log(
            "=========================================="
        );

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {

        console.error(
            "MANAGER JOINING COMMISSION ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
REFERRAL TREE
=========================================================
*/

const getReferralTree = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        const data =
            await managerService.getReferralTree(
                managerId
            );

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {

        console.error(
            "MANAGER REFERRAL TREE ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
PROFILE
=========================================================
*/

const getProfile = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        const data =
            await managerService.getProfile(
                managerId
            );

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {

        console.error(
            "MANAGER PROFILE ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
PRODUCTS
=========================================================
*/

const getManagerProducts = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        const products =
            await managerService.getManagerProducts(
                managerId
            );

        return res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error) {

        console.error(
            "MANAGER PRODUCTS ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
MANAGER SELLING POINTS
=========================================================

Returns the manager's OWN:

- Current Selling Points
- Lifetime Purchase
- Pending Carry Forward
- Membership Status
- Membership Activation
- Supervisor Status
- Target
- Remaining SP
- Progress
- Complete Selling Point History

IMPORTANT:
This reads transactions belonging to req.user.
It does NOT read member transactions.
=========================================================
*/

const getSellingPoints = async (
    req,
    res,
    next
) => {

    try {

        const managerId =
            getManagerId(req);

        console.log(
            "=========================================="
        );

        console.log(
            "MANAGER SELLING POINTS"
        );

        console.log(
            "MANAGER ID:",
            managerId
        );

        const data =
            await sellingPointService.getPoints(
                managerId
            );

        console.log(
            "MANAGER SELLING POINTS DATA:",
            data
        );

        console.log(
            "=========================================="
        );

        return res.status(200).json({

            success: true,

            data,

        });

    } catch (error) {

        console.error(
            "MANAGER SELLING POINTS ERROR:",
            error
        );

        next(error);

    }

};


/*
=========================================================
EXPORT
=========================================================
*/

module.exports = {

    getDashboard,

    getMembers,

    getMemberById,

    getMemberDetails,

    getCommissionPage,

    getReferralTree,

    getProfile,

    getManagerProducts,

    getSellingPoints,

};