const commissionService = require("../services/commission.service");
const commissionRepository = require("../repositories/commission.repository");
console.log("Commission controller loaded");
const getAllCommissions = async (req, res, next) => {
    try {

        const commissions = await commissionRepository.findAll();

        res.status(200).json({
            success: true,
            count: commissions.length,
            data: commissions,
        });

    } catch (error) {
        next(error);
    }
};

const getMyCommissions = async (req, res, next) => {

    try {

        const commissions =
            await commissionRepository.findByUser(req.user.id);

        res.status(200).json({
            success: true,
            count: commissions.length,
            data: commissions,
        });

    } catch (error) {
        next(error);
    }

};

const getCommissionById = async (req, res, next) => {

    try {

        const commission =
            await commissionRepository.findById(req.params.id);

        if (!commission) {

            return res.status(404).json({
                success: false,
                message: "Commission not found",
            });

        }

        res.status(200).json({
            success: true,
            data: commission,
        });

    } catch (error) {
        next(error);
    }

};

console.log({
    getAllCommissions,
    getMyCommissions,
    getCommissionById
});

module.exports = {

    getAllCommissions,

    getMyCommissions,

    getCommissionById,

};