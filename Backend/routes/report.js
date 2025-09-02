const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');

// Authentication middleware to verify JWT and set req.userId
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

// POST /api/report - create a new report linked to logged-in user
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
      user: req.userId, // Save creator's user ID
    });

    await report.save();

    res.status(201).json({ message: 'Report submitted!', report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit report." });
  }
});

module.exports = router;
