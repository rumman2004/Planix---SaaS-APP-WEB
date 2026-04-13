import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/reminders');
      const raw = response.data.data || [];
      const normalized = raw.map(r => ({
        id: r.id,
        event: r.event_title || r.message || 'Reminder',
        eventId: r.event_id,
        time: r.remind_at
          ? new Date(r.remind_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          : '',
        remindAt: r.remind_at,
        message: r.message || '',
        recur: r.recurrence || 'none',
        active: r.status === 'pending',
        status: r.status,
        createdAt: r.created_at,
      }));
      setReminders(normalized);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reminders');
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const createReminder = async ({ eventId, remindAt, message, recurrence }) => {
    try {
      const response = await api.post('/reminders', { eventId, remindAt, message, recurrence });
      await fetchReminders();
      return response.data.data;
    } catch (err) {
      console.error('Error creating reminder:', err);
      throw err;
    }
  };

  const toggleReminder = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'paused' : 'pending';
      await api.patch(`/reminders/${id}`, { status: newStatus });
      setReminders(prev =>
        prev.map(r => r.id === id ? { ...r, active: newStatus === 'pending', status: newStatus } : r)
      );
    } catch (err) {
      // Optimistic: toggle locally even if API call fails
      setReminders(prev =>
        prev.map(r => r.id === id ? { ...r, active: !r.active } : r)
      );
    }
  };

  const deleteReminder = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting reminder:', err);
      throw err;
    }
  };

  const markCompleted = async (id) => {
    try {
      await api.patch(`/reminders/${id}/complete`);
      setReminders(prev =>
        prev.map(r => r.id === id ? { ...r, active: false, status: 'completed' } : r)
      );
    } catch (err) {
      console.error('Error marking reminder:', err);
    }
  };

  return (
    <ReminderContext.Provider value={{
      reminders,
      loading,
      error,
      fetchReminders,
      createReminder,
      toggleReminder,
      deleteReminder,
      markCompleted,
    }}>
      {children}
    </ReminderContext.Provider>
  );
};