const commissionRepository = require("../repositories/commission.repository");
const commissionSettingRepository = require("../repositories/commissionSetting.repository");
const userRepository = require("../repositories/user.repository");
const walletService = require("./wallet.service");

const distributeCommission = async (
    newUser,
    membership,
    approvedBy
) => {

    const setting = await commissionSettingRepository.getActive();

    if (!setting) {
        throw new Error("Commission settings not found.");
    }

    // Membership Amount
    const membershipAmount =
        membership.purchaseAmount || membership.amount;

    // =====================================================
    // CASE 1 : MEMBER REGISTERED WITHOUT REFERRAL
    // =====================================================

    if (!newUser.sponsorId && newUser.managerId) {

        const manager =
            await userRepository.findById(newUser.managerId);

        if (!manager) return;

        const amount =
            (membershipAmount * setting.managerDirect) / 100;

        await walletService.creditWallet(
            manager._id,
            amount,
            `Manager Direct Commission from ${newUser.name}`
        );

        await commissionRepository.create({

            fromUser: newUser._id,

            toUser: manager._id,

            membership: membership._id,

            level: 0,

            percentage: setting.managerDirect,

            amount,

            type: "MANAGER",

            status: "SUCCESS",

            approvedBy,

        });

        return;
    }

    // =====================================================
    // REFERRAL COMMISSION
    // =====================================================

    let sponsorId = newUser.sponsorId;

    let level = 1;

    while (
        sponsorId &&
        level <= setting.maxLevel
    ) {

        const sponsor =
            await userRepository.findById(sponsorId);

        if (!sponsor) break;

        let percentage;

        if (level === 1) {

            percentage = setting.level1;

        } else if (level === 2) {

            percentage = setting.level2;

        } else {

            percentage = setting.level3Plus;

        }

        const amount =
            (membershipAmount * percentage) / 100;

        await walletService.creditWallet(

            sponsor._id,

            amount,

            `Level ${level} Commission from ${newUser.name}`

        );

        await commissionRepository.create({

            fromUser: newUser._id,

            toUser: sponsor._id,

            membership: membership._id,

            level,

            percentage,

            amount,

            type: "LEVEL",

            status: "SUCCESS",

            approvedBy,

        });

        sponsorId = sponsor.sponsorId;

        level++;

    }

};

module.exports = {

    distributeCommission,

};