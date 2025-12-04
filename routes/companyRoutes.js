const express = require("express");
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  applyUserToCompany,
  getUsersApplied,
} = require("../controllers/companyController");

const { protect } = require("../middleware/auth");

// ----------------------
// Admin-only routes
// ----------------------
// Only users with role "admin" or "superadmin" can create/update/delete
router.post("/", protect(["admin", "superadmin"]), createCompany);
router.put("/:id", protect(["admin", "superadmin"]), updateCompany);
router.delete("/:id", protect(["admin", "superadmin"]), deleteCompany);

// ----------------------
// Public / user routes
// ----------------------
// Anyone can view companies
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);

// Only verified users can apply
router.post("/apply", protect(["user"]), applyUserToCompany);
router.get("/:id/users", protect(["admin", "superadmin"]), getUsersApplied);

module.exports = router;
