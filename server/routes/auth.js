const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');

const JWT_SECRET = process.env.JWT_SECRET || 'fitness_tracker_secret_key';

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, avatar, bio, gender, age, height, currentWeight, targetWeight, fitnessGoal } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Determine unique username
    let chosenUsername = (username && username.trim()) || email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
    let existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: chosenUsername }] });
    
    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }
      chosenUsername = `${chosenUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username: chosenUsername,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: bio || 'Ready to crush my fitness goals!',
      gender: gender || 'prefer_not_to_say',
      age: age ? Number(age) : 25,
      height: height ? Number(height) : 175,
      currentWeight: currentWeight ? Number(currentWeight) : 70,
      targetWeight: targetWeight ? Number(targetWeight) : 68,
      fitnessGoal: fitnessGoal || 'muscle_gain'
    });

    await user.save();

    // Welcome notification
    try {
      await Notification.create({
        user: user._id,
        type: 'system',
        title: 'Welcome to FitTrack Pro! 🎉',
        message: 'Your account is all set. Log your first workout, record today\'s nutrition, or track your measurements to get started!',
        link: '/dashboard'
      });
    } catch (notifErr) {
      console.warn('Welcome notification error:', notifErr.message);
    }

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      const userObj = user.toObject();
      delete userObj.password;
      res.json({ token, user: userObj });
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: err.message || 'Server error during registration' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const loginTarget = identifier || email;

    if (!loginTarget || !password) {
      return res.status(400).json({ message: 'Email/Username and password are required' });
    }

    const user = await User.findOne({
      $or: [
        { email: loginTarget.toLowerCase().trim() },
        { username: loginTarget.trim() }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      const userObj = user.toObject();
      delete userObj.password;
      res.json({ token, user: userObj });
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message || 'Server error during login' });
  }
});

module.exports = router;
