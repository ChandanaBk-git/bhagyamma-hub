const mongoose = require("mongoose");

const Order = require("../models/order.model");
const User = require("../models/user.model");
const FinanceExpense = require("../models/financeExpense.model");
const Withdraw = require("../models/withdraw.model");
const MembershipPaymentRecord = require(
  "../models/membershipPaymentRecord.model"
);

const MEMBERSHIP_AMOUNT = 2000;
const FinanceAuditLog = require("../models/financeAuditLog.model");

const ALLOWED_CATEGORIES = [
  "Packaging",
  "Shipping",
  "Inventory",
  "Marketing",
  "Rent",
  "Salaries",
  "Software",
  "Utilities",
  "Travel",
  "Maintenance",
  "Other",
];

const ALLOWED_PAYMENT_METHODS = [
  "Cash",
  "Bank",
  "UPI",
  "Card",
  "Other",
];

const getActorId = (req) => req.user?._id || req.user?.id;

const getDateRange = (query) => {
  if (!query.from && !query.to) return null;

  const from = query.from
    ? new Date(`${query.from}T00:00:00.000Z`)
    : new Date("2000-01-01T00:00:00.000Z");

  const to = query.to
    ? new Date(`${query.to}T23:59:59.999Z`)
    : new Date("2100-12-31T23:59:59.999Z");

  if (
    Number.isNaN(from.getTime()) ||
    Number.isNaN(to.getTime()) ||
    from > to
  ) {
    return { invalid: true };
  }

  return { $gte: from, $lte: to };
};

const getDateFilter = (query, field) => {
  const range = getDateRange(query);

  if (range?.invalid) return { invalid: true };

  return range ? { [field]: range } : {};
};

const getPagination = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const getOrderIncome = (order) => ({
  date: order.paidAt || order.updatedAt,
  reference: order.orderNumber || String(order._id),
  source: "PRODUCT_SALE",
  particulars: `Product sale - ${order.orderNumber || order._id}`,
  income: Number(order.finalAmount || 0),
  expense: 0,
  withdrawal: 0,
  paymentMethod: order.paymentMethod || "",
  status: order.paymentStatus,
});

const getMembershipIncomeMatch = (dateFilter = {}) => ({
  status: "VERIFIED",
  amount: MEMBERSHIP_AMOUNT,
  paymentReference: { $nin: ["", null] },
  ...dateFilter,
});

// --------------------------------------------------
// FINANCIAL SUMMARY
// GET /api/v1/manager/finance/summary
// --------------------------------------------------

