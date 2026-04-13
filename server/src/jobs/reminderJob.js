const cron = require('node-cron');
const ReminderModel = require('../models/reminderModel');

const startReminderJob = () => {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const dueReminders = await ReminderModel.findDueReminders();
      if (dueReminders.length === 0) return;

      for (const reminder of dueReminders) {
        console.log(`\n🔔 REMINDER DUE`);
        console.log(`  User:    ${reminder.user_email || reminder.user_id}`);
        console.log(`  Event:   ${reminder.event_title || 'No linked event'}`);
        console.log(`  Message: ${reminder.message}`);
        console.log(`  Time:    ${new Date(reminder.remind_at).toLocaleString()}`);

        // TODO: Add real notification delivery here:
        // - Email via nodemailer / SendGrid
        // - Push notification via web-push
        // - WebSocket event to connected client
        // Example: await emailService.send(reminder.user_email, reminder.message);

        // If it's a recurring reminder, schedule the next occurrence
        if (reminder.recurrence && reminder.recurrence !== 'none') {
          const nextRemindAt = getNextOccurrence(reminder.remind_at, reminder.recurrence);
          if (nextRemindAt) {
            await ReminderModel.create({
              userId: reminder.user_id,
              eventId: reminder.event_id,
              remindAt: nextRemindAt,
              message: reminder.message,
              recurrence: reminder.recurrence,
              status: 'pending',
            });
          }
        }

        // Mark current reminder as completed
        await ReminderModel.updateStatus(reminder.id, 'completed');
      }
    } catch (error) {
      console.error('❌ Reminder cron job error:', error);
    }
  });

  console.log('✅ Reminder background job scheduled (every minute).');
};

function getNextOccurrence(remindAt, recurrence) {
  const date = new Date(remindAt);
  switch (recurrence) {
    case 'daily':    date.setDate(date.getDate() + 1); break;
    case 'weekly':   date.setDate(date.getDate() + 7); break;
    case 'biweekly': date.setDate(date.getDate() + 14); break;
    case 'monthly':  date.setMonth(date.getMonth() + 1); break;
    case 'yearly':   date.setFullYear(date.getFullYear() + 1); break;
    default: return null; // 'none' or unknown — no repeat
  }
  return date.toISOString();
}

module.exports = startReminderJob;