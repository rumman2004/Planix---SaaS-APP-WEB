import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Plus, Bell, LogOut, X, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar,        label: 'Calendar',  path: '/calendar'  },
  { icon: Plus,            label: 'Add Event', path: '/add-event' },
  { icon: Bell,            label: 'Reminders', path: '/reminders' },
];

export default function Sidebar({ user, onSignOut, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.(); // Close drawer on mobile after navigation
  };

  return (
    <aside className={`h-full flex flex-col py-5 md:py-8 bg-surface-container-low/95 backdrop-blur-2xl z-50 md:rounded-r-[2rem] shadow-[10px_0_30px_rgba(0,102,102,0.05)] transition-all duration-300 border-r border-outline-variant/15 ${collapsed ? 'w-16 md:w-20' : 'w-[240px] md:w-[260px] max-w-[80vw]'}`}>
      
      {/* Mobile Close Button 
      {onClose && (
        <button 
          className="md:hidden absolute top-4 right-4 p-1.5 bg-surface-container rounded-full text-on-surface hover:bg-surface-container-high transition-colors" 
          onClick={onClose}
        >
          <X size={18} />
        </button>
      )} */}

      {/* Brand */}
      <div 
        className={`px-5 md:px-8 mb-6 md:mb-10 flex items-center ${collapsed ? 'justify-center px-0' : ''} cursor-pointer`} 
        onClick={() => handleNavigate('/dashboard')}
      >
         {collapsed ? (
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-container rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
              <CalendarDays className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            </div>
         ) : (
            <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-container rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                <CalendarDays className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-primary font-headline truncate">Planix</h1>
                <p className="text-[8px] md:text-[9px] font-label uppercase tracking-widest text-outline-variant font-bold truncate">CoachPro Edition</p>
              </div>
            </div>
         )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden pt-2 scrollbar-hide px-3 md:px-4">
        {NAV.map(({ icon: Icon, label, path }) => {
          const active = location.pathname.startsWith(path);
          return (
            <button
              key={path}
              className={`w-full flex items-center px-3 md:px-4 py-2.5 md:py-3.5 rounded-[12px] md:rounded-[1rem] transition-all duration-300 border-0 ${
                active 
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/20 translate-x-1' 
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface hover:translate-x-1 bg-transparent'
              } ${collapsed ? 'justify-center mx-auto w-10 h-10 md:w-12 md:h-12 p-0' : ''}`}
              onClick={() => handleNavigate(path)}
              title={collapsed ? label : undefined}
            >
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${collapsed ? '' : 'mr-3 md:mr-4 shrink-0'}`} strokeWidth={active ? 2.5 : 2} />
              {!collapsed && <span className={`font-semibold font-headline text-xs md:text-[13px] tracking-wide truncate`}>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle (Desktop only) */}
      <div className="hidden md:flex px-6 mt-4 mb-4">
        <button 
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-center p-2.5 rounded-xl border border-outline-variant/30 text-outline hover:bg-surface-container hover:text-on-surface transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Bottom Section (Logout Only) */}
      <div className={`px-3 md:px-4 mt-auto space-y-2 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        <button 
          className={`flex items-center text-error px-3 md:px-4 py-2.5 md:py-3.5 rounded-[12px] md:rounded-[1rem] hover:bg-error/10 transition-all duration-300 w-full mx-auto border-0 ${collapsed ? 'justify-center w-10 h-10 md:w-12 md:h-12 p-0' : ''}`}
          onClick={onSignOut}
          title="Logout"
        >
          <LogOut className={`w-4 h-4 md:w-5 md:h-5 ${collapsed ? '' : 'mr-3 md:mr-4 shrink-0'}`} strokeWidth={2} />
          {!collapsed && <span className="font-semibold font-headline text-xs md:text-[13px] truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
}