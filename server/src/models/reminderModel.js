const pool = require('../config/db');

const ReminderModel = {
  async create({ userId, eventId, remindAt, message, recurrence, status }) {
    const query = `
      INSERT INTO reminders (user_id, event_id, remind_at, message, recurrence, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [userId, eventId || null, remindAt, message, recurrence || 'none', status || 'pending'];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Returns reminders joined with the event title for display
  async findByUserIdWithEvent(userId) {
    const query = `
      SELECT r.*, e.title AS event_title
      FROM reminders r
      LEFT JOIN events e ON r.event_id = e.id
      WHERE r.user_id = $1
      ORDER BY r.remind_at ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findByUserId(userId) {
    const query = 'SELECT * FROM reminders WHERE user_id = $1 ORDER BY remind_at ASC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async updateStatus(reminderId, status) {
    const query = 'UPDATE reminders SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [reminderId, status]);
    return result.rows[0];
  },

  async delete(reminderId, userId) {
    const query = 'DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [reminderId, userId]);
    return result.rows[0];
  },

  async findDueReminders() {
    const query = `
      SELECT r.*, e.title AS event_title, u.email AS user_email
      FROM reminders r
      LEFT JOIN events e ON r.event_id = e.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.status = 'pending' AND r.remind_at <= NOW()
    `;
    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = ReminderModel;