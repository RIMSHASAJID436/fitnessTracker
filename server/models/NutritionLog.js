const mongoose = require('mongoose');

const NutritionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'],
    required: true
  },
  foodItems: [{
    name: { type: String, required: true },
    quantity: { type: String, default: '1 serving' },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 }, // in grams
    carbs: { type: Number, default: 0 },   // in grams
    fat: { type: Number, default: 0 },     // in grams
    notes: { type: String, default: '' }
  }],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  waterIntake: {
    type: Number, // in ml
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NutritionLog', NutritionLogSchema);

