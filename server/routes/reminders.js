const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   GET /api/reminders
// @desc    Get all reminders for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ time: 1 });
    res.json(reminders);
  } catch (err) {
    console.error('Get reminders error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/reminders
// @desc    Create a reminder
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, type, time, days, notes, active } = req.body;

    if (!title || !time) {
      return res.status(400).json({ message: 'Title and time are required' });
    }

    const newReminder = new Reminder({
      user: req.user.id,
      title: title.trim(),
      type: type || 'workout',
      time,
      days: days && days.length > 0 ? days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      notes: notes || '',
      active: active !== undefined ? active : true
    });

    const reminder = await newReminder.save();

    // Trigger Notification acknowledging reminder set
    try {
      await Notification.create({
        user: req.user.id,
        type: 'reminder',
        title: 'Reminder Set! ⏰',
        message: `Alert configured: "${reminder.title}" scheduled for ${reminder.time}.`,
        link: '/settings'
      });
    } catch (nErr) {
      console.warn('Reminder notif err:', nErr.message);
    }

    res.json(reminder);
  } catch (err) {
    console.error('Create reminder error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/reminders/:id/toggle
// @desc    Toggle reminder active/inactive
// @access  Private
router.put('/:id/toggle', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    reminder.active = !reminder.active;
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    console.error('Toggle reminder error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/reminders/:id
// @desc    Edit a reminder
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, type, time, days, notes, active } = req.body;
    let reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    if (title) reminder.title = title.trim();
    if (type) reminder.type = type;
    if (time) reminder.time = time;
    if (days) reminder.days = days;
    if (notes !== undefined) reminder.notes = notes;
    if (active !== undefined) reminder.active = active;

    await reminder.save();
    res.json(reminder);
  } catch (err) {
    console.error('Update reminder error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/reminders/:id
// @desc    Delete a reminder
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    console.error('Delete reminder error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
