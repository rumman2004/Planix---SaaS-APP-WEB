import api from './api';

export const eventService = {
  // Fetch all events for the logged-in user
  getEvents: async () => {
    const response = await api.get('/events');
    return response.data; 
  },

  // Create a new event
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Delete a specific event by its ID
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  }
};