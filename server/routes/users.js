const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Workout = require('../models/Workout');
const NutritionLog = require('../models/NutritionLog');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio, avatar, gender, age, height, currentWeight, targetWeight, fitnessGoal, activityLevel } = req.body;
    
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (gender !== undefined) user.gender = gender;
    if (age !== undefined) user.age = Number(age);
    if (height !== undefined) user.height = Number(height);
    if (currentWeight !== undefined) user.currentWeight = Number(currentWeight);
    if (targetWeight !== undefined) user.targetWeight = Number(targetWeight);
    if (fitnessGoal !== undefined) user.fitnessGoal = fitnessGoal;
    if (activityLevel !== undefined) user.activityLevel = activityLevel;

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences and targets
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  try {
    const { units, theme, notifications, dailyTargets } = req.body;
    
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.preferences) user.preferences = {};
    if (units) user.preferences.units = { ...user.preferences.units, ...units };
    if (theme) user.preferences.theme = { ...user.preferences.theme, ...theme };
    if (notifications) user.preferences.notifications = { ...user.preferences.notifications, ...notifications };
    if (dailyTargets) user.preferences.dailyTargets = { ...user.preferences.dailyTargets, ...dailyTargets };

    user.markModified('preferences');
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/dashboard
// @desc    Get dashboard aggregated data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Recent workouts
    const recentWorkouts = await Workout.find({ user: req.user.id }).sort({ date: -1 }).limit(5);
    const totalWorkouts = await Workout.countDocuments({ user: req.user.id });

    // Today's boundaries
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    // Today's nutrition
    const todaysNutrition = await NutritionLog.find({
      user: req.user.id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const todayCalories = todaysNutrition.reduce((acc, log) => acc + (log.totalCalories || 0), 0);
    const todayProtein = todaysNutrition.reduce((acc, log) => acc + (log.totalProtein || 0), 0);
    const todayCarbs = todaysNutrition.reduce((acc, log) => acc + (log.totalCarbs || 0), 0);
    const todayFat = todaysNutrition.reduce((acc, log) => acc + (log.totalFat || 0), 0);
    const todayWater = todaysNutrition.reduce((acc, log) => acc + (log.waterIntake || 0), 0);

    // Past 7 days data for charts
    const sevenDaysAgo = new Date(startOfDay);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyNutrition = await NutritionLog.find({
      user: req.user.id,
      date: { $gte: sevenDaysAgo, $lte: endOfDay }
    });

    const weeklyWorkouts = await Workout.find({
      user: req.user.id,
      date: { $gte: sevenDaysAgo, $lte: endOfDay }
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = [];
    const calorieTarget = (user.preferences && user.preferences.dailyTargets && user.preferences.dailyTargets.calories) || 2200;

    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayName = days[d.getDay()];
      
      const logsForDay = weeklyNutrition.filter(log => new Date(log.date).toDateString() === d.toDateString());
      const cals = logsForDay.reduce((acc, log) => acc + (log.totalCalories || 0), 0);

      const workoutsForDay = weeklyWorkouts.filter(w => new Date(w.date).toDateString() === d.toDateString());
      const workoutsCount = workoutsForDay.length;
      
      chartData.push({
        name: dayName,
        date: d.toISOString().split('T')[0],
        calories: cals,
        goal: calorieTarget,
        workouts: workoutsCount
      });
    }

    // Latest progress
    const latestProgress = await Progress.findOne({ user: req.user.id }).sort({ date: -1 });
    const initialProgress = await Progress.findOne({ user: req.user.id }).sort({ date: 1 });
    const weightDelta = (latestProgress && initialProgress && latestProgress._id.toString() !== initialProgress._id.toString())
      ? (latestProgress.weight - initialProgress.weight).toFixed(1)
      : 0;

    // Unread notifications
    const unreadNotifications = await Notification.countDocuments({ user: req.user.id, read: false });

    res.json({
      user,
      totalWorkouts,
      latestWorkout: recentWorkouts.length > 0 ? recentWorkouts[0] : null,
      recentWorkouts,
      todaysNutrition,
      todayCalories,
      todayProtein,
      todayCarbs,
      todayFat,
      todayWater,
      calorieTarget,
      chartData,
      latestProgress,
      weightDelta,
      unreadNotifications
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/search
// @desc    Search for athletes/users by name or username
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      const popularUsers = await User.find({ _id: { $ne: req.user.id } })
        .select('name username avatar bio fitnessGoal currentWeight followers following')
        .limit(10);
      return res.json(popularUsers);
    }

    const regex = new RegExp(q.trim(), 'i');
    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [{ name: regex }, { username: regex }]
    })
      .select('name username avatar bio fitnessGoal currentWeight followers following')
      .limit(20);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/:id/profile
// @desc    Get public athlete profile
// @access  Private
router.get('/:id/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const workouts = await Workout.find({ user: req.params.id }).sort({ date: -1 }).limit(5);
    const totalWorkouts = await Workout.countDocuments({ user: req.params.id });

    const isFollowing = user.followers && user.followers.some(f => f.toString() === req.user.id);

    res.json({
      user,
      workouts,
      totalWorkouts,
      isFollowing
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow or unfollow user + trigger notification
// @access  Private
router.post('/:id/follow', auth, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = targetUser.followers && targetUser.followers.some(f => f.toString() === req.user.id);

    if (isFollowing) {
      // Unfollow
      targetUser.followers = targetUser.followers.filter(f => f.toString() !== req.user.id);
      currentUser.following = currentUser.following.filter(f => f.toString() !== req.params.id);
      await targetUser.save();
      await currentUser.save();
      return res.json({ following: false, followerCount: targetUser.followers.length });
    } else {
      // Follow
      if (!targetUser.followers) targetUser.followers = [];
      if (!currentUser.following) currentUser.following = [];
      targetUser.followers.push(req.user.id);
      currentUser.following.push(req.params.id);
      await targetUser.save();
      await currentUser.save();

      // Dispatch Activity Notification
      try {
        await Notification.create({
          user: targetUser._id,
          type: 'social',
          title: 'New Follower! 👤',
          message: `${currentUser.name} (@${currentUser.username}) started following your fitness journey!`,
          link: '/community'
        });
      } catch (notifErr) {
        console.warn('Follow notification error:', notifErr.message);
      }

      return res.json({ following: true, followerCount: targetUser.followers.length });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
