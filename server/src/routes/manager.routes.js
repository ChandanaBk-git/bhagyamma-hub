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
SELLING POINTS
=========================================================
*/

router.get(
    "/selling-points",
    managerController.getSellingPoints
);


/*
=========================================================
COMMISSION
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
WALLET
=========================================================
*/

// Manager's own wallet

router.get(
  "/wallet",
  managerController.getManagerWallet
);


// All user wallets

router.get(
  "/wallet/users",
  managerController.getAllUserWallets
);


// Complete wallet of selected user

router.get(
  "/wallet/users/:id",
  managerController.getUserWalletDetails
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