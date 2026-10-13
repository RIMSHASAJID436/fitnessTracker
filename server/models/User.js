const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  bio: {
    type: String,
    default: 'Fitness enthusiast on a mission to build strength and longevity.'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer_not_to_say'],
    default: 'prefer_not_to_say'
  },
  age: {
    type: Number,
    default: 25
  },
  height: {
    type: Number, // in cm
    default: 175
  },
  currentWeight: {
    type: Number, // in kg
    default: 70
  },
  targetWeight: {
    type: Number, // in kg
    default: 68
  },
  fitnessGoal: {
    type: String,
    enum: ['muscle_gain', 'fat_loss', 'endurance', 'maintenance', 'athletic_performance'],
    default: 'muscle_gain'
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
    default: 'moderately_active'
  },
  preferences: {
    units: {
      weight: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
      measurements: { type: String, enum: ['cm', 'in'], default: 'cm' },
      distance: { type: String, enum: ['km', 'mi'], default: 'km' }
    },
    theme: {
      mode: { type: String, enum: ['dark', 'light'], default: 'dark' },
      accent: { type: String, default: '#f59e0b' }
    },
    notifications: {
      workoutReminders: { type: Boolean, default: true },
      mealReminders: { type: Boolean, default: true },
      goalAchievements: { type: Boolean, default: true },
      communityUpdates: { type: Boolean, default: true }
    },
    dailyTargets: {
      calories: { type: Number, default: 2200 },
      protein: { type: Number, default: 150 },
      carbs: { type: Number, default: 220 },
      fat: { type: Number, default: 65 },
      water: { type: Number, default: 2500 }, // ml
      workoutsPerWeek: { type: Number, default: 5 }
    }
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);

