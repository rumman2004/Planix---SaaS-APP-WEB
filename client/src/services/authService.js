import api from './api';

export const authService = {
  // Triggers the Google OAuth redirect
  loginWithGoogle: () => {
    const baseURL = import.meta.env.VITE_BACKEND_API_URI || 'http://localhost:5000/api';
    window.location.href = `${baseURL}/auth/google`;
  },

  // Fetches the currently logged-in user's profile
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data; // Returns { success: true, data: { id, name, email, ... } }
  },

  // Clears the HTTP-only cookie on the backend
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};