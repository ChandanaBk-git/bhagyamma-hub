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
  trim: true,
  lowercase: true,
  unique: true,
  sparse: true,
  default: undefined,
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
    // ==========================================
// Personal Details
// ==========================================

address: {
  type: String,
  trim: true,
  default: "",
},

aadhaarNumber: {
  type: String,
  trim: true,
  default: "",
},

panNumber: {
  type: String,
  trim: true,
  uppercase: true,
  default: "",
},

// ==========================================
// Bank Details
// ==========================================

bankName: {
  type: String,
  trim: true,
  default: "",
},

accountNumber: {
  type: String,
  trim: true,
  default: "",
},

ifscCode: {
  type: String,
  trim: true,
  uppercase: true,
  default: "",
},

// ==========================================
// MLM Details
// ==========================================

packageName: {
  type: String,
  trim: true,
  default: "",
},

paymentStatus: {
  type: String,
  enum: ["Pending", "Paid"],
  default: "Pending",
},

kycStatus: {
  type: String,
  enum: ["Pending", "Verified", "Rejected"],
  default: "Pending",
},

welcomeKitStatus: {
  type: String,
  enum: ["Pending", "Dispatched"],
  default: "Pending",
},

welcomeKitReceived: {
  type: Boolean,
  default: false,
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
},
aadhaarReceived: {
  type: Boolean,
  default: false,
},

panReceived: {
  type: Boolean,
  default: false,
},

bankPassbookReceived: {
  type: Boolean,
  default: false,
},

paymentDate: {
  type: Date,
  default: null,
},

adminNotes: {
  type: String,
  default: "",
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