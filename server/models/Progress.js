const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  weight: {
    type: Number, // in kg (or converted)
    required: true
  },
  bodyFatPercentage: {
    type: Number,
    default: 0
  },
  measurements: {
    chest: { type: Number, default: 0 },
    waist: { type: Number, default: 0 },
    hips: { type: Number, default: 0 },
    arms: { type: Number, default: 0 },
    thighs: { type: Number, default: 0 },
    calves: { type: Number, default: 0 },
    shoulders: { type: Number, default: 0 },
    neck: { type: Number, default: 0 }
  },
  performanceMetrics: {
    benchPress: { type: Number, default: 0 }, // kg
    squat: { type: Number, default: 0 },      // kg
    deadlift: { type: Number, default: 0 },   // kg
    overheadPress: { type: Number, default: 0 }, // kg
    run5kTimeMinutes: { type: Number, default: 0 }, // minutes
    pullUps: { type: Number, default: 0 }
  },
  notes: {
    type: String,
    default: ''
  },
  photoUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', ProgressSchema);

