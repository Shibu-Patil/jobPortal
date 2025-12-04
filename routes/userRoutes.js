const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  loginUser,
  updatePassword,
} = require("../controllers/userController");

// Register → sends OTP
router.post("/register", registerUser);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Login → only after verified
router.post("/login", loginUser);

// Update password → either oldPassword or email only
router.put("/update-password", updatePassword);

module.exports = router;
