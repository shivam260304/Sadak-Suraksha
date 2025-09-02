const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');

// Admin auth middleware, verifying token and admin role
function adminAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// GET /api/complaints
// Fetch all reports, sorted by priority (custom sort order)
router.get('/', adminAuthMiddleware, async (req, res) => {
  try {
    // Custom priority order mapping
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    const reports = await Report.find().lean();

    // Sort reports by priority using mapping
    reports.sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99));

    res.json({ reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints." });
  }
});

// PATCH /api/complaints/:id/status
// Update status of a specific report
router.patch('/:id/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Submitted", "Under Review", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json({ message: "Status updated.", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status." });
  }
});

module.exports = router;
