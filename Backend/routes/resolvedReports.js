const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// GET /api/complaints?status=Resolved|Rejected
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status === "Resolved" || status === "Rejected") {
      filter.status = status;
    } else {
      filter.status = { $in: ["Resolved", "Rejected"] };
    }

    // Populate user field with name only
    const reports = await Report.find(filter)
    .sort({ createdAt: -1 })
    .populate({ path: "user", select: "username" })
    .lean();


    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reports." });
  }
});

// GET /api/resolved-reports - only resolved status
router.get("/onlyresolved", async (req, res) => {
  try {
    const filter = { status: "Resolved" };

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "username" })
      .lean();

    res.json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch resolved reports." });
  }
});


module.exports = router;
