const Commission = require("../models/commissionTransaction.model");

const create = (data) => Commission.create(data);

const bulkCreate = (data) => Commission.insertMany(data);

const findAll = () =>
    Commission.find()
        .populate("fromUser", "name referralCode")
        .populate("receiver", "name referralCode")
        .populate("membership")
        .sort({ createdAt: -1 });

const findById = (id) =>
    Commission.findById(id)
        .populate("fromUser", "name referralCode")
        .populate("receiver", "name referralCode")
        .populate("membership");

const findByUser = (userId) =>
    Commission.find({
        receiver: userId,
    })
        .populate("fromUser", "name userId")
        .sort({ createdAt: -1 });

const updateStatus = (id, status) =>
    Commission.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

const findByReceivers =
  (userIds) =>
    Commission.find({
      receiver: {
        $in: userIds,
      },
    })
      .populate(
        "receiver",
        "name userId referralCode"
      )
      .populate(
        "fromUser",
        "name userId referralCode"
      )
      .populate(
        "order",
        "orderNumber finalAmount status paymentStatus"
      )
      .sort({
        createdAt: -1,
      });

module.exports = {
    create,
    bulkCreate,
    findAll,
    findById,
    findByUser,
    updateStatus,
    findByReceivers,
};