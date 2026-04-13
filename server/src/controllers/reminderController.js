const ReminderModel = require('../models/reminderModel');

// 1. Get all reminders for the user (with event title joined)
exports.getReminders = async (req, res) => {
  try {
    const reminders = await ReminderModel.findByUserIdWithEvent(req.userId);
    res.status(200).json({ success: true, data: reminders });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reminders' });
  }
};

// 2. Create a new custom reminder
exports.createReminder = async (req, res) => {
  const { eventId, remindAt, message, recurrence } = req.body;
  try {
    const newReminder = await ReminderModel.create({
      userId: req.userId,
      eventId: eventId || null,
      remindAt,
      message,
      recurrence: recurrence || 'none',
      status: 'pending',
    });
    res.status(201).json({ success: true, data: newReminder });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ success: false, message: 'Failed to create reminder' });
  }
};

// 3. Update reminder status (pending | paused | completed)
exports.updateStatus = async (req, res) => {
  const { reminderId } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'paused', 'completed'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    const updated = await ReminderModel.updateStatus(reminderId, status);
    if (!updated) return res.status(404).json({ success: false, message: 'Reminder not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ success: false, message: 'Failed to update reminder' });
  }
};

// 4. Mark as completed (convenience endpoint)
exports.markAsCompleted = async (req, res) => {
  const { reminderId } = req.params;
  try {
    const updated = await ReminderModel.updateStatus(reminderId, 'completed');
    if (!updated) return res.status(404).json({ success: false, message: 'Reminder not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ success: false, message: 'Failed to update reminder' });
  }
};

// 5. Delete a reminder
exports.deleteReminder = async (req, res) => {
  const { reminderId } = req.params;
  try {
    const deleted = await ReminderModel.delete(reminderId, req.userId);
    if (!deleted) return res.status(404).json({ success: false, message: 'Reminder not found' });
    res.status(200).json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ success: false, message: 'Failed to delete reminder' });
  }
};