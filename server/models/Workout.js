const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'bodyweight', 'other'],
    default: 'strength'
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    default: 45
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high', 'extreme'],
    default: 'medium'
  },
  notes: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: true
  },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, default: 3 },
    reps: { type: Number, default: 10 },
    weight: { type: Number, default: 0 }, // in kg or lbs
    duration: { type: Number, default: 0 }, // in minutes (for cardio/stretches)
    restSeconds: { type: Number, default: 60 },
    notes: { type: String, default: '' }
  }],
  totalVolume: {
    type: Number, // sets * reps * weight
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', WorkoutSchema);

