const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    positionApplyingFor: {
      type: String,
      enum: ["development", "testing", "applicationSupport"],
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    yearOfPassout: {
      type: Number,
      required: true,
    },

    joinedInstitute: {
      type: Boolean,
      default: false,
    },

    instituteName: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      required: true,
    },

    appliedCompanies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//
// 🔐 HASH PASSWORD (Mongoose v7+ safe)
//
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//
// 🔑 COMPARE PASSWORD
//
userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
