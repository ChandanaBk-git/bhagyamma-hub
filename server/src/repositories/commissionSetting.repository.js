const CommissionSetting = require("../models/commissionSetting.model");

const create = (data) =>
    CommissionSetting.create(data);

const getActive = () =>
    CommissionSetting.findOne({
        isActive: true,
    });

const update = (id, data) =>
    CommissionSetting.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );

module.exports = {
    create,
    getActive,
    update,
};