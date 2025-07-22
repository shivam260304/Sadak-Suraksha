const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

const User  = require('../models/User');   
const Admin = require('../models/Admin');

// POST /api/auth/login
// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, username, password, role = 'user' } = req.body;

  if (!email || !username || !password)
    return res.status(400).json({ message: 'Email, username, and password are required' });

  try {
    const Model = role === 'admin' ? Admin : User;

    const exists = await Model.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 12);

    const account = await Model.create({ email, username, password: hash });

    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  try {
    
    const Model = role === 'admin' ? Admin : User;

    
    const account = await Model.findOne({ email }).select('+password');
    if (!account) return res.status(400).json({ message: 'Invalid credentials' });

    
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    
    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

   
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
