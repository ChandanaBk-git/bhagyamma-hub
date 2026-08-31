const User =
  require("../models/user.model");

const walletService =
  require("./wallet.service");

const commissionRepository =
  require("../repositories/commission.repository");


// ============================================================
// CONFIGURATION
// ============================================================

const MEMBERSHIP_AMOUNT = 2000;

const LEVEL_1_PERCENT = 20;
const LEVEL_2_PERCENT = 5;
const LEVEL_3_PLUS_PERCENT = 1;


// ============================================================
// HELPER
// ============================================================

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};


// ============================================================
// COMMISSION PERCENTAGE
// ============================================================

const getCommissionPercentage = (level) => {

  const numericLevel =
    Number(level);

  if (
    !Number.isInteger(numericLevel) ||
    numericLevel < 1
  ) {
    return 0;
  }

  if (numericLevel === 1) {
    return LEVEL_1_PERCENT;
  }

  if (numericLevel === 2) {
    return LEVEL_2_PERCENT;
  }

  return LEVEL_3_PLUS_PERCENT;
};


// ============================================================
// GET SPONSOR
// ============================================================

const getSponsor = async (user) => {

  if (!user) {
    return null;
  }

  if (user.sponsorId) {

    const sponsor =
      await User.findById(
        user.sponsorId
      );

    if (sponsor) {
      return sponsor;
    }
  }

  if (user.referredBy) {

    const sponsor =
      await User.findById(
        user.referredBy
      );

    if (sponsor) {
      return sponsor;
    }
  }

  return null;
};


// ============================================================
// SPONSOR ELIGIBILITY
// ============================================================

const isEligibleSponsor = (sponsor) => {

  if (!sponsor) {
    return false;
  }

  const role =
    String(
      sponsor.role || ""
    ).toUpperCase();

  if (role === "MANAGER") {
    return true;
  }

  return (
    String(
      sponsor.membershipStatus || ""
    ).toUpperCase() === "ACTIVE"
  );
};


// ============================================================
// GET UPLINE
// ============================================================

const getUpline = async (
  user,
  maxLevels = 100
) => {

  const upline = [];

  let currentUser = user;

  for (
    let level = 1;
    level <= maxLevels;
    level++
  ) {

    const sponsor =
      await getSponsor(
        currentUser
      );

    if (!sponsor) {
      break;
    }

    upline.push({
      level,
      user: sponsor,
    });

    currentUser = sponsor;
  }

  return upline;
};


// ============================================================
// CREATE COMMISSION HISTORY
// ============================================================

const createCommissionTransaction = async ({
  receiver,
  fromUser,
  order = null,
  level,
  percentage,
  joiningAmount,
  commissionAmount,
  type = "JOINING",
  referenceId = null,
  remarks = "",
}) => {

  if (
    !receiver ||
    !fromUser
  ) {
    return null;
  }

  const amount =
    toNumber(
      commissionAmount
    );

  if (amount <= 0) {
    return null;
  }

  // ---------------------------------------------
  // DUPLICATE PROTECTION
  // ---------------------------------------------

  const existing =
    await commissionRepository
      .findExistingCommission({
        receiver,
        fromUser,
        level,
      });

  if (existing) {
    return existing;
  }

  // ---------------------------------------------
  // CREATE PENDING RECORD
  // ---------------------------------------------

  try {

    return await commissionRepository.create({

      receiver,

      fromUser,

      order:
        order || null,

      level,

      percentage,

      joiningAmount:
        toNumber(
          joiningAmount
        ),

      commissionAmount:
        amount,

      type,

      referenceId,

      status:
        "PENDING",

      remarks,

    });

  } catch (error) {

    if (
      error &&
      error.code === 11000
    ) {

      return await commissionRepository
        .findExistingCommission({
          receiver,
          fromUser,
          level,
        });
    }

    throw error;
  }
};


// ============================================================
// CREDIT COMMISSION WALLET
// ============================================================

const creditCommissionWallet = async ({
  userId,
  amount,
  remarks,
  referenceId,
}) => {

  const value =
    toNumber(amount);

  if (
    !userId ||
    value <= 0
  ) {
    return null;
  }

  return walletService.creditCommission(
    userId,
    value,
    remarks,
    referenceId
  );
};


// ============================================================
// MARK COMMISSION PAID
// ============================================================

const markCommissionAsPaid = async (
  commissionId
) => {

  if (!commissionId) {
    return null;
  }

  return commissionRepository
    .markAsPaid(
      commissionId
    );
};


// ============================================================
// PROCESS JOINING COMMISSION
// ============================================================

