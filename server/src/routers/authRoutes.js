const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public Authentication Routes
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

// Protected Routes (Requires valid JWT)
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;