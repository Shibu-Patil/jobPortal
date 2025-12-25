const Company = require("../models/Company");
const User = require("../models/User");

// -----------------------------
// CREATE NEW COMPANY
// -----------------------------
exports.createCompany = async (req, res) => {
  try {
    const {
      companyName,
      applicationDeadline,
      jobFunctions,
      CTC,
      eligibilityCriteria,
      companyLocation,
      requiredSkills,
      placementOpportunities,
      roleOverview,
      companyWebsite,
      jobDescriptionLink,
      applicationLink,
      brochureLink,
    } = req.body;

    const company = await Company.create({
      companyName,
      applicationDeadline,
      jobFunctions,
      CTC,
      eligibilityCriteria,
      companyLocation,
      requiredSkills,
      placementOpportunities,
      roleOverview,
      companyWebsite,
      jobDescriptionLink,
      applicationLink,
      brochureLink,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// -----------------------------
// GET ALL COMPANIES
// -----------------------------
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("usersApplied", "name email") // select only needed fields
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// -----------------------------
// GET SINGLE COMPANY
// -----------------------------
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("usersApplied");
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// -----------------------------
// UPDATE COMPANY
// -----------------------------
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// -----------------------------
// DELETE COMPANY
// -----------------------------
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json({ success: true, message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// -----------------------------
// USER APPLIES TO COMPANY
// -----------------------------
exports.applyUserToCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const userId = req.user.id;

    // Find company
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent duplicate application
    if (company.usersApplied.includes(userId)) {
      return res.status(400).json({ message: "User already applied to this company" });
    }

    // Add user to company
    company.usersApplied.push(userId);

    // Add company to user
    user.appliedCompanies.push(companyId);

    await company.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User applied successfully",
      companyId: company._id,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// -----------------------------
// GET ALL USERS WHO APPLIED TO A COMPANY
// -----------------------------
exports.getUsersApplied = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("usersApplied");
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json({
      success: true,
      companyId: company._id,
      companyName: company.companyName,
      usersApplied: company.usersApplied,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// -----------------------------
// GET ALL COMPANIES USER APPLIED FOR
// -----------------------------
exports.getUserAppliedCompanies = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("appliedCompanies");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      appliedCompanies: user.appliedCompanies,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
