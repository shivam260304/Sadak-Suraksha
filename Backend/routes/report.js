const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');

// Add authentication middleware here.
// (Copy-paste this to the top of your file if not imported)
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// POST /api/report
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, location, category, priority, imageUrl } = req.body;

    const report = new Report({
      title,
      description,
      location,
      category,
      priority,
      imageUrl: imageUrl || "",
      user: req.userId // <-- Save the ID of the logged-in user!
    });

    await report.save();

    res.status(201).json({ message: 'Report submitted!', report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit report." });
  }
});

module.exports = router;
