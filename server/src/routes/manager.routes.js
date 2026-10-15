
const express = require("express");

const router = express.Router();

const managerController =
  require("../controllers/manager.controller");

const managerFinanceController =
  require("../controllers/managerFinance.controller");

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

router.use(authorize("MANAGER"));

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
ORDERS
=========================================================
*/

router.get(
  "/orders",
  managerController.getManagerOrders
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

/*
=========================================================
PACKAGING TEAMS
=========================================================
*/

router.get(
  "/packaging-teams",
  managerController.getManagerPackagingTeams
);

/*
=========================================================
MANAGER FINANCIAL DASHBOARD
=========================================================
*/

// Financial summary
router.get(
  "/finance/summary",
  managerFinanceController.getFinanceSummary
);

// Profit & Loss ledger
router.get(
  "/finance/ledger",
  managerFinanceController.getFinanceLedger
);

// Record business expense
router.post(
  "/finance/expenses",
  managerFinanceController.createExpense
);

// View expense history
router.get(
  "/finance/expenses",
  managerFinanceController.getExpenses
);

router.get(
  "/finance/membership-payments",
  managerFinanceController.getMembershipPayments
);

router.post(
  "/finance/membership-payments/:id/verify",
  managerFinanceController.verifyMembershipPayment
);



router.post(
  "/finance/membership-payments/:id/reject",
  managerFinanceController.rejectMembershipPayment
);

// Edit an existing business expense
router.put(
  "/finance/expenses/:id",
  managerFinanceController.updateExpense
);

// Soft-delete an expense with a mandatory reason
router.delete(
  "/finance/expenses/:id",
  managerFinanceController.deleteExpense
);

module.exports = router;
