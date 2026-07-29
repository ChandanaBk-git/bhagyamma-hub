const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models/user.model");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const createUsers = async () => {
  try {
    // ---------- SUPER ADMIN ----------
    const superAdminExists = await User.findOne({
      email: "chandanachand2003@gmail.com",
    });

    if (!superAdminExists) {
      await User.create({
        userId: "BH000001",
        name: "Chandana B K",
        email: "chandanachand2003@gmail.com",
        mobile: "6363645068",
        password: "Chand@2003",
        role: "SUPER_ADMIN",
        referralCode: "BHADMIN001",
        walletBalance: 0,
        spBalance: 0,
        isActive: true,
        isKycVerified: true,
        emailVerified: true,
      });

      console.log("✅ SUPER_ADMIN created");
    } else {
      console.log("ℹ️ SUPER_ADMIN already exists");
    }

    // ---------- MANAGER ----------
    const managerExists = await User.findOne({
      email: "bhagyammahub@gmail.com",
    });

    if (!managerExists) {
      await User.create({
        userId: "BH000002",
        name: "Bhagyamma Hub",
        email: "bhagyammahub@gmail.com",
        mobile: "9019174672",
        password: "Bhub@2026",
        role: "MANAGER",
        referralCode: "BHMANAGER001",
        walletBalance: 0,
        spBalance: 0,
        isActive: true,
        isKycVerified: true,
        emailVerified: true,
      });

      console.log("✅ MANAGER created");
    } else {
      console.log("ℹ️ MANAGER already exists");
    }

    console.log("\n🎉 Setup completed successfully.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(createUsers);