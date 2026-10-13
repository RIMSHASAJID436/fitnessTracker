const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   POST /api/workouts
// @desc    Create a workout routine or logged session
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, tags, date, duration, intensity, notes, completed, exercises } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Workout name is required' });
    }

    // Calculate total volume (sets * reps * weight)
    let totalVolume = 0;
    if (exercises && Array.isArray(exercises)) {
      exercises.forEach(ex => {
        const s = Number(ex.sets) || 0;
        const r = Number(ex.reps) || 0;
        const w = Number(ex.weight) || 0;
        totalVolume += (s * r * w);
      });
    }

    const newWorkout = new Workout({
      user: req.user.id,
      name: name.trim(),
      category: category || 'strength',
      tags: tags || [],
      date: date || Date.now(),
      duration: duration ? Number(duration) : 45,
      intensity: intensity || 'medium',
      notes: notes || '',
      completed: completed !== undefined ? completed : true,
      exercises: exercises || [],
      totalVolume
    });

    const workout = await newWorkout.save();

    // Trigger Activity Notification
    try {
      await Notification.create({
        user: req.user.id,
        type: 'workout',
        title: 'Workout Logged! 💪',
        message: `Great hustle! You completed "${workout.name}" with ${workout.exercises.length} exercise(s) and a total volume of ${totalVolume} kg.`,
        link: '/workouts'
      });
    } catch (nErr) {
      console.warn('Workout notif error:', nErr.message);
    }

    res.json(workout);
  } catch (err) {
    console.error('Create workout error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/workouts
// @desc    Get workouts with search and filters
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { search, category, tag, limit } = req.query;

    let query = { user: req.user.id };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (tag && tag.trim() !== '') {
      query.tags = { $in: [new RegExp(tag.trim(), 'i')] };
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { 'exercises.name': regex },
        { notes: regex }
      ];
    }

    let queryBuilder = Workout.find(query).sort({ date: -1 });
    if (limit) {
      queryBuilder = queryBuilder.limit(Number(limit));
    }

    const workouts = await queryBuilder;
    res.json(workouts);
  } catch (err) {
    console.error('Get workouts error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/workouts/analytics
// @desc    Get workout statistics and charts
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: 1 });

    const totalCount = workouts.length;
    let totalVolumeSum = 0;
    let totalMinutes = 0;

    const categoryCounts = {
      strength: 0,
      cardio: 0,
      flexibility: 0,
      hiit: 0,
      bodyweight: 0,
      other: 0
    };

    // Exercise max weights
    const exercisePRs = {};

    workouts.forEach(w => {
      totalVolumeSum += (w.totalVolume || 0);
      totalMinutes += (w.duration || 0);
      if (categoryCounts[w.category] !== undefined) {
        categoryCounts[w.category]++;
      } else {
        categoryCounts.other++;
      }

      if (w.exercises && Array.isArray(w.exercises)) {
        w.exercises.forEach(ex => {
          if (ex.name && ex.weight) {
            const cleanName = ex.name.trim().toLowerCase();
            if (!exercisePRs[cleanName] || ex.weight > exercisePRs[cleanName].maxWeight) {
              exercisePRs[cleanName] = {
                exercise: ex.name,
                maxWeight: ex.weight,
                date: w.date
              };
            }
          }
        });
      }
    });

    const categoryDistribution = Object.keys(categoryCounts).map(cat => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      count: categoryCounts[cat]
    })).filter(c => c.count > 0);

    const prList = Object.values(exercisePRs).sort((a, b) => b.maxWeight - a.maxWeight).slice(0, 10);

    res.json({
      totalCount,
      totalVolumeSum,
      totalMinutes,
      categoryDistribution,
      prList
    });
  } catch (err) {
    console.error('Workout analytics error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/workouts/:id
// @desc    Get single workout by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update a workout routine
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const { name, category, tags, date, duration, intensity, notes, completed, exercises } = req.body;

    let totalVolume = 0;
    if (exercises && Array.isArray(exercises)) {
      exercises.forEach(ex => {
        const s = Number(ex.sets) || 0;
        const r = Number(ex.reps) || 0;
        const w = Number(ex.weight) || 0;
        totalVolume += (s * r * w);
      });
    }

    const updateFields = {
      ...(name && { name: name.trim() }),
      ...(category && { category }),
      ...(tags && { tags }),
      ...(date && { date }),
      ...(duration !== undefined && { duration: Number(duration) }),
      ...(intensity && { intensity }),
      ...(notes !== undefined && { notes }),
      ...(completed !== undefined && { completed }),
      ...(exercises && { exercises }),
      totalVolume
    };

    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(workout);
  } catch (err) {
    console.error('Update workout error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
