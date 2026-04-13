const EventModel = require('../models/eventModel');
const googleService = require('../services/googleService');
const UserModel = require('../models/userModel');

// 1. Get all events, tasks, and birthdays — syncs Google -> Local DB
exports.getEvents = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user && user.refresh_token) {
      try {
        // --- A. Fetch standard Calendar Events ---
        const googleEvents = await googleService.listCalendarEvents(req.userId, user.refresh_token);

        for (const gEvent of googleEvents) {
          const isHoliday = gEvent.planixEventType === 'holiday';
          await EventModel.upsertFromGoogle({
            userId: req.userId,
            googleEventId: gEvent.id,
            title: gEvent.summary || 'Untitled',
            description: gEvent.description || '',
            startTime: gEvent.start?.dateTime || gEvent.start?.date,
            endTime: gEvent.end?.dateTime || gEvent.end?.date,
            location: gEvent.location || '',
            color: isHoliday ? 'indigo' : (gEvent.colorId || 'blue'),
            recurrence: gEvent.recurrence ? gEvent.recurrence[0] : 'none',
            visibility: gEvent.visibility || 'default',
            status: gEvent.status || 'confirmed',
            allDay: !gEvent.start?.dateTime,
            meetLink: gEvent.hangoutLink || null,
            organizer: gEvent.organizer ? JSON.stringify(gEvent.organizer) : null,
            attendees: gEvent.attendees ? JSON.stringify(gEvent.attendees) : null,
            eventType: gEvent.planixEventType || 'event'
          });
        }

        // --- B. Fetch Tasks ---
        const googleTasks = await googleService.listTasks(req.userId, user.refresh_token);
        for (const gTask of googleTasks) {
          await EventModel.upsertFromGoogle({
            userId: req.userId,
            googleEventId: gTask.id,
            title: gTask.title || 'Untitled Task',
            description: gTask.notes || '',
            startTime: gTask.due || null,
            endTime: gTask.due || null,
            status: gTask.deleted ? 'cancelled' : (gTask.status === 'completed' ? 'completed' : 'confirmed'),
            allDay: true,
            eventType: 'task',
            taskListId: gTask.planixTaskListId
          });
        }

        // --- C. Fetch Birthdays ---
        // Birthdays live in a specific read-only calendar. We must find its ID first.
        const birthdayEvents = await googleService.listBirthdayEvents(req.userId, user.refresh_token);
        for (const bDay of birthdayEvents) {
          await EventModel.upsertFromGoogle({
            userId: req.userId,
            googleEventId: bDay.id,
            title: bDay.summary || 'Birthday',
            description: bDay.description || '',
            startTime: bDay.start?.dateTime || bDay.start?.date,
            endTime: bDay.end?.dateTime || bDay.end?.date,
            allDay: true,
            eventType: 'birthday',
            status: 'confirmed',
            color: 'rose' // Force birthdays to be a specific color
          });
        }

        // --- D. HARD SYNC CLEANUP ---
        const syncedIds = [
          ...googleEvents.map(e => e.id),
          ...googleTasks.map(t => t.id),
          ...birthdayEvents.map(b => b.id)
        ].filter(Boolean);

        if (syncedIds.length > 0) {
          const pool = require('../config/db');

          // Cancel orphaned Tasks
          await pool.query(
            "UPDATE events SET status = 'cancelled' WHERE user_id = $1 AND event_type = 'task' AND google_event_id != ALL($2 ::text[])",
            [req.userId, syncedIds]
          );

          // Cancel orphaned upcoming Events & Birthdays 
          await pool.query(
            "UPDATE events SET status = 'cancelled' WHERE user_id = $1 AND event_type IN ('event', 'birthday', 'holiday') AND start_time >= NOW() AND google_event_id != ALL($2 ::text[])",
            [req.userId, syncedIds]
          );
        }

      } catch (googleErr) {
        console.error('Google sync failed, falling back to local DB:', googleErr.message);
      }
    }

    const events = await EventModel.findByUserId(req.userId);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

