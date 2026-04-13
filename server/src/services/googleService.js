const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Build an authenticated Google OAuth client for a specific user
function getAuthClient(refreshToken) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

const googleService = {
  // Fetch events from all calendars (including Birthdays, Holidays, Primary)
  async listCalendarEvents(userId, refreshToken) {
    const auth = getAuthClient(refreshToken);
    const calendar = google.calendar({ version: 'v3', auth });

    const currentYearStart = new Date(new Date().getFullYear(), 0, 1);
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    try {
      const { data: { items: calendars } } = await calendar.calendarList.list();
      
      // Parallelize!
      const calendarPromises = calendars.map(async (cal) => {
        try {
          const response = await calendar.events.list({
            calendarId: cal.id,
            timeMin: currentYearStart.toISOString(),
            timeMax: sixMonthsLater.toISOString(),
            maxResults: 200,
            singleEvents: true,
            showDeleted: true,
            orderBy: 'startTime',
          });

          const isCalendarHoliday = cal.id.toLowerCase().includes('holiday') || 
                                    cal.id.toLowerCase().includes('festival') || 
                                    cal.id.toLowerCase().includes('google.com/calendar/static/holidays') ||
                                    cal.summary.toLowerCase().includes('holiday') || 
                                    cal.summary.toLowerCase().includes('festival');
          const isCalendarBirthday = cal.id.includes('contacts@group.v.calendar.google.com') || cal.summary.toLowerCase().includes('birthday');
          
          return (response.data.items || []).map(ev => {
            const isEventBirthday = isCalendarBirthday || (ev.summary && ev.summary.toLowerCase().includes('birthday'));
            const isEventHoliday = isCalendarHoliday || (ev.summary && (ev.summary.toLowerCase().includes('holiday') || ev.summary.toLowerCase().includes('festival')));
            
            return {
              ...ev,
              planixEventType: isEventBirthday ? 'birthday' : (isEventHoliday ? 'holiday' : 'event')
            };
          });
        } catch (err) {
          console.error(`Skipping calendar fetching due to permission: ${cal.summary}`);
          return [];
        }
      });

      const results = await Promise.all(calendarPromises);
      return results.flat();
    } catch (err) {
      console.error('Failed calendar fetch', err.message);
      return [];
    }
  },

  // Fetch all tasks from all lists
  async listTasks(userId, refreshToken) {
    const auth = getAuthClient(refreshToken);
    const tasksService = google.tasks({ version: 'v1', auth });

    try {
      const { data: { items: taskLists } } = await tasksService.tasklists.list();
      
      // Parallelize!
      const taskPromises = (taskLists || []).map(async (list) => {
        try {
          const response = await tasksService.tasks.list({
            tasklist: list.id,
            showCompleted: true,
            showHidden: false,
            showDeleted: true,
            maxResults: 150,
          });

          return (response.data.items || []).map(t => ({
            ...t,
            planixEventType: 'task',
            planixTaskListId: list.id
          }));
        } catch (e) {
          console.error(`Skipping tasklist fetching ${list.title}`);
          return [];
        }
      });

      const results = await Promise.all(taskPromises);
      return results.flat();
    } catch (err) {
      console.error('Failed to list tasks', err);
      return [];
    }
  },

  // Create an event
  async createCalendarEvent(userId, refreshToken, eventData) {
    const auth = getAuthClient(refreshToken);
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      location: eventData.location || '',
      colorId: mapColorToGoogleColorId(eventData.colorId),
      visibility: eventData.visibility !== 'default' ? eventData.visibility : undefined,
    };

    if (eventData.allDay) {
      event.start = { date: eventData.startTime.split('T')[0] };
      event.end = { date: (eventData.endTime || eventData.startTime).split('T')[0] };
    } else {
      event.start = { dateTime: eventData.startTime, timeZone: 'UTC' };
      event.end = { dateTime: eventData.endTime, timeZone: 'UTC' };
    }

    if (eventData.recurrence && eventData.recurrence !== 'none') {
      event.recurrence = [buildRRule(eventData.recurrence)];
    }

    if (eventData.meetLink) {
      event.conferenceData = {
        createRequest: {
          requestId: `planix-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    if (eventData.guests && eventData.guests.length > 0) {
       event.attendees = eventData.guests.map(email => ({ email }));
    }

    if (eventData.reminders && eventData.reminders.length > 0) {
      event.reminders = {
        useDefault: false,
        overrides: eventData.reminders.map(r => ({
          method: 'popup',
          minutes: parseInt(r.value) || 15,
        })),
      };
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: eventData.meetLink ? 1 : 0,
      sendUpdates: eventData.guests?.length > 0 ? 'all' : 'none',
    });

    return response.data;
  },

  // Update calendar event
  async updateCalendarEvent(userId, refreshToken, googleEventId, updates) {
    const auth = getAuthClient(refreshToken);
    const calendar = google.calendar({ version: 'v3', auth });
    const response = await calendar.events.patch({
      calendarId: 'primary',
      eventId: googleEventId,
      resource: updates,
    });
    return response.data;
  },

  // Delete calendar event
  async deleteCalendarEvent(userId, refreshToken, googleEventId) {
    const auth = getAuthClient(refreshToken);
    const calendar = google.calendar({ version: 'v3', auth });
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleEventId,
      sendUpdates: 'none',
    });
  },

  // --- NEW TASKS API ---

  async createTask(userId, refreshToken, taskData) {
    const auth = getAuthClient(refreshToken);
    const tasksService = google.tasks({ version: 'v1', auth });

    let payload = {
      title: taskData.title,
      notes: taskData.description || '',
    };

    if (taskData.startTime) {
      // Due date is RFC 3339 timestamp.
      payload.due = new Date(taskData.startTime).toISOString();
    }

    const response = await tasksService.tasks.insert({
      tasklist: '@default',
      resource: payload
    });
    return response.data;
  },

  async updateTask(userId, refreshToken, taskId, taskListId, taskData) {
    const auth = getAuthClient(refreshToken);
    const tasksService = google.tasks({ version: 'v1', auth });

    // Allow status updating or full update
    let payload = { ...taskData };
    if (taskData.status && (taskData.status === 'completed' || taskData.status === 'needsAction')) {
      payload.status = taskData.status;
    }

    const response = await tasksService.tasks.patch({
      tasklist: taskListId || '@default',
      task: taskId,
      resource: payload
    });
    return response.data;
  },

  async deleteTask(userId, refreshToken, taskId, taskListId) {
    const auth = getAuthClient(refreshToken);
    const tasksService = google.tasks({ version: 'v1', auth });
    await tasksService.tasks.delete({
      tasklist: taskListId || '@default',
      task: taskId
    });
  },

  async listBirthdayEvents(userId, refreshToken) {
    try {
      const auth = getAuthClient(refreshToken);
      const calendar = google.calendar({ version: 'v3', auth });

      // Step 1: We must find the specific ID for the user's Birthday calendar.
      const calendarList = await calendar.calendarList.list();
      const birthdayCalendar = (calendarList.data.items || []).find(
        (cal) => cal.id === '#contacts@group.v.calendar.google.com' || cal.summary.toLowerCase().includes('birthdays')
      );

      if (!birthdayCalendar) {
        return []; // The user doesn't have a birthday calendar enabled
      }

      // Step 2: Fetch the events from that specific calendar ID
      const response = await calendar.events.list({
        calendarId: birthdayCalendar.id,
        timeMin: new Date().toISOString(),
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching Google Birthdays:', error.message);
      return []; // Return empty array so the main sync doesn't crash
    }
  }
};

function mapColorToGoogleColorId(color) {
  const map = {
    blue: '1',    // Lavender
    purple: '3',  // Grape
    teal: '8',    // Teal
    amber: '5',   // Banana
    rose: '11',   // Tomato
    lime: '10',   // Sage
  };
  return map[color] || '1';
}

function buildRRule(recurrence) {
  const map = {
    daily: 'RRULE:FREQ=DAILY',
    weekdays: 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
    weekly: 'RRULE:FREQ=WEEKLY',
    biweekly: 'RRULE:FREQ=WEEKLY;INTERVAL=2',
    monthly: 'RRULE:FREQ=MONTHLY',
    yearly: 'RRULE:FREQ=YEARLY',
  };
  return map[recurrence] || 'RRULE:FREQ=WEEKLY';
}

module.exports = googleService;