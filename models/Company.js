// models/Company.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    jobFunctions: {
      type: [String], // multiple job roles
      required: true,
    },

    CTC: {
      type: String,
      required: true,
    },

    eligibilityCriteria: {
      type: [String], // bullet points
      required: true,
    },

    companyLocation: {
      type: [String], // e.g. ["Pune", "Bangalore"]
      required: true,
    },

    requiredSkills: {
      type: [String], // multiple skills
      required: true,
    },

    placementOpportunities: {
      type: [String], // multiple opportunities
      required: true,
    },

    roleOverview: {
      type: [String], // paragraphs or points
      required: true,
    },

    // -------------------------------
    // Users who applied to this company
    // -------------------------------
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
