const mongoose = require("mongoose");

const commissionSettingSchema = new mongoose.Schema(
  {
    managerDirect: {
      type: Number,
      default: 20,
    },

    level1: {
      type: Number,
      default: 20,
    },

    level2: {
      type: Number,
      default: 5,
    },

    level3Plus: {
      type: Number,
      default: 1,
    },

    maxLevel: {
      type: Number,
      default: 10,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CommissionSetting",
  commissionSettingSchema
);