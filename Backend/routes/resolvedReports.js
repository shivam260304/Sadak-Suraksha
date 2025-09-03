const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Public GET endpoint to fetch only resolved reports, sorted by creation date descending
router.get('/', async (req, res) => {
  try {
    const resolvedReports = await Report.find({ status: "Resolved" })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reports: resolvedReports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch resolved reports." });
  }
});

module.exports = router;
