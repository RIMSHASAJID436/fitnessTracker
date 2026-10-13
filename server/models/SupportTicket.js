const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['bug', 'feature', 'support', 'feedback', 'account'],
    default: 'support'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  adminReply: {
    type: String,
    default: ''
  },
  adminRepliedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
