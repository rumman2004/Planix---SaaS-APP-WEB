const EventModel = require('../models/eventModel');
const googleService = require('../services/googleService');
const UserModel = require('../models/userModel');

// 1. Get all events, tasks, and birthdays — syncs Google -> Local DB
exports.getEvents = async (req, res) => {
  console.log('[Events] getEvents called for userId:', req.userId);
  console.log('[Events] Auth header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.refresh_token) {
      try {
        console.log(`[Sync] Starting parallel fetch for user: ${req.userId}`);
        const startTime = Date.now();

        const [googleEvents, googleTasks, birthdayEvents] = await Promise.all([
          googleService.listCalendarEvents(req.userId, user.refresh_token),
          googleService.listTasks(req.userId, user.refresh_token),
          googleService.listBirthdayEvents(req.userId, user.refresh_token)
        ]);

        console.log(`[Sync] Fetched: ${googleEvents.length} events, ${googleTasks.length} tasks, ${birthdayEvents.length} bdays in ${Date.now() - startTime}ms`);

        const allItems = [
          ...googleEvents.map(e => ({ type: 'event', data: e })),
          ...googleTasks.map(t => ({ type: 'task', data: t })),
          ...birthdayEvents.map(b => ({ type: 'birthday', data: b }))
        ];

        await Promise.all(allItems.map(async (item) => {
          const { type, data } = item;
          try {
            if (type === 'event') {
              const isHoliday = data.planixEventType === 'holiday';
              await EventModel.upsertFromGoogle({
                userId: req.userId,
                googleEventId: data.id,
                title: data.summary || 'Untitled',
                description: data.description || '',
                startTime: data.start?.dateTime || data.start?.date,
                endTime: data.end?.dateTime || data.end?.date,
                location: data.location || '',
                color: isHoliday ? 'indigo' : (data.colorId || 'blue'),
                recurrence: data.recurrence ? data.recurrence[0] : 'none',
                visibility: data.visibility || 'default',
                status: data.status || 'confirmed',
                allDay: !data.start?.dateTime,
                meetLink: data.hangoutLink || null,
                organizer: data.organizer ? JSON.stringify(data.organizer) : null,
                attendees: data.attendees ? JSON.stringify(data.attendees) : null,
                eventType: data.planixEventType || 'event'
              });
            } else if (type === 'task') {
              await EventModel.upsertFromGoogle({
                userId: req.userId,
                googleEventId: data.id,
                title: data.title || 'Untitled Task',
                description: data.notes || '',
                startTime: data.due || null,
                endTime: data.due || null,
                status: data.deleted ? 'cancelled' : (data.status === 'completed' ? 'completed' : 'confirmed'),
                allDay: true,
                eventType: 'task',
                taskListId: data.planixTaskListId
              });
            } else if (type === 'birthday') {
              await EventModel.upsertFromGoogle({
                userId: req.userId,
                googleEventId: data.id,
                title: data.summary || 'Birthday',
                description: data.description || '',
                startTime: data.start?.dateTime || data.start?.date,
                endTime: data.end?.dateTime || data.end?.date,
                allDay: true,
                eventType: 'birthday',
                status: 'confirmed',
                color: 'rose'
              });
            }
          } catch (upsertErr) {
            console.error(`[Sync] Upsert failed for item ${data.id}:`, upsertErr.message);
          }
        }));

        const syncedIds = allItems.map(item => item.data.id).filter(Boolean);
        if (syncedIds.length > 0) {
          const pool = require('../config/db');
          // IMPORTANT: Only cancel tasks that were fetched from Google (have a google_event_id)
          // but are no longer returned by the API. Tasks without a google_event_id were
          // created locally and should never be cancelled by the sync process.
          await pool.query(
            `UPDATE events SET status = 'cancelled'
             WHERE user_id = $1
               AND event_type = 'task'
               AND google_event_id IS NOT NULL
               AND google_event_id != ALL($2 ::text[])`,
            [req.userId, syncedIds]
          );
          // For calendar events (birthdays, holidays, regular events):
          // Only cancel events whose start_time falls WITHIN the sync window we just fetched.
          // Events outside the window were simply not fetched — do NOT cancel them.
          const syncWindowStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
          const syncWindowEnd = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString();
          await pool.query(
            `UPDATE events SET status = 'cancelled'
             WHERE user_id = $1
               AND event_type IN ('event', 'birthday', 'holiday')
               AND google_event_id IS NOT NULL
               AND start_time >= $3
               AND start_time <= $4
               AND google_event_id != ALL($2 ::text[])`,
            [req.userId, syncedIds, syncWindowStart, syncWindowEnd]
          );
        }

      } catch (googleErr) {
        console.error('[Sync] Google sync critical failure:', googleErr.message);
        // ✅ Still return local DB events even if Google sync fails
      }
    } else {
      console.warn('[Sync] No refresh token found for user:', req.userId);
    }

    const events = await EventModel.findByUserId(req.userId);
    console.log(`[Events] Returning ${events.length} events for user: ${req.userId}`);
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

  console.log('[Events] Creating event:', { title, eventType, startTime });

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
          console.log('[Events] ✅ Task created on Google:', googleEventId);
        } else {
          const googleEvent = await googleService.createCalendarEvent(req.userId, user.refresh_token, {
            title, description, startTime, endTime, location,
            colorId: color, recurrence, visibility, allDay, meetLink,
            guests: guests || [],
            reminders: reminders || [],
          });
          googleEventId = googleEvent.id;
          console.log('[Events] ✅ Event created on Google:', googleEventId);
        }
      } catch (googleErr) {
        console.error('[Events] ❌ Failed to create on Google:', googleErr.message);
      }
    }

    const newEvent = await EventModel.create({
      userId: req.userId,
      title, description, startTime, endTime, location, color,
      recurrence, visibility,
      allDay: isTask ? true : allDay,
      meetLink, googleEventId,
      eventType: eventType || 'event',
      taskListId
    });

    console.log('[Events] ✅ Event saved to DB:', newEvent.id);
    res.status(201).json({ success: true, data: newEvent });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Failed to create item' });
  }
};

