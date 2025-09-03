const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Auth middleware
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

// POST /api/report with image upload (field name: 'image')
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, category, priority } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const report = new Report({
      title,
      description,
      location,
      category,
      priority,
      imageUrl,
      user: req.userId,
    });

    await report.save();

    res.status(201).json({ message: 'Report submitted!', report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit report." });
  }
});

router.get('/status-counts', authMiddleware, async (req, res) => {
  try {
    const resolvedCount = await Report.countDocuments({ status: "Resolved" });
    const rejectedCount = await Report.countDocuments({ status: "Rejected" });

    res.json({ Resolved: resolvedCount, Rejected: rejectedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get status counts." });
  }
});

module.exports = router;
