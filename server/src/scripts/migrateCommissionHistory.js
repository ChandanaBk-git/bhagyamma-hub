const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/user.model");
const Commission = require("../models/commissionTransaction.model");

async function migrate() {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const paidUsers = await User.find({
        paymentStatus: "Paid",
    });

    console.log(`Found ${paidUsers.length} Paid Members`);

    let totalInserted = 0;

    for (const member of paidUsers) {

        let sponsorId = member.sponsorId;

        let level = 1;

        while (sponsorId) {

            const sponsor =
                await User.findById(sponsorId);

            if (!sponsor) break;

            let percentage = 1;

            if (level === 1)
                percentage = 20;

            else if (level === 2)
                percentage = 5;

            else
                percentage = 1;

            const commissionAmount =
                (2000 * percentage) / 100;

            // Already Exists?

            const exists =
                await Commission.findOne({

                    receiver: sponsor._id,

                    fromUser: member._id,

                    level,

                });

            if (!exists) {

                await Commission.create({

                    receiver: sponsor._id,

                    fromUser: member._id,

                    level,

                    percentage,

                    joiningAmount: 2000,

                    commissionAmount,

                    status: "PAID",

                    remarks:
                        "Migrated Commission",

                });

                totalInserted++;

                console.log(
                    `✅ ${member.userId} -> ${sponsor.userId} Level ${level}`
                );

            }

            sponsorId = sponsor.sponsorId;

            level++;

        }

    }

    console.log("");

    console.log("================================");

    console.log(
        `Inserted ${totalInserted} Commission Records`
    );

    console.log("================================");

    process.exit();

}

migrate().catch((err) => {

    console.error(err);

    process.exit(1);

});