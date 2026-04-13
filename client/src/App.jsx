import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { EventProvider } from './context/EventContext';

// Layout & UI
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/ui/loadingSpiner';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import Login from './pages/Login';
import Registration from './pages/Registration';
import TermsOfService from './pages/public/TermsofService';
import PrivacyPolicy from './pages/public/PrivacyPolicy';

// Protected User Pages
import Dashboard from './pages/User/Dashboard';
import Calendar from './pages/User/Calendar';
import AddEvent from './pages/User/AddEvent';
import Home from './pages/User/Home';
import Reminders from './pages/User/Reminders';
import AddReminder from './pages/User/AddReminder';

// Protected Route Wrapper — must be inside AuthProvider
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#070b12',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Router>
      {/* AuthProvider wraps everything so ProtectedRoute can access it */}
      <AuthProvider>
        <Routes>
          {/* ── Public routes ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          {/* ── Protected routes ── */}
          <Route
            element={
              <ProtectedRoute>
                <EventProvider>
                  <MainLayout />
                </EventProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/edit-event/:id" element={<AddEvent />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/add-reminder" element={<AddReminder />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;