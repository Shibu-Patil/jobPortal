// models/Company.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔗 added link fields
    companyWebsite: {
      type: String,
      trim: true,
      default: "",
    },

    jobDescriptionLink: {
      type: String,
      trim: true,
      default: "",
    },

    applicationLink: {
      type: String,
      trim: true,
      default: "",
    },

    brochureLink: {
      type: String,
      trim: true,
      default: "",
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    jobFunctions: {
      type: [String],
      required: true,
    },

    CTC: {
      type: String,
      required: true,
    },

    eligibilityCriteria: {
      type: [String],
      required: true,
    },

    companyLocation: {
      type: [String],
      required: true,
    },

    requiredSkills: {
      type: [String],
      required: true,
    },

    placementOpportunities: {
      type: [String],
      required: true,
    },

    roleOverview: {
      type: [String],
      required: true,
    },

    usersApplied: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
