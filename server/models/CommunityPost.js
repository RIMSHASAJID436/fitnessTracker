const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['workout_win', 'routine_share', 'nutrition_tip', 'motivation', 'qna'],
    default: 'workout_win'
  },
  workoutRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
