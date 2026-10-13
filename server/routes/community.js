const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const Notification = require('../models/Notification');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/community
// @desc    Get community feed
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, search } = req.query;

    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search && search.trim() !== '') {
      query.content = new RegExp(search.trim(), 'i');
    }

    const posts = await CommunityPost.find(query)
      .populate('user', 'name username avatar')
      .populate('workoutRef', 'name category exercises totalVolume')
      .populate('comments.user', 'name username avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    console.error('Get community posts error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/community
// @desc    Create a community post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content, category, workoutRef } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newPost = new CommunityPost({
      user: req.user.id,
      content: content.trim(),
      category: category || 'workout_win',
      workoutRef: workoutRef || null
    });

    const post = await newPost.save();
    const populated = await CommunityPost.findById(post._id)
      .populate('user', 'name username avatar')
      .populate('workoutRef', 'name category exercises totalVolume');

    res.json(populated);
  } catch (err) {
    console.error('Create community post error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/community/:id/like
// @desc    Like or unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isLiked = post.likes.some(l => l.toString() === req.user.id);
    if (isLiked) {
      post.likes = post.likes.filter(l => l.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);

      // Notify post author if not self
      if (post.user.toString() !== req.user.id) {
        try {
          const liker = await User.findById(req.user.id);
          await Notification.create({
            user: post.user,
            type: 'social',
            title: 'New Like! ❤️',
            message: `${liker.name} liked your community post.`,
            link: '/community'
          });
        } catch (nErr) {
          console.warn('Like notif err:', nErr.message);
        }
      }
    }

    await post.save();
    res.json({ likesCount: post.likes.length, isLiked: !isLiked });
  } catch (err) {
    console.error('Like post error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/community/:id/comment
// @desc    Add comment to a post + trigger notification
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user.id,
      text: text.trim(),
      createdAt: new Date()
    });

    await post.save();

    // Trigger Notification for forum response
    if (post.user.toString() !== req.user.id) {
      try {
        const commenter = await User.findById(req.user.id);
        await Notification.create({
          user: post.user,
          type: 'social',
          title: 'New Forum Response 💬',
          message: `${commenter.name} commented on your post: "${text.slice(0, 40)}..."`,
          link: '/community'
        });
      } catch (nErr) {
        console.warn('Comment notif err:', nErr.message);
      }
    }

    const updated = await CommunityPost.findById(post._id)
      .populate('user', 'name username avatar')
      .populate('comments.user', 'name username avatar');

    res.json(updated.comments);
  } catch (err) {
    console.error('Comment error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
