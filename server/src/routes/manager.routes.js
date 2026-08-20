const express = require("express");

const router = express.Router();

const managerController =
    require("../controllers/manager.controller");

const {
    protect,
    authorize,
} = require("../middleware/auth.middleware");


/*
=========================================================
MANAGER AUTHENTICATION
=========================================================
*/

router.use(protect);


/*
=========================================================
MANAGER ROLE ONLY
=========================================================
*/

router.use(
    authorize("MANAGER")
);


/*
=========================================================
DASHBOARD
=========================================================
*/

router.get(
    "/dashboard",
    managerController.getDashboard
);


/*
=========================================================
MEMBERS
=========================================================
*/

router.get(
    "/members",
    managerController.getMembers
);

router.get(
    "/members/:id/details",
    managerController.getMemberDetails
);

router.get(
    "/members/:id",
    managerController.getMemberById
);


/*
=========================================================
MANAGER JOINING COMMISSION
=========================================================

This is the commission earned by the manager when
members joined the manager's referral chain.

GET:

/api/v1/manager/commission

Returns ONLY:

memberId
name
commissionPercent
commissionAmount
=========================================================
*/

router.get(
    "/commission",
    managerController.getCommissionPage
);


/*
=========================================================
PRODUCTS
=========================================================
*/

router.get(
    "/products",
    managerController.getManagerProducts
);


/*
=========================================================
REFERRAL TREE
=========================================================
*/

router.get(
    "/referral-tree",
    managerController.getReferralTree
);


/*
=========================================================
PROFILE
=========================================================
*/

router.get(
    "/profile",
    managerController.getProfile
);


module.exports = router;