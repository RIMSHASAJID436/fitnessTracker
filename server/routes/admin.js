const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Workout = require('../models/Workout');
const NutritionLog = require('../models/NutritionLog');
const Progress = require('../models/Progress');
const SupportTicket = require('../models/SupportTicket');
const Reminder = require('../models/Reminder');
const Notification = require('../models/Notification');
const CommunityPost = require('../models/CommunityPost');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');

// @route   GET /api/admin/stats
// @desc    Get complete platform stats
// @access  Private Admin
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    const totalNutrition = await NutritionLog.countDocuments();
    const totalProgress = await Progress.countDocuments();
    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } });
    const totalPosts = await CommunityPost.countDocuments();
    const totalReminders = await Reminder.countDocuments({ active: true });

    // Recent registered users
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);

    res.json({
      totalUsers,
      totalWorkouts,
      totalNutrition,
      totalProgress,
      totalTickets,
      openTickets,
      totalPosts,
      totalReminders,
      recentUsers
    });
  } catch (err) {
    console.error('Admin stats error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with optional search
// @access  Private Admin
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { username: regex }, { email: regex }];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user and all their associated data
// @access  Private Admin
router.delete('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete all user related data
    await Workout.deleteMany({ user: req.params.id });
    await NutritionLog.deleteMany({ user: req.params.id });
    await Progress.deleteMany({ user: req.params.id });
    await Reminder.deleteMany({ user: req.params.id });
    await Notification.deleteMany({ user: req.params.id });
    await CommunityPost.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and all associated data permanently removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
