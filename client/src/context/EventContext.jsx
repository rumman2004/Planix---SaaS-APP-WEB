import React, { createContext, useState, useCallback, useContext } from 'react';
import api from '../services/api';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  // Fetch events from your backend (which reads from Google Calendar/DB)
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/events');
      const raw = response.data.data || [];

      // Normalize Google Calendar / Database event shapes to our internal shape
      const normalized = raw.map(ev => {
        // 1. Bulletproof Date Extraction (Catches Events, Tasks, and Birthdays)
        const rawDate = ev.start_time || ev.start?.dateTime || ev.start?.date || ev.due || ev.date;
        // Fallback to today if a task has absolutely no due date
        const d = rawDate ? new Date(rawDate) : new Date(); 

        // 2. Identify All-Day items (Birthdays and Tasks are usually all-day)
        const eventType = ev.event_type || ev.eventType || ev.planixEventType || 'event';
        const isAllDay = ev.all_day || ['task', 'birthday', 'holiday'].includes(eventType) || !!(ev.start?.date && !ev.start?.dateTime);

        // 3. Format times ONLY if it's not an all-day event
        let startTimeStr = '';
        let endTimeStr = '';

        if (!isAllDay) {
          if (ev.start_time || ev.start?.dateTime) {
             startTimeStr = new Date(ev.start_time || ev.start.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          }
          if (ev.end_time || ev.end?.dateTime) {
             endTimeStr = new Date(ev.end_time || ev.end.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          }
        }

        return {
          id: ev.id || ev.google_event_id,
          google_event_id: ev.google_event_id || ev.id,
          title: ev.title || ev.summary || 'Untitled',
          description: ev.description || '',
          // Use .toISOString() so the Dashboard grouping logic NEVER fails
          date: d.toISOString(), 
          startTime: startTimeStr,
          endTime: endTimeStr,
          allDay: isAllDay,
          location: ev.location || '',
          color: ev.color || colorFromString(ev.title || ''),
          recurrence: ev.recurrence || 'none',
          visibility: ev.visibility || ev.colorId || 'default',
          reminders: ev.reminders || [],
          status: ev.status || 'confirmed',
          organizer: ev.organizer || null,
          attendees: ev.attendees || [],
          meetLink: ev.hangoutLink || ev.meet_link || null,
          eventType: eventType,
          taskListId: ev.task_list_id || ev.taskListId || null,
        };
      });

      setEvents(normalized);
      setLastSynced(new Date());
    } catch (err) {
      console.error('Context Fetch Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = async (eventData) => {
    try {
      const payload = {
        title: eventData.title,
        description: eventData.description,
        startTime: (eventData.allDay || !eventData.startTime)
          ? eventData.date
          : `${eventData.date}T${eventData.startTime}:00`,
        endTime: (eventData.allDay || !eventData.startTime)
          ? (eventData.endDate || eventData.date)
          : `${eventData.endDate || eventData.date}T${eventData.endTime || eventData.startTime}:00`,
        location: eventData.location,
        color: eventData.color,
        recurrence: eventData.recurrence,
        visibility: eventData.visibility,
        allDay: eventData.allDay,
        meetLink: eventData.meetLink,
        guests: eventData.guests,
        reminders: eventData.reminders,
        eventType: eventData.eventType || 'event',
        taskListId: eventData.taskListId || null,
      };
      const response = await api.post('/events', payload);
      const newEvent = response.data.data;
      
      await fetchEvents(); // Refresh to get synced Google data
      return newEvent;
    } catch (err) {
      console.error('Error adding event:', err);
      throw err;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      // Optimistic UI update (removes it from screen instantly while backend works)
      setEvents(prev => prev.filter(e => e.id !== eventId && e.google_event_id !== eventId));
      
      // Fire delete request to backend (which deletes from DB + Google)
      await api.delete(`/events/${eventId}`);
    } catch (err) {
      console.error('Error deleting event:', err);
      // If it fails, refresh the list to put the event back on the screen
      fetchEvents(); 
      throw err;
    }
  };

  const updateEvent = async (eventId, updatedData) => {
    try {
      // Create backend-friendly payload
      const payload = {
        title: updatedData.title,
        description: updatedData.description,
        startTime: (updatedData.allDay || !updatedData.startTime)
          ? updatedData.date
          : `${updatedData.date}T${updatedData.startTime}:00`,
        endTime: (updatedData.allDay || !updatedData.startTime)
          ? (updatedData.endDate || updatedData.date)
          : `${updatedData.endDate || updatedData.date}T${updatedData.endTime || updatedData.startTime}:00`,
        location: updatedData.location,
        color: updatedData.color,
        recurrence: updatedData.recurrence,
        visibility: updatedData.visibility,
        allDay: updatedData.allDay,
        meetLink: updatedData.meetLink,
        guests: updatedData.guests,
        reminders: updatedData.reminders,
        eventType: updatedData.eventType || 'event',
        taskListId: updatedData.taskListId || null,
      };

      const response = await api.put(`/events/${eventId}`, payload);
      const updatedEvent = response.data.data;
      await fetchEvents();
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  const updateEventStatus = async (eventId, status) => {
    try {
       // Optimistic UI update
       setEvents(prev => prev.map(e => e.id === eventId || e.google_event_id === eventId ? { ...e, status } : e));
       
       await api.patch(`/events/${eventId}/status`, { status });
    } catch (err) {
       console.error('Error updating status:', err);
       fetchEvents(); // Revert on failure
       throw err;
    }
  };

  return (
    <EventContext.Provider value={{
      events,
      loading,
      error,
      lastSynced,
      fetchEvents,
      addEvent,
      deleteEvent,
      updateEvent,
      updateEventStatus,
    }}>
      {children}
    </EventContext.Provider>
  );
};

// Deterministically pick a color for events that don't have one
function colorFromString(str) {
  const colors = ['blue', 'purple', 'teal', 'amber', 'rose', 'lime'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}