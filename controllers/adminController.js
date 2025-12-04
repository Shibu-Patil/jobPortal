// controllers/adminController.js
const Admin = require("../models/Admin");
const SuperAdmin = require("../models/SuperAdmin");
const jwt = require("jsonwebtoken");

// ⭐ REGISTER ADMIN (ONLY SUPERADMIN)
exports.registerAdmin = async (req, res) => {
  try {
    // Check if current user is SUPERADMIN
    if (req.user.role !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Only SuperAdmin can register admins",
      });
    }

    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ email, password });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ⭐ LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // If oldPassword is provided → verify it
    if (oldPassword) {
      const isMatch = await admin.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
    }

    // If oldPassword not provided → allow update using only email
    admin.password = newPassword; // pre-save hook hashes password
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