// 2. Create a new event or task
exports.createEvent = async (req, res) => {
  const { title, description, startTime, endTime, location, color, recurrence, visibility, allDay, meetLink, guests, reminders, eventType, taskListId } = req.body;
  const isTask = eventType === 'task';

  try {
    const user = await UserModel.findById(req.userId);
    let googleEventId = null;

    if (user && user.refresh_token) {
      try {
        if (isTask) {
          const googleTask = await googleService.createTask(req.userId, user.refresh_token, {
            title, description, startTime
          });
          googleEventId = googleTask.id;
        } else {
          const googleEvent = await googleService.createCalendarEvent(req.userId, user.refresh_token, {
            title, description, startTime, endTime, location,
            colorId: color, recurrence, visibility, allDay, meetLink,
            guests: guests || [],
            reminders: reminders || [],
          });
          googleEventId = googleEvent.id;
        }
      } catch (googleErr) {
        console.error('Failed to create Google item:', googleErr.message);
      }
    }

    const newEvent = await EventModel.create({
      userId: req.userId,
      title,
      description,
      startTime,
      endTime,
      location,
      color,
      recurrence,
      visibility,
      allDay: isTask ? true : allDay,
      meetLink,
      googleEventId,
      eventType: eventType || 'event',
      taskListId
    });

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Failed to create item' });
  }
};

// 3. Delete an event, task, or birthday
exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.findById(eventId);
    if (!event || event.user_id !== req.userId) {
      return res.status(404).json({ success: false, message: 'Item not found or unauthorized' });
    }

    const user = await UserModel.findById(req.userId);

    // Attempt to delete from Google if it is synced
    if (event.google_event_id && user && user.refresh_token) {
      try {
        if (event.event_type === 'task') {
          // Delete via Tasks API
          await googleService.deleteTask(req.userId, user.refresh_token, event.google_event_id, event.task_list_id);
        } else if (event.event_type === 'birthday') {
          // Google's Birthday calendar is READ-ONLY via the Calendar API.
          // We cannot delete the Google Contact here. We just skip the Google API call 
          // and let it delete from our local DB so the user doesn't see it in Planix anymore.
          console.log("Birthday deletion skipped for Google API. Deleting locally only.");
        } else {
          // Delete standard Event via Calendar API
          await googleService.deleteCalendarEvent(req.userId, user.refresh_token, event.google_event_id);
        }
      } catch (googleErr) {
        console.error('Failed to delete from Google:', googleErr.message);
        // We do not throw here, so we can still delete it from our local database.
      }
    }

    // Always delete from our local database
    await EventModel.delete(eventId);
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
};

// 4. Update an event or task status
exports.updateEventStatus = async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body;

  try {
    const event = await EventModel.findById(eventId);
    if (!event || event.user_id !== req.userId) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const user = await UserModel.findById(req.userId);
    if (event.google_event_id && user && user.refresh_token) {
      try {
        if (event.event_type === 'task') {
          await googleService.updateTask(req.userId, user.refresh_token, event.google_event_id, event.task_list_id, { status });
        }
      } catch (googleErr) {
        console.error('Failed to update status on Google:', googleErr.message);
      }
    }

    const pool = require('../config/db');
    const result = await pool.query('UPDATE events SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, eventId]);

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ success: false, message: 'Failed to update item status' });
  }
};

// 5. Fully update an event or task
exports.updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, startTime, endTime, location, color, recurrence, visibility, allDay, meetLink, guests, reminders } = req.body;

  try {
    const event = await EventModel.findById(eventId);
    if (!event || event.user_id !== req.userId) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const user = await UserModel.findById(req.userId);
    if (event.google_event_id && user && user.refresh_token) {
      try {
        if (event.event_type === 'task') {
          await googleService.updateTask(req.userId, user.refresh_token, event.google_event_id, event.task_list_id, { title, description, startTime });
        } else if (event.event_type !== 'birthday') {
          await googleService.updateCalendarEvent(req.userId, user.refresh_token, event.google_event_id, {
            summary: title,
            description,
            location,
            colorId: '1', // fallback since we simplified google color mapping
            visibility: visibility !== 'default' ? visibility : undefined,
            start: allDay ? { date: startTime.split('T')[0] } : { dateTime: startTime, timeZone: 'UTC' },
            end: allDay ? { date: (endTime || startTime).split('T')[0] } : { dateTime: endTime, timeZone: 'UTC' }
          });
        }
      } catch (googleErr) {
        console.error('Failed to update event on Google:', googleErr.message);
      }
    }

    const pool = require('../config/db');
    const result = await pool.query(
      `UPDATE events 
       SET title = $1, description = $2, start_time = $3, end_time = $4, location = $5, color = $6, recurrence = $7, visibility = $8, all_day = $9, meet_link = $10, updated_at = NOW() 
       WHERE id = $11 RETURNING *`,
      [title, description, startTime, endTime, location, color, recurrence, visibility, allDay, meetLink, eventId]
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, message: 'Failed to update item' });
  }
};