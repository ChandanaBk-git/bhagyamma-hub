const FinanceAuditLog = require("../models/financeAuditLog.model");

exports.getFinanceAuditLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20)
    );

    const filter = {};

    const allowedActions = ["CREATED", "EDITED", "DELETED"];

    if (req.query.action) {
      if (!allowedActions.includes(req.query.action)) {
        return res.status(400).json({
          success: false,
          message: "Invalid audit action",
        });
      }

      filter.action = req.query.action;
    }

    if (req.query.from || req.query.to) {
      filter.createdAt = {};

      if (req.query.from) {
        const from = new Date(req.query.from);

        if (Number.isNaN(from.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid from date",
          });
        }

        from.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = from;
      }

      if (req.query.to) {
        const to = new Date(req.query.to);

        if (Number.isNaN(to.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid to date",
          });
        }

        to.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = to;
      }
    }

    const [logs, total] = await Promise.all([
      FinanceAuditLog.find(filter)
        .populate("performedBy", "name email userId role")
        .populate("expense", "expenseNumber category")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      FinanceAuditLog.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};