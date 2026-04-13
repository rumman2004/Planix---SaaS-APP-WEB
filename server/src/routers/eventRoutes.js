const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all event routes
router.use(authMiddleware);

// CRUD operations for events
router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.patch('/:eventId/status', eventController.updateEventStatus);
router.put('/:eventId', eventController.updateEvent);
router.delete('/:eventId', eventController.deleteEvent);

module.exports = router;