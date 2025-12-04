// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, updatePassword } = require("../controllers/adminController");
const { protect } = require("../middleware/auth");

// Register Admin → Only SuperAdmin
router.post("/register", protect(["superadmin"]), registerAdmin);

// Admin Login → Open
router.post("/login", loginAdmin);
router.put("/update-password", updatePassword);

module.exports = router;
