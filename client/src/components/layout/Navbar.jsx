import { Bell, Menu } from 'lucide-react';
import { useContext } from 'react';
import { ReminderContext } from '../../context/ReminderContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user, syncing, onSync, onMenuToggle }) {
  const { reminders } = useContext(ReminderContext) || { reminders: [] };
  const navigate = useNavigate();

  const pendingCount = reminders.filter(r => r.active).length;

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-4 md:px-10 py-4 w-full bg-surface/70 backdrop-blur-xl border-b border-outline-variant/20">
      
      {/* Left Side: Mobile Hamburger Menu */}
      <div className="flex items-center">
        <button 
          className="md:hidden p-2 -ml-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors" 
          onClick={onMenuToggle} 
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right Side: Notifications & Avatar */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Sync Status (Hidden on very small screens) */}
        {onSync && (
          <button 
            onClick={onSync}
            disabled={syncing}
            className={`hidden sm:flex text-xs font-semibold px-3 py-1.5 rounded-full border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container transition-colors ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {syncing ? 'Syncing...' : 'Synced'}
          </button>
        )}

        {/* Notifications */}
        <button 
          className="p-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-all duration-300 relative" 
          title="Notifications"
          onClick={() => navigate('/reminders')}
        >
          <Bell size={18} />
          {pendingCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface animate-pulse" />
          )}
        </button>

        {/* User Avatar */}
        <div 
          className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-primary-container overflow-hidden ring-2 ring-surface-container-highest cursor-pointer shadow-sm" 
          title={user?.name}
        >
          {user?.avatar_url ? (
            <img alt="User Profile" className="w-full h-full object-cover" src={user.avatar_url} referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary text-on-primary font-bold text-lg">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}