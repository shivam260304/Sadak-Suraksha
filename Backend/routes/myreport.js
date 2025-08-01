const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');

// Middleware to authenticate and get user id from JWT
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

router.get('/', authMiddleware, async (req, res) => {
  try {
    const myReports = await Report.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ reports: myReports });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your reports." });
  }
});

module.exports = router;
