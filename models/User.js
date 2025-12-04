// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String }, // store OTP
    otpExpire: { type: Date }, // OTP expiration time
    positionApplyingFor: {
      type: String,
      enum: ["development", "testing", "applicationSupport"],
      required: true,
    },
    skills: { type: [String], default: [] },
    yearOfPassout: { type: Number, required: true },
    joinedInstitute: { type: Boolean, default: false },
    instituteName: { type: String, default: "" },
    college: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (input) {
  return bcrypt.compare(input, this.password);
};

module.exports = mongoose.model("User", userSchema);