exports.getFinanceSummary = async (req, res, next) => {
  try {
    const orderDateFilter = getDateFilter(req.query, "paidAt");
    const expenseDateFilter = getDateFilter(req.query, "expenseDate");
    const membershipDateFilter = getDateFilter(req.query, "paymentDate");
    const withdrawalDateFilter = getDateFilter(req.query, "approvedAt");

    if (
      orderDateFilter.invalid ||
      expenseDateFilter.invalid ||
      membershipDateFilter.invalid ||
      withdrawalDateFilter.invalid
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range. Check the from and to dates.",
      });
    }

    const [
      incomeResult,
      expenseResult,
      membershipResult,
      pendingCount,
      withdrawalResult,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            paymentStatus: "PAID",
            ...orderDateFilter,
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$finalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
      ]),

      FinanceExpense.aggregate([
        {
          $match: {
            status: "RECORDED",
            ...expenseDateFilter,
          },
        },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: "$amount" },
            totalExpenseEntries: { $sum: 1 },
          },
        },
      ]),

      MembershipPaymentRecord.aggregate([
        { $match: getMembershipIncomeMatch(membershipDateFilter) },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: "$amount" },
            totalMembershipPayments: { $sum: 1 },
          },
        },
      ]),

      MembershipPaymentRecord.countDocuments({
        status: "PENDING_VERIFICATION",
      }),

      Withdraw.aggregate([
        {
          $match: {
            status: "APPROVED",
            ...withdrawalDateFilter,
          },
        },
        {
          $group: {
            _id: null,
            totalWithdrawals: { $sum: "$amount" },
            totalWithdrawalEntries: { $sum: 1 },
          },
        },
      ]),
    ]);

    const income = incomeResult[0] || {
      totalIncome: 0,
      totalOrders: 0,
    };

    const expenses = expenseResult[0] || {
      totalExpenses: 0,
      totalExpenseEntries: 0,
    };

    const memberships = membershipResult[0] || {
      totalIncome: 0,
      totalMembershipPayments: 0,
    };

    const withdrawals = withdrawalResult[0] || {
      totalWithdrawals: 0,
      totalWithdrawalEntries: 0,
    };

    const totalProductIncome = Number(income.totalIncome || 0);
    const totalMembershipIncome = Number(memberships.totalIncome || 0);
    const totalBusinessExpenses = Number(expenses.totalExpenses || 0);
    const totalWithdrawals = Number(withdrawals.totalWithdrawals || 0);

    const totalWebsiteIncome =
      totalProductIncome + totalMembershipIncome;

    return res.status(200).json({
      success: true,
      data: {
        totalWebsiteIncome,
        totalProductIncome,
        totalProductOrders: income.totalOrders,
        totalMembershipIncome,
        totalMembershipPayments: memberships.totalMembershipPayments,
        pendingMembershipVerifications: pendingCount,
        totalExpenses: totalBusinessExpenses + totalWithdrawals,
        totalBusinessExpenses,
        totalExpenseEntries: expenses.totalExpenseEntries,
        totalWithdrawals,
        totalWithdrawalEntries: withdrawals.totalWithdrawalEntries,
        netProfitBeforeWithdrawals:
          totalWebsiteIncome - totalBusinessExpenses,
        netResult:
          totalWebsiteIncome -
          totalBusinessExpenses -
          totalWithdrawals,
        incomeSourcesIncluded: [
          "PRODUCT_SALE",
          "VERIFIED_MEMBERSHIP_PAYMENT",
        ],
        deductionsIncluded: [
          "BUSINESS_EXPENSE",
          "APPROVED_WITHDRAWAL",
        ],
        note:
          "Only paid product orders and verified membership payment records are included as income. Withdrawals are shown separately from operating expenses. Refunds or reversals not represented in source records are excluded.",
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// CREATE BUSINESS EXPENSE
// POST /api/v1/manager/finance/expenses
// --------------------------------------------------

exports.createExpense = async (req, res, next) => {
  try {
    const {
      amount,
      category,
      expenseDate,
      paymentMethod,
      description,
      receiptReference,
    } = req.body;

    const actorId = getActorId(req);

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Unable to identify the logged-in manager.",
      });
    }

    const parsedAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid expense amount greater than zero.",
      });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid expense category.",
      });
    }

    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid payment method.",
      });
    }

    const date = expenseDate
      ? new Date(expenseDate)
      : new Date();

    if (
      Number.isNaN(date.getTime()) ||
      date > new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid expense date that is not in the future.",
      });
    }

    const expense = await FinanceExpense.create({
      amount: Math.round(parsedAmount * 100) / 100,
      category,
      expenseDate: date,
      paymentMethod,
      description: String(description || "").trim(),
      receiptReference: String(receiptReference || "").trim(),
      recordedBy: actorId,
      status: "RECORDED",
    });

    await writeExpenseAudit({
      expense,
      action: "CREATED",
      performedBy: actorId,
      before: null,
      after: getExpenseSnapshot(expense),
      reason: "Expense created",
      req,
    });

    return res.status(201).json({
      success: true,
      message: "Expense recorded successfully.",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// UPDATE BUSINESS EXPENSE
// PUT /api/v1/manager/finance/expenses/:id
// --------------------------------------------------

exports.updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actorId = getActorId(req);
    const reason = String(req.body.reason || "").trim();

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID.",
      });
    }

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Unable to identify the logged-in manager.",
      });
    }

    if (!reason || reason.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Enter an edit reason of 1–1000 characters.",
      });
    }

    const expense = await FinanceExpense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    if (expense.status !== "RECORDED") {
      return res.status(409).json({
        success: false,
        message: "Only recorded expenses can be edited.",
      });
    }

    const before = getExpenseSnapshot(expense);

    const {
      amount,
      category,
      expenseDate,
      paymentMethod,
      description,
      receiptReference,
    } = req.body;

    const parsedAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid expense amount greater than zero.",
      });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid expense category.",
      });
    }

    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid payment method.",
      });
    }

    const date = new Date(expenseDate);

    if (
      !expenseDate ||
      Number.isNaN(date.getTime()) ||
      date > new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid expense date that is not in the future.",
      });
    }

    expense.amount = Math.round(parsedAmount * 100) / 100;
    expense.category = category;
    expense.expenseDate = date;
    expense.paymentMethod = paymentMethod;
    expense.description = String(description || "").trim();
    expense.receiptReference = String(receiptReference || "").trim();

    await expense.save();

    await writeExpenseAudit({
      expense,
      action: "EDITED",
      performedBy: actorId,
      before,
      after: getExpenseSnapshot(expense),
      reason,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};
// --------------------------------------------------
// GET EXPENSE HISTORY
// GET /api/v1/manager/finance/expenses
// --------------------------------------------------

exports.getExpenses = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const dateFilter = getDateFilter(req.query, "expenseDate");

    if (dateFilter.invalid) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range. Check the from and to dates.",
      });
    }

    const filter = { ...dateFilter };

    if (req.query.status) {
      if (!["RECORDED", "VOID"].includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense status.",
        });
      }

      filter.status = req.query.status;
    } else {
      filter.status = "RECORDED";
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [expenses, total] = await Promise.all([
      FinanceExpense.find(filter)
        .sort({ expenseDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("recordedBy", "name email")
        .lean(),

      FinanceExpense.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// LIST MEMBERSHIP PAYMENTS FOR REVIEW
// GET /api/v1/manager/finance/membership-payments
// --------------------------------------------------

exports.getMembershipPayments = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = {};

    if (req.query.status) {
      const allowedStatuses = [
        "PENDING_VERIFICATION",
        "VERIFIED",
        "REJECTED",
      ];

      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid membership payment status.",
        });
      }

      filter.status = req.query.status;
    }

    const [records, total] = await Promise.all([
      MembershipPaymentRecord.find(filter)
        .populate(
          "user",
          "userId name mobile email paymentStatus membershipActivationMethod"
        )
        .populate("recordedBy", "name email")
        .populate("verifiedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      MembershipPaymentRecord.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      note:
        "Membership payments are included as income only after explicit verification.",
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// VERIFY MEMBERSHIP PAYMENT
// POST /api/v1/manager/finance/membership-payments/:id/verify
// --------------------------------------------------

exports.verifyMembershipPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership payment record ID.",
      });
    }

    const {
      paymentMethod,
      paymentReference,
      paymentDate,
      evidenceDescription,
      verificationNotes,
    } = req.body;

    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid payment method.",
      });
    }

    const reference = String(paymentReference || "").trim();

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference or receipt number is required.",
      });
    }

    const actualPaymentDate = new Date(paymentDate);

    if (
      !paymentDate ||
      Number.isNaN(actualPaymentDate.getTime()) ||
      actualPaymentDate > new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid payment date that is not in the future.",
      });
    }

    const evidence = String(evidenceDescription || "").trim();

    if (!evidence) {
      return res.status(400).json({
        success: false,
        message: "Describe the payment evidence reviewed.",
      });
    }

    const record = await MembershipPaymentRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Membership payment record not found.",
      });
    }

    if (record.status === "VERIFIED") {
      return res.status(409).json({
        success: false,
        message: "This membership payment is already verified.",
      });
    }

    if (record.status === "REJECTED") {
      return res.status(409).json({
        success: false,
        message:
          "This payment was rejected. Review it through a separate audited process.",
      });
    }

    const duplicate = await MembershipPaymentRecord.findOne({
      _id: { $ne: record._id },
      paymentReference: reference,
      status: "VERIFIED",
    }).lean();

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "This payment reference is already used by another verified payment.",
      });
    }

    record.amount = MEMBERSHIP_AMOUNT;
    record.paymentMethod = paymentMethod;
    record.paymentReference = reference;
    record.paymentDate = actualPaymentDate;
    record.evidenceDescription = evidence;
    record.verificationNotes = String(verificationNotes || "").trim();
    record.status = "VERIFIED";
    record.verifiedBy = getActorId(req);
    record.verifiedAt = new Date();

    await record.save();

    return res.status(200).json({
      success: true,
      message:
        "Membership payment verified and eligible for Finance reporting.",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// REJECT MEMBERSHIP PAYMENT
// POST /api/v1/manager/finance/membership-payments/:id/reject
// --------------------------------------------------

exports.rejectMembershipPayment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership payment record ID.",
      });
    }

    const record = await MembershipPaymentRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Membership payment record not found.",
      });
    }

    if (record.status === "VERIFIED") {
      return res.status(409).json({
        success: false,
        message:
          "A verified payment cannot be rejected through this endpoint.",
      });
    }

    record.status = "REJECTED";
    record.verifiedBy = getActorId(req);
    record.verifiedAt = new Date();
    record.verificationNotes = String(
      req.body.verificationNotes || ""
    ).trim();

    await record.save();

    return res.status(200).json({
      success: true,
      message: "Membership payment rejected and excluded from income.",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PROFIT & LOSS LEDGER
// GET /api/v1/manager/finance/ledger
// --------------------------------------------------

exports.getFinanceLedger = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const orderDateFilter = getDateFilter(req.query, "paidAt");
    const expenseDateFilter = getDateFilter(req.query, "expenseDate");
    const membershipDateFilter = getDateFilter(req.query, "paymentDate");
    const withdrawalDateFilter = getDateFilter(req.query, "approvedAt");

    if (
      orderDateFilter.invalid ||
      expenseDateFilter.invalid ||
      membershipDateFilter.invalid ||
      withdrawalDateFilter.invalid
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range. Check the from and to dates.",
      });
    }

    const orderFilter = {
      paymentStatus: "PAID",
      ...orderDateFilter,
    };

    const expenseFilter = {
      status: "RECORDED",
      ...expenseDateFilter,
    };

    const membershipFilter =
      getMembershipIncomeMatch(membershipDateFilter);

    const withdrawalFilter = {
      status: "APPROVED",
      ...withdrawalDateFilter,
    };

    const [
      orders,
      expenses,
      membershipPayments,
      withdrawals,
      orderCount,
      expenseCount,
      membershipCount,
      withdrawalCount,
    ] = await Promise.all([
      Order.find(orderFilter)
        .select(
          "orderNumber finalAmount paymentMethod paymentStatus paidAt updatedAt"
        )
        .sort({ paidAt: -1, updatedAt: -1 })
        .lean(),

      FinanceExpense.find(expenseFilter)
        .select(
          "expenseNumber amount category expenseDate paymentMethod description receiptReference status createdAt"
        )
        .sort({ expenseDate: -1, createdAt: -1 })
        .lean(),

      MembershipPaymentRecord.find(membershipFilter)
        .populate("user", "userId name")
        .select(
          "user amount paymentMethod paymentReference paymentDate status"
        )
        .sort({ paymentDate: -1 })
        .lean(),

      Withdraw.find(withdrawalFilter)
        .populate("user", "userId name mobile")
        .populate("approvedBy", "name userId")
        .select(
          "user amount status approvedAt approvedBy bankName accountHolderName remarks updatedAt createdAt"
        )
        .sort({ approvedAt: -1, updatedAt: -1 })
        .lean(),

      Order.countDocuments(orderFilter),
      FinanceExpense.countDocuments(expenseFilter),
      MembershipPaymentRecord.countDocuments(membershipFilter),
      Withdraw.countDocuments(withdrawalFilter),
    ]);

    const ledger = [
      ...orders.map(getOrderIncome),

      ...membershipPayments.map((record) => ({
        date: record.paymentDate,
        reference: record.paymentReference,
        source: "MEMBERSHIP_PAYMENT",
        particulars: `Membership fee - ${
          record.user?.userId || record.user?.name || "Member"
        }`,
        income: Number(record.amount || 0),
        expense: 0,
        withdrawal: 0,
        paymentMethod: record.paymentMethod || "",
        status: record.status,
      })),

      ...expenses.map((expense) => ({
        date: expense.expenseDate,
        reference:
          expense.expenseNumber ||
          `EXP-${String(expense._id).slice(-8).toUpperCase()}`,
        source: "BUSINESS_EXPENSE",
        particulars: expense.description || expense.category,
        category: expense.category,
        income: 0,
        expense: Number(expense.amount || 0),
        withdrawal: 0,
        paymentMethod: expense.paymentMethod || "",
        status: expense.status,
      })),

      ...withdrawals.map((withdraw) => ({
        date: withdraw.approvedAt || withdraw.updatedAt,
        reference: `WITHDRAW-${String(withdraw._id)
          .slice(-8)
          .toUpperCase()}`,
        source: "APPROVED_WITHDRAWAL",
        particulars: `Wallet withdrawal - ${
          withdraw.user?.userId || withdraw.user?.name || "Member"
        }`,
        category: "Member withdrawal",
        income: 0,
        expense: Number(withdraw.amount || 0),
        withdrawal: Number(withdraw.amount || 0),
        paymentMethod: "Bank transfer",
        status: withdraw.status,
        approvedBy: withdraw.approvedBy || null,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    let runningIncome = 0;
    let runningExpenses = 0;

    const chronological = [...ledger].reverse().map((entry) => {
      runningIncome += Number(entry.income || 0);
      runningExpenses += Number(entry.expense || 0);

      return {
        ...entry,
        runningIncome,
        runningExpenses,
        runningNet: runningIncome - runningExpenses,
      };
    });

    const ledgerWithBalances = chronological.reverse();

    const totalIncome = ledger.reduce(
      (sum, entry) => sum + Number(entry.income || 0),
      0
    );

    const totalBusinessExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );

    const totalWithdrawals = withdrawals.reduce(
      (sum, withdraw) => sum + Number(withdraw.amount || 0),
      0
    );

    const totalExpenses = totalBusinessExpenses + totalWithdrawals;

    return res.status(200).json({
      success: true,
      data: ledgerWithBalances.slice(skip, skip + limit),
      totals: {
        totalIncome,
        totalProductIncome: orders.reduce(
          (sum, order) => sum + Number(order.finalAmount || 0),
          0
        ),
        totalMembershipIncome: membershipPayments.reduce(
          (sum, record) => sum + Number(record.amount || 0),
          0
        ),
        totalBusinessExpenses,
        totalWithdrawals,
        totalExpenses,
        netProfitBeforeWithdrawals: totalIncome - totalBusinessExpenses,
        netResult: totalIncome - totalExpenses,
      },
      pagination: {
        page,
        limit,
        total:
          orderCount +
          expenseCount +
          membershipCount +
          withdrawalCount,
        totalPages: Math.ceil(
          (orderCount +
            expenseCount +
            membershipCount +
            withdrawalCount) /
            limit
        ),
      },
      note:
        "Includes paid product orders, verified membership payments, recorded business expenses, and approved withdrawals. Withdrawals are shown for cash tracking and are not necessarily operating expenses for formal accounting.",
    });
  } catch (error) {
    next(error);
  }
};


const getExpenseSnapshot = (expense) => ({
  expenseNumber: expense.expenseNumber || "",
  amount: expense.amount,
  category: expense.category,
  expenseDate: expense.expenseDate,
  paymentMethod: expense.paymentMethod,
  description: expense.description || "",
  receiptReference: expense.receiptReference || "",
  status: expense.status,
  voidReason: expense.voidReason || "",
  voidedBy: expense.voidedBy || null,
  voidedAt: expense.voidedAt || null,
});

const writeExpenseAudit = async ({
  expense,
  action,
  performedBy,
  before,
  after,
  reason = "",
  req,
}) => {
  if (!performedBy) {
    throw new Error("Unable to identify the user performing this action.");
  }

  await FinanceAuditLog.create({
    expense: expense._id,
    expenseNumber: expense.expenseNumber || "",
    action,
    performedBy,
    performedByRole: req.user?.role || "MANAGER",
    before,
    after,
    reason,
    ipAddress: req.ip || "",
  });
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actorId = getActorId(req);
    const reason = String(req.body?.reason || "").trim();

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID.",
      });
    }

    if (!actorId) {
      return res.status(401).json({
        success: false,
        message: "Unable to identify the logged-in manager.",
      });
    }

    if (!reason || reason.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Enter a deletion reason of 1–1000 characters.",
      });
    }

    const expense = await FinanceExpense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found.",
      });
    }

    if (expense.status !== "RECORDED") {
      return res.status(409).json({
        success: false,
        message: "This expense has already been deleted.",
      });
    }

    const before = getExpenseSnapshot(expense);

    expense.status = "VOID";
    expense.voidReason = reason;
    expense.voidedBy = actorId;
    expense.voidedAt = new Date();

    await expense.save();

    await writeExpenseAudit({
      expense,
      action: "DELETED",
      performedBy: actorId,
      before,
      after: getExpenseSnapshot(expense),
      reason,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Expense deleted and audit history recorded.",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};
