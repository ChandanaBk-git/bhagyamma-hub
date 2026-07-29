const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },

    mobile: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "MANAGER",
        "SUPERVISOR",
        "MEMBER"
      ],
      default: "MEMBER"
    },

    referralCode: {
      type: String,
      unique: true
    },

    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    walletBalance: {
      type: Number,
      default: 0
    },

    spBalance: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isKycVerified: {
      type: Boolean,
      default: false
    },
    emailVerified: {
    type: Boolean,
    default: false
},

lastLogin: {
    type: Date
},

passwordChangedAt: {
    type: Date
},

passwordResetToken: {
    type: String,
    select: false
},

passwordResetExpires: {
    type: Date,
    select: false
},
otp: {
    type: String,
    select: false
},

otpExpires: {
    type: Date,
    select: false
},

otpPurpose: {
    type: String,
    enum: ["LOGIN", "FORGOT_PASSWORD"],
    default: null,
    select: false
}

  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// userSchema.index({ email: 1 });

// userSchema.index({ mobile: 1 });

// userSchema.index({ referralCode: 1 });

userSchema.index({ sponsorId: 1 });

userSchema.index({ managerId: 1 });

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("User",userSchema);