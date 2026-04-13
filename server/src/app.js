const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Import Routes
const authRoutes = require('./routers/authRoutes');
const eventRoutes = require('./routers/eventRoutes');
const reminderRoutes = require('./routers/reminderRoutes');

// Initialize Express app
const app = express();

// Global Middlewares
app.use(helmet()); // Security headers
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173', 
  credentials: true // Allows cookies to be sent back and forth
}));
app.use(express.json()); // Parse incoming JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parses cookies for our authMiddleware
app.use(morgan('dev')); // Request logging in the terminal

// Health Check Route (Great for Supabase/AWS deployment checks)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Planix API is running smoothly.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reminders', reminderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'An internal server error occurred.' 
  });
});

module.exports = app;