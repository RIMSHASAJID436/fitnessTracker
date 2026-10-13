const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   POST /api/progress
// @desc    Add a progress entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { date, weight, bodyFatPercentage, measurements, performanceMetrics, notes, photoUrl } = req.body;

    if (!weight) {
      return res.status(400).json({ message: 'Weight is required' });
    }

    const newProgress = new Progress({
      user: req.user.id,
      date: date || Date.now(),
      weight: Number(weight),
      bodyFatPercentage: bodyFatPercentage ? Number(bodyFatPercentage) : 0,
      measurements: measurements || {},
      performanceMetrics: performanceMetrics || {},
      notes: notes || '',
      photoUrl: photoUrl || ''
    });

    const progress = await newProgress.save();

    // Update user's currentWeight
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        user.currentWeight = Number(weight);
        await user.save();

        // Check if target weight is reached
        if (user.targetWeight && Math.abs(user.currentWeight - user.targetWeight) <= 0.5) {
          await Notification.create({
            user: user._id,
            type: 'goal',
            title: 'Goal Achieved! 🏆',
            message: `Congratulations! You reached your target weight of ${user.targetWeight} kg!`,
            link: '/progress'
          });
        }
      }
    } catch (uErr) {
      console.warn('User weight update err:', uErr.message);
    }

    res.json(progress);
  } catch (err) {
    console.error('Create progress error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/progress
// @desc    Get all progress entries for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const progressList = await Progress.find({ user: req.user.id }).sort({ date: -1 });
    res.json(progressList);
  } catch (err) {
    console.error('Get progress error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/progress/analytics
// @desc    Get visual progress analytics over time
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const entries = await Progress.find({ user: req.user.id }).sort({ date: 1 });
    const user = await User.findById(req.user.id).select('currentWeight targetWeight');

    if (entries.length === 0) {
      return res.json({
        hasData: false,
        weightHistory: [],
        measurementsHistory: [],
        metricsHistory: [],
        startingWeight: user?.currentWeight || 0,
        currentWeight: user?.currentWeight || 0,
        targetWeight: user?.targetWeight || 0,
        totalWeightChange: 0
      });
    }

    const firstEntry = entries[0];
    const latestEntry = entries[entries.length - 1];

    const weightHistory = entries.map(e => ({
      date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      fullDate: e.date,
      weight: e.weight,
      bodyFat: e.bodyFatPercentage || null,
      target: user?.targetWeight || null
    }));

    const measurementsHistory = entries.map(e => ({
      date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      chest: e.measurements?.chest || 0,
      waist: e.measurements?.waist || 0,
      hips: e.measurements?.hips || 0,
      arms: e.measurements?.arms || 0,
      thighs: e.measurements?.thighs || 0
    }));

    const metricsHistory = entries.map(e => ({
      date: new Date(e.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      benchPress: e.performanceMetrics?.benchPress || 0,
      squat: e.performanceMetrics?.squat || 0,
      deadlift: e.performanceMetrics?.deadlift || 0,
      run5k: e.performanceMetrics?.run5kTimeMinutes || 0
    }));

    const totalWeightChange = (latestEntry.weight - firstEntry.weight).toFixed(1);

    res.json({
      hasData: true,
      weightHistory,
      measurementsHistory,
      metricsHistory,
      startingWeight: firstEntry.weight,
      currentWeight: latestEntry.weight,
      targetWeight: user?.targetWeight || null,
      totalWeightChange: Number(totalWeightChange),
      latestEntry
    });
  } catch (err) {
    console.error('Progress analytics error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/progress/:id
// @desc    Edit a progress entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let entry = await Progress.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const { date, weight, bodyFatPercentage, measurements, performanceMetrics, notes, photoUrl } = req.body;

    if (date) entry.date = date;
    if (weight !== undefined) entry.weight = Number(weight);
    if (bodyFatPercentage !== undefined) entry.bodyFatPercentage = Number(bodyFatPercentage);
    if (measurements) entry.measurements = { ...entry.measurements, ...measurements };
    if (performanceMetrics) entry.performanceMetrics = { ...entry.performanceMetrics, ...performanceMetrics };
    if (notes !== undefined) entry.notes = notes;
    if (photoUrl !== undefined) entry.photoUrl = photoUrl;

    await entry.save();
    res.json(entry);
  } catch (err) {
    console.error('Update progress error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/progress/:id
// @desc    Delete a progress entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let entry = await Progress.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    if (entry.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await Progress.findByIdAndDelete(req.params.id);
    res.json({ message: 'Progress entry removed' });
  } catch (err) {
    console.error('Delete progress error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