const processJoiningCommission = async ({
  newMemberId,
  sponsorId = null,
  joiningAmount = MEMBERSHIP_AMOUNT,
  orderId = null,
}) => {

  const member =
    await User.findById(
      newMemberId
    );

  if (!member) {

    throw new Error(
      "New member not found."
    );
  }

  // --------------------------------------------------------
  // ALWAYS USE MEMBER SPONSOR FIRST
  // --------------------------------------------------------

  let currentSponsorId =
    member.sponsorId ||
    sponsorId ||
    null;

  if (!currentSponsorId) {

    console.log(
      "NO SPONSOR - NO COMMISSION"
    );

    return {
      success: true,
      commissions: [],
    };
  }

  const amount =
    toNumber(
      joiningAmount
    ) || MEMBERSHIP_AMOUNT;

  let level = 1;

  const commissions = [];

  // --------------------------------------------------------
  // WALK UP TREE
  // --------------------------------------------------------

  while (
    currentSponsorId &&
    level <= 100
  ) {

    const sponsor =
      await User.findById(
        currentSponsorId
      );

    if (!sponsor) {
      break;
    }

    // ------------------------------------------------------
    // CHECK ELIGIBILITY
    // ------------------------------------------------------

    if (
      isEligibleSponsor(
        sponsor
      )
    ) {

      const percentage =
        getCommissionPercentage(
          level
        );

      const commissionAmount =
        Number(
          (
            amount *
            percentage /
            100
          ).toFixed(2)
        );

      const referenceId =
        `JOINING-${member.userId}-L${level}`;

      // ----------------------------------------------------
      // CHECK EXISTING
      // ----------------------------------------------------

      const existing =
        await commissionRepository
          .findExistingCommission({
            receiver:
              sponsor._id,

            fromUser:
              member._id,

            level,
          });

      // ----------------------------------------------------
      // EXISTING RECORD
      // ----------------------------------------------------

      if (existing) {

        if (
          String(
            existing.status || ""
          ).toUpperCase() !==
          "PAID"
        ) {

          await creditCommissionWallet({

            userId:
              sponsor._id,

            amount:
              commissionAmount,

            remarks:
              `Level ${level} Joining Commission`,

            referenceId,
          });

          const paid =
            await markCommissionAsPaid(
              existing._id
            );

          commissions.push(
            paid || existing
          );

        } else {

          commissions.push(
            existing
          );
        }

      }

      // ----------------------------------------------------
      // CREATE NEW RECORD
      // ----------------------------------------------------

      else {

        const commission =
          await createCommissionTransaction({

            receiver:
              sponsor._id,

            fromUser:
              member._id,

            order:
              orderId,

            level,

            percentage,

            joiningAmount:
              amount,

            commissionAmount,

            type:
              "JOINING",

            referenceId,

            remarks:
              `Level ${level} Joining Commission for ${member.userId}`,

          });

        if (commission) {

          try {

            await creditCommissionWallet({

              userId:
                sponsor._id,

              amount:
                commissionAmount,

              remarks:
                `Level ${level} Joining Commission`,

              referenceId,

            });

            const paid =
              await markCommissionAsPaid(
                commission._id
              );

            commissions.push(
              paid || commission
            );

            console.log(
              "======================================"
            );

            console.log(
              "JOINING COMMISSION CREATED"
            );

            console.log(
              "New Member:",
              member.userId
            );

            console.log(
              "Receiver:",
              sponsor.userId ||
              sponsor.name
            );

            console.log(
              "Level:",
              level
            );

            console.log(
              "Percentage:",
              `${percentage}%`
            );

            console.log(
              "Joining Amount:",
              `₹${amount}`
            );

            console.log(
              "Commission:",
              `₹${commissionAmount}`
            );

            console.log(
              "Status: PAID"
            );

            console.log(
              "======================================"
            );

          } catch (error) {

            console.error(
              "COMMISSION WALLET CREDIT FAILED:",
              error.message
            );

            throw error;
          }
        }
      }
    }

    // ------------------------------------------------------
    // NEXT SPONSOR
    // ------------------------------------------------------

    currentSponsorId =
      sponsor.sponsorId;

    level++;
  }

  return {

    success: true,

    message:
      "Joining commission processed successfully.",

    commissions,

  };
};


// ============================================================
// DISTRIBUTE COMMISSION
// ============================================================

const distributeCommission = async (
  newMemberId,
  sponsorId,
  joiningAmount = MEMBERSHIP_AMOUNT,
  orderId = null
) => {

  const member =
    await User.findById(
      newMemberId
    );

  if (!member) {

    throw new Error(
      "New member not found."
    );
  }

  const actualSponsorId =
    member.sponsorId ||
    sponsorId ||
    null;

  if (!actualSponsorId) {

    console.log(
      "NO SPONSOR - NO COMMISSION"
    );

    return [];
  }

  const result =
    await processJoiningCommission({

      newMemberId,

      sponsorId:
        actualSponsorId,

      joiningAmount,

      orderId,

    });

  return (
    result?.commissions ||
    []
  );
};


// ============================================================
// NORMAL PRODUCT COMMISSION
// ============================================================

const processOrderCommission = async () => {

  return {

    success: true,

    message:
      "Normal product purchases do not generate referral commission.",

    commissions: [],

  };
};


// ============================================================
// GET MY COMMISSION HISTORY
// ============================================================

const getCommissionHistory = async (
  userId
) => {

  if (!userId) {
    return [];
  }

  return commissionRepository
    .findByUser(
      userId
    );
};


