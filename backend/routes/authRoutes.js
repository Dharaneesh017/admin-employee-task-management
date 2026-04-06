const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isApproved) {
      return res.status(401).json({ message: 'Login denied. Your account is pending admin approval.' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'employee',
    isApproved: (role === 'admin') // Admins are approved by default if created via seed or similar
  });

  if (user) {
    res.status(201).json({
      message: 'Registration successful! Please wait for admin approval.',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @route   GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/approve/:id
router.put('/approve/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isApproved = req.body.isApproved;
    await user.save();
    res.json({ message: `User ${user.isApproved ? 'Approved' : 'Disapproved'}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
