const mongoose = require("mongoose");

const User =
  require("../models/user.model");

const commissionRepository =
  require("../repositories/commission.repository");

require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

const MEMBER_ID =
  "6a906a0e4a7228f228b52155";

const MEMBERSHIP_AMOUNT = 2000;

const getPercentage = (level) => {

  if (level === 1) return 20;

  if (level === 2) return 5;

  return 1;
};

const run = async () => {

  await mongoose.connect(
    MONGO_URI
  );

  console.log(
    "MongoDB connected"
  );

  const member =
    await User.findById(
      MEMBER_ID
    );

  if (!member) {

    throw new Error(
      "BH000032 not found"
    );
  }

  console.log(
    "Member:",
    member.userId,
    member.name
  );

  console.log(
    "Sponsor:",
    member.sponsorId?.toString()
  );

  let sponsorId =
    member.sponsorId;

  let level = 1;

  while (
    sponsorId &&
    level <= 100
  ) {

    const sponsor =
      await User.findById(
        sponsorId
      );

    if (!sponsor) {
      break;
    }

    const percentage =
      getPercentage(level);

    const commissionAmount =
      MEMBERSHIP_AMOUNT *
      percentage /
      100;

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

      console.log(
        `L${level} already exists:`,
        sponsor.userId
      );

    } else {

      const commission =
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

      console.log(
        "CREATED:",
        sponsor.userId,
        `L${level}`,
        `${percentage}%`,
        `₹${commissionAmount}`,
        commission._id.toString()
      );
    }

    sponsorId =
      sponsor.sponsorId;

    level++;
  }

  console.log(
    "Commission repair completed."
  );

  await mongoose.disconnect();
};

run()
  .catch((error) => {

    console.error(
      error
    );

    process.exit(1);
  });