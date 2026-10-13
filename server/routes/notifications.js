const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false });

    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('Get notifications error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark single notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notif = await Notification.findOne({ _id: req.params.id, user: req.user.id });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });

    notif.read = true;
    await notif.save();
    res.json(notif);
  } catch (err) {
    console.error('Mark read error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all user notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete notification error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
