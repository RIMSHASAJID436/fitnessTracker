const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');

// @route   POST /api/support
// @desc    Submit a support ticket or feedback (authenticated or public)
// @access  Public / Optional Auth
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, category, priority, message, userId } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' });
    }

    const ticket = new SupportTicket({
      user: userId || null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      category: category || 'support',
      priority: priority || 'medium',
      message: message.trim()
    });

    await ticket.save();

    if (userId) {
      try {
        await Notification.create({
          user: userId,
          type: 'system',
          title: 'Ticket Received 📩',
          message: `Your inquiry "${subject}" has been received. Our team will review it shortly.`,
          link: '/support'
        });
      } catch (nErr) {
        console.warn('Ticket notif err:', nErr.message);
      }
    }

    res.json({ message: 'Support ticket submitted successfully', ticket });
  } catch (err) {
    console.error('Submit ticket error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/support/my
// @desc    Get user's support tickets
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      $or: [{ user: req.user.id }, { email: req.user.email }]
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    console.error('Get my tickets error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/support/all
// @desc    Admin: Get all support tickets
// @access  Private Admin
router.get('/all', [auth, adminAuth], async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error('Get all tickets error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/support/:id
// @desc    Admin: Update status or reply to ticket
// @access  Private Admin
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (status) ticket.status = status;
    if (adminReply !== undefined) {
      ticket.adminReply = adminReply;
      ticket.adminRepliedAt = Date.now();

      // Notify ticket owner if registered
      if (ticket.user) {
        try {
          await Notification.create({
            user: ticket.user,
            type: 'system',
            title: 'Support Response 💬',
            message: `Admin responded to your inquiry: "${ticket.subject}"`,
            link: '/support'
          });
        } catch (nErr) {
          console.warn('Support reply notif err:', nErr.message);
        }
      }
    }

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error('Update ticket error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
