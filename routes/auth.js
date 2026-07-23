const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register Page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Register Handler
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }
    
    // Create user
    const user = await User.create({ name, email, password });
    
    // Set session
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.role = user.role;
    
    req.flash('success', 'Welcome! Your account has been created successfully');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Login Handler
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }
    
    // Set session
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.role = user.role;
    
    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;