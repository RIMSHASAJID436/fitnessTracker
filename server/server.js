const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/workouts', require('./routes/workouts'));
app.use('/api/nutrition', require('./routes/nutrition'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/support', require('./routes/support'));
app.use('/api/community', require('./routes/community'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));

// Seed Admin
const seedAdmin = async () => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const adminExists = await User.findOne({ email: 'admin@fitness.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      const newAdmin = new User({
        username: 'admin',
        email: 'admin@fitness.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'admin'
      });
      await newAdmin.save();
      console.log('Default Admin Account seeded: admin@fitness.com / admin123');
    }
  } catch (err) {
    console.error('Error seeding admin', err);
  }
};
seedAdmin();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fitness Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
