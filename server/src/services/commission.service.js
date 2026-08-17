const User = require("../models/user.model");

const walletService = require("./wallet.service");
// const commissionHistoryService = require("./commissionHistory.service");

const repository = require("../repositories/commission.repository");

// ===========================================
// Distribute Joining Commission
// ===========================================

const distributeCommission = async (
    newMemberId,
    sponsorId,
    joiningAmount = 2000
) => {

    let currentSponsorId = sponsorId;

    let level = 1;

    while (currentSponsorId) {

        const sponsor = await User.findById(currentSponsorId);

        if (!sponsor) break;

        let percentage = 0;

        if (level === 1) {
            percentage = 20;
        } else if (level === 2) {
            percentage = 5;
        } else {
            percentage = 1;
        }

        const commissionAmount =
            (joiningAmount * percentage) / 100;

        // ==========================================
        // Credit Wallet
        // ==========================================

        await walletService.creditWallet(
            sponsor._id,
            commissionAmount,
            `Level ${level} Joining Commission`,
            newMemberId.toString()
        );

        // ==========================================
        // Commission Table (Old)
        // ==========================================

        console.log("========== SAVING COMMISSION ==========");
console.log({
    receiver: sponsor._id,
    fromUser: newMemberId,
    level,
    percentage,
    joiningAmount,
    commissionAmount,
});


        await repository.create({

    receiver: sponsor._id,

    fromUser: newMemberId,

    level,

    percentage,

    joiningAmount,

    commissionAmount,

    status: "PAID",

    remarks: `Level ${level} Joining Commission`,

});

console.log("✅ Commission saved successfully");
    

        // ==========================================
        // Next Upline
        // ==========================================

currentSponsorId = sponsor.sponsorId;

        // If your User model uses sponsorId instead:
        // currentSponsorId = sponsor.sponsorId;

        level++;

    }

};

module.exports = {
    distributeCommission,
};