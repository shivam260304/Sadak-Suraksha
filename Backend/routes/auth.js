const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Helper: select and return correct model
function getModel(role) {
  return role === 'admin' ? Admin : User;
}

// Register
router.post('/register', async (req, res) => {
  const { email, username, password, role = 'user' } = req.body;
  if (!email || !username || !password)
    return res.status(400).json({ message: 'Email, username, and password are required.' });

  try {
    const Model = getModel(role);
    if (await Model.findOne({ email }))
      return res.status(409).json({ message: 'Email already in use.' });
    if (await Model.findOne({ username }))
      return res.status(409).json({ message: 'Username already in use.' });

    // Only pass plain password; mongoose pre-save hook will hash
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

// Login
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