// ============================================================
// FIND BY USER
// ============================================================
//
// Controller uses:
// commissionService.findByUser(userId)
//
// Keep getCommissionHistory for backward compatibility.
// Both point to the same repository method.
//
// ============================================================

const findByUser = async (
  userId
) => {

  if (!userId) {
    return [];
  }

  return commissionRepository
    .findByUser(
      userId
    );
};


// ============================================================
// GET COMMISSION BY ID
// ============================================================

const findById = async (
  commissionId
) => {

  if (!commissionId) {
    return null;
  }

  return commissionRepository
    .findById(
      commissionId
    );
};


// ============================================================
// GET ALL COMMISSIONS
// ============================================================

const getAllCommissions = async () => {

  return commissionRepository
    .findAll();
};


// ============================================================
// FIND ALL
// ============================================================
//
// Controller uses:
// commissionService.findAll()
//
// ============================================================

const findAll = async () => {

  return commissionRepository
    .findAll();
};


// ============================================================
// GET TOTAL
// ============================================================

const getCommissionTotal = async (
  userId
) => {

  if (!userId) {
    return 0;
  }

  return commissionRepository
    .getTotalByUser(
      userId
    );
};


// ============================================================
// GET SUMMARY
// ============================================================

const getCommissionSummary = async (
  userId
) => {

  if (!userId) {

    return {
      total: 0,
      paid: 0,
      pending: 0,
      count: 0,
    };
  }

  const commissions =
    await commissionRepository
      .findByUser(
        userId
      );

  let total = 0;
  let paid = 0;
  let pending = 0;

  commissions.forEach(
    (item) => {

      const amount =
        toNumber(
          item.commissionAmount
        );

      total += amount;

      const status =
        String(
          item.status || ""
        ).toUpperCase();

      if (
        status === "PAID" ||
        status === "COMPLETED"
      ) {

        paid += amount;

      } else if (
        status === "PENDING"
      ) {

        pending += amount;
      }
    }
  );

  return {

    total,

    paid,

    pending,

    count:
      commissions.length,

  };
};


// ============================================================
// BACKFILL
// ============================================================

const backfillPaidMembershipCommissions = async () => {

  const paidMembers =
    await User.find({

      role: "MEMBER",

      paymentStatus: "Paid",

      membershipStatus: "Active",

    }).sort({
      createdAt: 1,
    });

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  const members = [];

  for (
    const member
    of paidMembers
  ) {

    let created = 0;
    let skipped = 0;

    const errors = [];

    try {

      let currentSponsorId =
        member.sponsorId;

      let level = 1;

      while (
        currentSponsorId &&
        level <= 100
      ) {

        const sponsor =
          await User.findById(
            currentSponsorId
          );

        if (!sponsor) {
          break;
        }

        if (
          !isEligibleSponsor(
            sponsor
          )
        ) {

          currentSponsorId =
            sponsor.sponsorId;

          level++;

          continue;
        }

        const percentage =
          getCommissionPercentage(
            level
          );

        const commissionAmount =
          Number(
            (
              MEMBERSHIP_AMOUNT *
              percentage /
              100
            ).toFixed(2)
          );

        const existing =
          await commissionRepository
            .findExistingCommission({

              receiver:
                sponsor._id,

              fromUser:
                member._id,

              level,

            });

        if (existing) {

          skipped++;
          totalSkipped++;

        } else {

          await commissionRepository
            .create({

              receiver:
                sponsor._id,

              fromUser:
                member._id,

              order:
                null,

              level,

              percentage,

              joiningAmount:
                MEMBERSHIP_AMOUNT,

              commissionAmount,

              type:
                "JOINING",

              status:
                "PAID",

              referenceId:
                `JOINING-${member.userId}-L${level}`,

              remarks:
                `Joining commission for ${member.userId} - Level ${level}`,

            });

          created++;
          totalCreated++;
        }

        currentSponsorId =
          sponsor.sponsorId;

        level++;
      }

    } catch (error) {

      totalErrors++;

      errors.push(
        error.message
      );
    }

    members.push({

      memberId:
        member.userId,

      name:
        member.name,

      created,

      skipped,

      errors,

    });
  }

  return {

    paidMembers:
      paidMembers.length,

    totalCreated,

    totalSkipped,

    totalErrors,

    members,

  };
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  // Sponsor / tree
  getSponsor,
  getUpline,
  isEligibleSponsor,

  // Commission configuration
  getCommissionPercentage,

  // Commission creation / wallet
  createCommissionTransaction,
  creditCommissionWallet,
  markCommissionAsPaid,

  // Commission distribution
  processJoiningCommission,
  distributeCommission,
  processOrderCommission,

  // History
  getCommissionHistory,
  findByUser,

  // Single commission
  findById,

  // All commissions
  getAllCommissions,
  findAll,

  // Totals / summary
  getCommissionTotal,
  getCommissionSummary,

  // Backfill
  backfillPaidMembershipCommissions,

};