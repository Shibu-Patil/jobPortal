// models/SuperAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const superAdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
superAdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Allow only ONE SuperAdmin in DB
superAdminSchema.statics.canCreateSuperAdmin = async function () {
  const count = await this.countDocuments();
  return count === 0;
};

// Compare password method
superAdminSchema.methods.comparePassword = async function (input) {
  return bcrypt.compare(input, this.password);
};

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
