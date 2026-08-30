const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getStats
} = require("../controllers/leadController");

const router = express.Router();

// Public website contact form
router.post("/public", createLead);

// Protected CRM APIs
router.use(protect);
router.get("/stats", getStats);
router.get("/", getLeads);
router.get("/:id", getLead);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

module.exports = router;
