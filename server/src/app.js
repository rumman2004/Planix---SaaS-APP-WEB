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

/** * CRITICAL FOR RAILWAY: 
 * Tells Express to trust the Railway Reverse Proxy. 
 * Required for secure cookies to work over HTTPS.
 */
app.set('trust proxy', 1);

// Global Middlewares
app.use(helmet()); // Security headers
app.use(cors({ 
  origin: (origin, callback) => {
    // 1. Allow mobile apps & curl (which have no origin header)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL, // e.g., https://planix-omega.vercel.app
      'http://localhost:5173',
      'https://localhost:5173',
      'http://localhost:5000',
      'https://planix-server-production.up.railway.app', // Railway self-reference
    ];

    // 2. Allow specific domains or local development IPs
    const isAllowed = allowedOrigins.filter(Boolean).includes(origin) || 
                      origin.startsWith('http://localhost:') || 
                      origin.startsWith('https://localhost:') ||
                      origin.startsWith('http://192.168.');

    if (isAllowed) {
      callback(null, true);
    } else {
      // PRO TIP: Throw a proper error instead of just 'false' for easier debugging
      callback(new Error('Blocked by Planix CORS Policy')); 
    }
  },
  credentials: true // Required to send/receive cookies
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(morgan('dev')); 

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Planix API is healthy.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/reminders', reminderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  // If it's a CORS error, return a specific 403 status
  if (err.message === 'Blocked by Planix CORS Policy') {
    return res.status(403).json({ success: false, message: err.message });
  }
  
  console.error('[Global Error]:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'An internal server error occurred.' 
  });
});

module.exports = app;