const CommissionTransaction =
require("../models/commissionTransaction.model");

const createCommission = async (data)=>{

    return await CommissionTransaction.create(data);

};

module.exports = {

    createCommission,

};