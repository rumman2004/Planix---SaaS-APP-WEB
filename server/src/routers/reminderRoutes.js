const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require auth
router.use(authMiddleware);

router.get('/', reminderController.getReminders);
router.post('/', reminderController.createReminder);
router.patch('/:reminderId', reminderController.updateStatus);
router.patch('/:reminderId/complete', reminderController.markAsCompleted);
router.delete('/:reminderId', reminderController.deleteReminder);

module.exports = router;