// 3. Delete an event, task, or birthday
exports.deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  console.log('[Events] Deleting event:', eventId, 'for user:', req.userId);

  try {
    const event = await EventModel.findById(eventId);
    if (!event || event.user_id !== req.userId) {
      return res.status(404).json({ success: false, message: 'Item not found or unauthorized' });
    }

    const user = await UserModel.findById(req.userId);

    if (event.google_event_id && user && user.refresh_token) {
      try {
        if (event.event_type === 'task') {
          await googleService.deleteTask(req.userId, user.refresh_token, event.google_event_id, event.task_list_id);
          console.log('[Events] ✅ Task deleted from Google');
        } else if (event.event_type === 'birthday') {
          console.log('[Events] Birthday deletion skipped for Google. Deleting locally only.');
        } else {
          await googleService.deleteCalendarEvent(req.userId, user.refresh_token, event.google_event_id);
          console.log('[Events] ✅ Event deleted from Google');
        }
      } catch (googleErr) {
        const errorMsg = googleErr.message || '';
        if (errorMsg.includes('404') || errorMsg.toLowerCase().includes('not found')) {
          console.log(`[Events] Item already deleted from Google. Proceeding local delete.`);
        } else {
          console.error('[Events] ❌ Failed to delete from Google:', errorMsg);
        }
      }
    }

    await EventModel.delete(eventId);
    console.log('[Events] ✅ Event deleted from DB:', eventId);
    res.status(200).json({ success: true, message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
};

// 4. Update event status
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
        console.error('[Events] Failed to update status on Google:', googleErr.message);
      }
    }

    const pool = require('../config/db');
    const result = await pool.query(
      'UPDATE events SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, eventId]
    );

    res.status(200).json({ success: true, data: result.rows[0] });

  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ success: false, message: 'Failed to update item status' });
  }
};

// 5. Fully update an event
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
            colorId: '1',
            visibility: visibility !== 'default' ? visibility : undefined,
            start: allDay ? { date: startTime.split('T')[0] } : { dateTime: startTime, timeZone: 'UTC' },
            end: allDay ? { date: (endTime || startTime).split('T')[0] } : { dateTime: endTime, timeZone: 'UTC' }
          });
        }
      } catch (googleErr) {
        console.error('[Events] Failed to update on Google:', googleErr.message);
      }
    }

    const pool = require('../config/db');
    const result = await pool.query(
      `UPDATE events 
       SET title = $1, description = $2, start_time = $3, end_time = $4, 
           location = $5, color = $6, recurrence = $7, visibility = $8, 
           all_day = $9, meet_link = $10, updated_at = NOW() 
       WHERE id = $11 RETURNING *`,
      [title, description, startTime, endTime, location, color, recurrence, visibility, allDay, meetLink, eventId]
    );

    console.log('[Events] ✅ Event updated in DB:', eventId);
    res.status(200).json({ success: true, data: result.rows[0] });

  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, message: 'Failed to update item' });
  }
};