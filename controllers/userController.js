const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


exports.registerUser = async (req, res) => {
  try {
    const {
      email,
      mobile,
      password,
      positionApplyingFor,
      skills,
      yearOfPassout,
      joinedInstitute,
      instituteName,
      college,
    } = req.body;

    // Check if email or mobile already exists
    const existing = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existing) {
      return res.status(400).json({ message: "Email or mobile already registered" });
    }

    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
      email,
      mobile,
      password,
      positionApplyingFor,
      skills,
      yearOfPassout,
      joinedInstitute,
      instituteName,
      college,
      otp,
      otpExpire,
      isVerified: false,
    });

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for registration is ${otp}`,
      html: `<p>Your OTP for registration is <b>${otp}</b></p>`,
    });

    res.status(201).json({
      success: true,
      message: "User registered. Please verify OTP sent to email.",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// -----------------------------
// VERIFY OTP
// -----------------------------
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpire < Date.now()) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified. Registration complete." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -----------------------------
// LOGIN USER
// -----------------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(400).json({ message: "User not verified. Please check your email OTP." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !newPassword) return res.status(400).json({ message: "Email and new password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // If oldPassword is provided → verify it
    if (oldPassword) {
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });
    }

    // If oldPassword not provided → allow update using only email
    user.password = newPassword; // pre-save hook hashes password
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
