const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Helper: select and return correct model
function getModel(role) {
  return role === 'admin' ? Admin : User;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const blockedEmailDomains = new Set([
  "tempmail.com",
  "10minutemail.com",
  "disposablemail.com",
  // Add more disposable domains here
]);

// Username allowed: letters & spaces only, 3–30 chars, at least 2 letters
const usernameRegex = /^[a-zA-Z ]{3,30}$/;

router.post('/register', async (req, res) => {
  const { email, username, password, role = 'user' } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Email, username, and password are required.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Email domain block check
  const emailDomain = email.split('@')[1].toLowerCase();
  if (blockedEmailDomains.has(emailDomain)) {
    return res.status(400).json({ message: 'Disposable email addresses are not allowed.' });
  }

  // Username pattern and letter count check
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        'Username must be 3-30 characters and contain letters and spaces only, no numbers or special characters.',
    });
  }

  const alphabetCount = (username.match(/[a-zA-Z]/g) || []).length;
  if (alphabetCount < 2) {
    return res.status(400).json({
      message: 'Username must contain at least 2 letters.',
    });
  }

  try {
    const Model = getModel(role);

    if (await Model.findOne({ email })) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    if (await Model.findOne({ username })) {
      return res.status(409).json({ message: 'Username already in use.' });
    }

    const account = await Model.create({ email, username, password });
    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login (unchanged)
router.post('/login', async (req, res) => {
  const { email, password, role = 'user' } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'All fields required.' });

  try {
    const Model = getModel(role);
    const account = await Model.findOne({ email }).select('+password');
    if (!account) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await account.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
