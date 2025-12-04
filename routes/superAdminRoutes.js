const express = require("express");
const router = express.Router();

const {
  registerSuperAdmin,
  loginSuperAdmin,
} = require("../controllers/superAdminController");

// Register (only once)
router.post("/register", registerSuperAdmin);

// Login
router.post("/login", loginSuperAdmin);

module.exports = router;
