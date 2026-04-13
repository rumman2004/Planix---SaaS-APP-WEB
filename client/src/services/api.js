import axios from 'axios';

// Create an Axios instance pointing to your Express backend
const api = axios.create({
  // Use the environment variable, or fallback to localhost if it's missing
  baseURL: import.meta.env.VITE_BACKEND_API_URI || 'http://localhost:5000/api',
  withCredentials: true, // CRITICAL: Allows Vite to send/receive cookies from the backend
});

export default api;