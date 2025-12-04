// controllers/superAdminController.js
const SuperAdmin = require("../models/SuperAdmin");
const jwt = require("jsonwebtoken");


// ⭐ REGISTER SUPER ADMIN (ONLY ONCE)
exports.registerSuperAdmin = async (req, res) => {
  try {
    const isAllowed = await SuperAdmin.canCreateSuperAdmin();

    if (!isAllowed) {
      return res.status(400).json({
        success: false,
        message: "Super Admin already exists. Only one is allowed.",
      });
    }

    const { email, password } = req.body;

    const newSuperAdmin = await SuperAdmin.create({ email, password });

    return res.status(201).json({
      success: true,
      message: "Super Admin created successfully",
      superAdmin: newSuperAdmin,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


// ⭐ LOGIN SUPER ADMIN
exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin not found",
      });
    }

    const isMatch = await superAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: superAdmin._id, role: "superadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      superAdmin,
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
