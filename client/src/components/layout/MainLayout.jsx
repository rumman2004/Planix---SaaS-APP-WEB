import { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';
import { EventContext } from '../../context/EventContext';
import { ReminderProvider } from '../../context/ReminderContext';

function LayoutInner() {
  const { user, logout } = useContext(AuthContext);
  const { fetchEvents } = useContext(EventContext);
  const [syncing, setSyncing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetchEvents();
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      setTimeout(() => setSyncing(false), 800);
    }
  };

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-bg overflow-hidden relative">
      {/* Background orbs */}
      <div className="fixed rounded-full filter blur-[100px] pointer-events-none animate-spin-slow w-[600px] h-[600px] bg-primary/10 -top-[150px] left-[200px]" style={{ zIndex: 0 }} />
      <div className="fixed rounded-full filter blur-[100px] pointer-events-none animate-spin-slow w-[450px] h-[450px] bg-secondary/10 -bottom-[80px] -right-[60px]" style={{ zIndex: 0, animationDirection: 'reverse' }} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-50 md:relative transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 h-full flex-shrink-0`}>
        <Sidebar
          user={user}
          onSignOut={handleSignOut}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full z-10 relative">
        <Navbar
          user={user}
          syncing={syncing}
          onSync={handleSync}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Wrap with ReminderProvider so Navbar can access reminder count
export default function MainLayout() {
  return (
    <ReminderProvider>
      <LayoutInner />
    </ReminderProvider>
  );
}