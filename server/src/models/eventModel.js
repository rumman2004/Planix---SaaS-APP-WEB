const pool = require('../config/db');

const EventModel = {
  async create({ userId, title, description, startTime, endTime, location, color, recurrence, visibility, allDay, meetLink, googleEventId, eventType, taskListId }) {
    const query = `
      INSERT INTO events (user_id, title, description, start_time, end_time, location, color, recurrence, visibility, all_day, meet_link, google_event_id, event_type, task_list_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;
    const values = [userId, title, description || '', startTime, endTime, location || '', color || 'blue', recurrence || 'none', visibility || 'default', allDay || false, meetLink || null, googleEventId || null, eventType || 'event', taskListId || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Upsert from Google Calendar or Tasks sync
  async upsertFromGoogle({ userId, googleEventId, title, description, startTime, endTime, location, color, recurrence, visibility, status, allDay, meetLink, organizer, attendees, eventType, taskListId }) {
    const query = `
      INSERT INTO events (user_id, google_event_id, title, description, start_time, end_time, location, color, recurrence, visibility, status, all_day, meet_link, organizer, attendees, event_type, task_list_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (google_event_id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        location = EXCLUDED.location,
        color = EXCLUDED.color,
        recurrence = EXCLUDED.recurrence,
        visibility = EXCLUDED.visibility,
        status = EXCLUDED.status,
        all_day = EXCLUDED.all_day,
        meet_link = EXCLUDED.meet_link,
        organizer = EXCLUDED.organizer,
        attendees = EXCLUDED.attendees,
        event_type = EXCLUDED.event_type,
        task_list_id = EXCLUDED.task_list_id,
        updated_at = NOW()
      RETURNING *;
    `;
    const values = [userId, googleEventId, title, description || '', startTime, endTime, location || '', color || 'blue', recurrence || 'none', visibility || 'default', status || 'confirmed', allDay || false, meetLink || null, organizer || null, attendees || null, eventType || 'event', taskListId || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByUserId(userId) {
    const query = 'SELECT * FROM events WHERE user_id = $1 AND status != $2 ORDER BY start_time ASC';
    const result = await pool.query(query, [userId, 'cancelled']);
    return result.rows;
  },

  async findById(eventId) {
    const query = 'SELECT * FROM events WHERE id = $1';
    const result = await pool.query(query, [eventId]);
    return result.rows[0];
  },

  async delete(eventId) {
    const query = 'DELETE FROM events WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [eventId]);
    return result.rows[0];
  },

  async updateGoogleEventId(eventId, googleEventId) {
    const query = 'UPDATE events SET google_event_id = $2, updated_at = NOW() WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [eventId, googleEventId]);
    return result.rows[0];
  },
};

module.exports = EventModel;