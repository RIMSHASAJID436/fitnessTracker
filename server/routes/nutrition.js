const express = require('express');
const router = express.Router();
const NutritionLog = require('../models/NutritionLog');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Helper to sum macros
const calculateTotals = (foodItems) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (foodItems && Array.isArray(foodItems)) {
    foodItems.forEach(item => {
      totalCalories += Number(item.calories) || 0;
      totalProtein += Number(item.protein) || 0;
      totalCarbs += Number(item.carbs) || 0;
      totalFat += Number(item.fat) || 0;
    });
  }

  return { totalCalories, totalProtein, totalCarbs, totalFat };
};

// @route   POST /api/nutrition
// @desc    Add a nutrition meal log
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { date, mealType, foodItems, waterIntake, notes } = req.body;

    if (!mealType) {
      return res.status(400).json({ message: 'Meal type is required' });
    }

    const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotals(foodItems);

    const newLog = new NutritionLog({
      user: req.user.id,
      date: date || Date.now(),
      mealType,
      foodItems: foodItems || [],
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      waterIntake: Number(waterIntake) || 0,
      notes: notes || ''
    });

    const log = await newLog.save();

    // Check if water goal or meal logged notification
    try {
      if (waterIntake && Number(waterIntake) >= 500) {
        await Notification.create({
          user: req.user.id,
          type: 'goal',
          title: 'Hydration Tracked! 💧',
          message: `Logged ${waterIntake}ml of water intake. Keep hydrated throughout the day!`,
          link: '/nutrition'
        });
      }
    } catch (nErr) {
      console.warn('Nutrition notif error:', nErr.message);
    }

    res.json(log);
  } catch (err) {
    console.error('Create nutrition error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/nutrition
// @desc    Get nutrition logs with search, filter, and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { mealType, date, search, startDate, endDate } = req.query;

    let query = { user: req.user.id };

    if (mealType && mealType !== 'all') {
      query.mealType = mealType;
    }

    if (date) {
      const selected = new Date(date);
      const start = new Date(selected);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selected);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { 'foodItems.name': regex },
        { notes: regex },
        { mealType: regex }
      ];
    }

    const logs = await NutritionLog.find(query).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error('Get nutrition error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/nutrition/analytics
// @desc    Get nutrition analytics (macro breakdown, 14-day calorie trend)
// @access  Private
router.get('/analytics', auth, async (req, res) => {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const logs = await NutritionLog.find({
      user: req.user.id,
      date: { $gte: fourteenDaysAgo }
    }).sort({ date: 1 });

    let grandCalories = 0;
    let grandProtein = 0;
    let grandCarbs = 0;
    let grandFat = 0;

    // Daily buckets
    const dailyMap = {};

    for (let i = 0; i < 14; i++) {
      const d = new Date(fourteenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = {
        date: key,
        displayDate: `${d.getMonth() + 1}/${d.getDate()}`,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        water: 0
      };
    }

    logs.forEach(log => {
      grandCalories += (log.totalCalories || 0);
      grandProtein += (log.totalProtein || 0);
      grandCarbs += (log.totalCarbs || 0);
      grandFat += (log.totalFat || 0);

      const logKey = new Date(log.date).toISOString().split('T')[0];
      if (dailyMap[logKey]) {
        dailyMap[logKey].calories += (log.totalCalories || 0);
        dailyMap[logKey].protein += (log.totalProtein || 0);
        dailyMap[logKey].carbs += (log.totalCarbs || 0);
        dailyMap[logKey].fat += (log.totalFat || 0);
        dailyMap[logKey].water += (log.waterIntake || 0);
      }
    });

    const dailyTrends = Object.values(dailyMap);

    // Macronutrient distribution percentages
    const totalMacroGrams = grandProtein + grandCarbs + grandFat;
    const macroDistribution = totalMacroGrams > 0 ? [
      { name: 'Protein', grams: grandProtein, percent: Math.round((grandProtein / totalMacroGrams) * 100), color: '#38bdf8' },
      { name: 'Carbs', grams: grandCarbs, percent: Math.round((grandCarbs / totalMacroGrams) * 100), color: '#f59e0b' },
      { name: 'Fats', grams: grandFat, percent: Math.round((grandFat / totalMacroGrams) * 100), color: '#ec4899' },
    ] : [
      { name: 'Protein', grams: 0, percent: 30, color: '#38bdf8' },
      { name: 'Carbs', grams: 0, percent: 50, color: '#f59e0b' },
      { name: 'Fats', grams: 0, percent: 20, color: '#ec4899' },
    ];

    res.json({
      totalLogs: logs.length,
      grandCalories,
      grandProtein,
      grandCarbs,
      grandFat,
      dailyTrends,
      macroDistribution
    });
  } catch (err) {
    console.error('Nutrition analytics error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/nutrition/:id
// @desc    Edit a nutrition log
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let log = await NutritionLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    if (log.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const { date, mealType, foodItems, waterIntake, notes } = req.body;
    const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotals(foodItems);

    log.mealType = mealType || log.mealType;
    if (date) log.date = date;
    if (foodItems) log.foodItems = foodItems;
    log.totalCalories = totalCalories;
    log.totalProtein = totalProtein;
    log.totalCarbs = totalCarbs;
    log.totalFat = totalFat;
    if (waterIntake !== undefined) log.waterIntake = Number(waterIntake);
    if (notes !== undefined) log.notes = notes;

    await log.save();
    res.json(log);
  } catch (err) {
    console.error('Update nutrition error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/nutrition/:id
// @desc    Delete a nutrition log
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let log = await NutritionLog.findById(req.params.id);

    if (!log) return res.status(404).json({ message: 'Log not found' });
    if (log.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await NutritionLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nutrition log removed' });
  } catch (err) {
    console.error('Delete nutrition error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
