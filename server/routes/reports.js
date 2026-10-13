const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const NutritionLog = require('../models/NutritionLog');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// @route   GET /api/reports/summary
// @desc    Get aggregated report for date range
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const workouts = await Workout.find({ user: req.user.id, ...dateFilter }).sort({ date: 1 });
    const nutrition = await NutritionLog.find({ user: req.user.id, ...dateFilter }).sort({ date: 1 });
    const progress = await Progress.find({ user: req.user.id, ...dateFilter }).sort({ date: 1 });

    const totalWorkouts = workouts.length;
    const totalVolume = workouts.reduce((acc, w) => acc + (w.totalVolume || 0), 0);
    const totalWorkoutMinutes = workouts.reduce((acc, w) => acc + (w.duration || 0), 0);

    const totalNutritionLogs = nutrition.length;
    const totalCalories = nutrition.reduce((acc, n) => acc + (n.totalCalories || 0), 0);
    const totalProtein = nutrition.reduce((acc, n) => acc + (n.totalProtein || 0), 0);
    const totalCarbs = nutrition.reduce((acc, n) => acc + (n.totalCarbs || 0), 0);
    const totalFat = nutrition.reduce((acc, n) => acc + (n.totalFat || 0), 0);

    const avgDailyCalories = totalNutritionLogs > 0 ? Math.round(totalCalories / totalNutritionLogs) : 0;
    const avgDailyProtein = totalNutritionLogs > 0 ? Math.round(totalProtein / totalNutritionLogs) : 0;

    let weightChange = 0;
    if (progress.length >= 2) {
      weightChange = Number((progress[progress.length - 1].weight - progress[0].weight).toFixed(1));
    }

    res.json({
      totalWorkouts,
      totalVolume,
      totalWorkoutMinutes,
      totalNutritionLogs,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      avgDailyCalories,
      avgDailyProtein,
      weightChange,
      workouts,
      nutrition,
      progress
    });
  } catch (err) {
    console.error('Report summary error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/reports/export/csv
// @desc    Export data as CSV
// @access  Private
router.get('/export/csv', auth, async (req, res) => {
  try {
    const { type } = req.query;

    if (type === 'workouts') {
      const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
      let csv = 'Workout Name,Category,Date,Duration (Mins),Intensity,Total Volume (kg),Exercises Count,Notes\n';
      workouts.forEach(w => {
        const d = new Date(w.date).toISOString().split('T')[0];
        const notes = (w.notes || '').replace(/"/g, '""');
        csv += `"${w.name}","${w.category}","${d}",${w.duration},"${w.intensity}",${w.totalVolume || 0},${(w.exercises || []).length},"${notes}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="workouts_report.csv"');
      return res.send(csv);
    } 
    
    if (type === 'nutrition') {
      const logs = await NutritionLog.find({ user: req.user.id }).sort({ date: -1 });
      let csv = 'Date,Meal Type,Total Calories,Protein (g),Carbs (g),Fat (g),Water (ml),Food Items\n';
      logs.forEach(l => {
        const d = new Date(l.date).toISOString().split('T')[0];
        const foodList = (l.foodItems || []).map(f => `${f.name} (${f.quantity || '1x'})`).join('; ').replace(/"/g, '""');
        csv += `"${d}","${l.mealType}",${l.totalCalories || 0},${l.totalProtein || 0},${l.totalCarbs || 0},${l.totalFat || 0},${l.waterIntake || 0},"${foodList}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="nutrition_report.csv"');
      return res.send(csv);
    }

    if (type === 'progress') {
      const progress = await Progress.find({ user: req.user.id }).sort({ date: -1 });
      let csv = 'Date,Weight (kg),Body Fat %,Chest (cm),Waist (cm),Hips (cm),Arms (cm),Bench Press (kg),Squat (kg),Deadlift (kg),Notes\n';
      progress.forEach(p => {
        const d = new Date(p.date).toISOString().split('T')[0];
        const m = p.measurements || {};
        const perf = p.performanceMetrics || {};
        const notes = (p.notes || '').replace(/"/g, '""');
        csv += `"${d}",${p.weight},${p.bodyFatPercentage || 0},${m.chest || 0},${m.waist || 0},${m.hips || 0},${m.arms || 0},${perf.benchPress || 0},${perf.squat || 0},${perf.deadlift || 0},"${notes}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="fitness_progress_report.csv"');
      return res.send(csv);
    }

    return res.status(400).json({ message: 'Invalid export type. Use workouts, nutrition, or progress' });
  } catch (err) {
    console.error('Export CSV error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
