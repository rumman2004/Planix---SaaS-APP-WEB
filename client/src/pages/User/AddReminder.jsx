import { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, CalendarDays, Clock, Bell, 
  Check, Loader, AlertCircle, Calendar 
} from 'lucide-react';
import { Button, Modal } from '../../components/ui';
import { EventContext } from '../../context/EventContext';
import { ReminderContext } from '../../context/ReminderContext';

const REMINDER_OPTS = [
  { value: '5',    label: '5 mins before' },
  { value: '15',   label: '15 mins before' },
  { value: '30',   label: '30 mins before' },
  { value: '60',   label: '1 hour before' },
  { value: '120',  label: '2 hours before' },
  { value: '1440', label: '1 day before' },
];

export default function AddReminder() {
  const navigate = useNavigate();
  const { events } = useContext(EventContext);
  const { createReminder } = useContext(ReminderContext) || {};

  // Form State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [remindType, setRemindType] = useState('preset'); // 'preset' | 'custom'
  const [presetMinutes, setPresetMinutes] = useState('15');
  const [customTime, setCustomTime] = useState('');
  const [message, setMessage] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // --- Filter & Sort Upcoming Events ---
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    // Only show events that haven't happened yet (from today onwards)
    const future = (events || []).filter(ev => {
      if (!ev.date) return false;
      const evDate = new Date(ev.date);
      // If it has a specific time, check if it's strictly in the future
      if (!ev.allDay && ev.startTime) {
        const [h, m] = ev.startTime.split(':');
        evDate.setHours(parseInt(h), parseInt(m), 0);
        return evDate >= now;
      }
      // Otherwise just check if the date is today or later
      evDate.setHours(23, 59, 59);
      return evDate >= now;
    });

    // Apply Search Filter
    const filtered = future.filter(ev => 
      (ev.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.eventType || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort chronologically
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, searchTerm]);

  const selectedEvent = upcomingEvents.find(e => e.id === selectedEventId);

  // Auto-fill message when an event is selected
  const handleSelectEvent = (ev) => {
    setSelectedEventId(ev.id);
    if (!message || message.startsWith('Upcoming:')) {
      setMessage(`Upcoming: ${ev.title}`);
    }
  };

  const handleSave = async () => {
    setError('');
    
    if (!selectedEventId) {
      setError('Please select an event, task, or birthday first.');
      return;
    }

    let finalRemindAt = '';

    if (remindType === 'custom') {
      if (!customTime) {
        setError('Please select a custom date and time.');
        return;
      }
      finalRemindAt = new Date(customTime).toISOString();
    } else {
      // Calculate preset time based on event start
      let eventStart = new Date(selectedEvent.date);
      if (!selectedEvent.allDay && selectedEvent.startTime) {
        const [h, m] = selectedEvent.startTime.split(':');
        eventStart.setHours(parseInt(h), parseInt(m), 0, 0);
      } else {
        // If all day, calculate preset from 9:00 AM of that day
        eventStart.setHours(9, 0, 0, 0); 
      }
      
      const fireTime = new Date(eventStart.getTime() - parseInt(presetMinutes) * 60000);
      
      if (fireTime < new Date()) {
        setError('This preset time is in the past! Choose a smaller preset or use Custom time.');
        return;
      }
      finalRemindAt = fireTime.toISOString();
    }

    if (!message.trim()) {
      setError('Please enter a reminder message.');
      return;
    }

    setLoading(true);
    try {
      if (createReminder) {
        await createReminder({
          eventId: selectedEventId,
          remindAt: finalRemindAt,
          message: message.trim(),
          recurrence: 'none' // Custom reminders are one-off by default, the main event dictates recurrence
        });
      }
      setShowSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save reminder.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for UI styling
  const getEventMeta = (ev) => {
    const isBday = ev.eventType === 'birthday';
    const isTask = ev.eventType === 'task';
    const icon = isBday ? '🎂' : isTask ? '✅' : <CalendarDays size={16} className="text-primary" />;
    const bgClass = isBday ? 'bg-secondary-container/40' : isTask ? 'bg-tertiary-container/40' : 'bg-primary-container/40';
    return { icon, bgClass };
  };

  return (
    <div className="flex flex-col min-h-full bg-surface">
      
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 -ml-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg md:text-xl font-extrabold font-headline text-on-surface tracking-tight">
            Set Reminder Alarm
          </h1>
        </div>
        <div className="flex gap-2 md:gap-3">
          <Button variant="ghost" className="hidden sm:flex text-on-surface-variant" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="primary" className="rounded-xl px-5 md:px-6 shadow-md shadow-primary/20 flex items-center gap-2" onClick={handleSave} disabled={loading}>
            {loading ? <Loader size={16} className="animate-spin" /> : <Bell size={16} />}
            {loading ? 'Saving...' : 'Set Alarm'}
          </Button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-in fade-in duration-300">
        
        {/* LEFT COLUMN: Select Event (Spans 7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-[500px] lg:h-[calc(100vh-140px)]">
          <div className="glass-card bg-surface-container-lowest/80 border border-outline-variant/20 rounded-3xl p-5 md:p-6 flex flex-col h-full shadow-sm">
            
            <div className="mb-5">
              <h2 className="text-base font-extrabold font-headline text-on-surface mb-1">1. Select Target</h2>
              <p className="text-xs font-medium text-on-surface-variant mb-4">Search your upcoming events, tasks, or birthdays to attach an alarm to.</p>
              
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  placeholder="Search by title or type (e.g., 'birthday', 'meeting')"
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto hidden-scrollbar flex flex-col gap-2.5 border-t border-outline-variant/10 pt-4">
              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 text-outline">
                  <Calendar size={32} className="mb-2 opacity-50" />
                  <p className="text-sm font-semibold font-headline text-on-surface-variant">No upcoming items found</p>
                  {searchTerm && <p className="text-xs mt-1">Try adjusting your search.</p>}
                </div>
              ) : (
                upcomingEvents.map(ev => {
                  const { icon, bgClass } = getEventMeta(ev);
                  const isSelected = selectedEventId === ev.id;
                  const d = new Date(ev.date);
                  const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <div
                      key={ev.id}
                      onClick={() => handleSelectEvent(ev)}
                      className={`flex items-center gap-3.5 p-3 md:p-4 rounded-[16px] cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-primary-container/10 border-primary shadow-sm ring-1 ring-primary inset-0' 
                          : 'bg-surface hover:bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
                        {icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className={`text-sm font-bold font-headline truncate ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                            {ev.title}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-outline bg-surface-container px-2 py-0.5 rounded-md shrink-0 ml-2">
                            {ev.eventType}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-on-surface-variant flex items-center gap-1.5">
                          <CalendarDays size={12} /> {dateLabel}
                          {!ev.allDay && ev.startTime && (
                            <>
                              <span className="opacity-50">•</span>
                              <Clock size={12} /> {ev.startTime}
                            </>
                          )}
                          {ev.allDay && <span className="opacity-50">• All Day</span>}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-primary bg-primary text-white' : 'border-outline-variant/30'}`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Alarm Settings (Spans 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className={`glass-card bg-surface-container-lowest/80 border border-outline-variant/20 rounded-3xl p-5 md:p-7 shadow-sm transition-opacity duration-300 ${!selectedEventId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            
            <h2 className="text-base font-extrabold font-headline text-on-surface mb-5">2. Alarm Settings</h2>

            {error && (
              <div className="flex items-start gap-2 mb-5 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-medium">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Time Toggle */}
            <div className="bg-surface-container-low p-1 rounded-xl flex gap-1 mb-6">
              <button 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${remindType === 'preset' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
                onClick={() => setRemindType('preset')}
              >
                Smart Preset
              </button>
              <button 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${remindType === 'custom' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
                onClick={() => setRemindType('custom')}
              >
                Exact Time
              </button>
            </div>

            <div className="space-y-6">
              
              {/* Time Selection Inputs */}
              {remindType === 'preset' ? (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-label flex items-center gap-1.5">
                    <Clock size={13} /> Time before event
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-surface border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                      value={presetMinutes}
                      onChange={(e) => setPresetMinutes(e.target.value)}
                    >
                      {REMINDER_OPTS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                      ▼
                    </div>
                  </div>
                  {selectedEvent?.allDay && (
                    <p className="text-[10px] text-outline mt-1 font-medium">
                      *For all-day events, presets are calculated backwards from 9:00 AM on the day of the event.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-label flex items-center gap-1.5">
                    <Clock size={13} /> Exact Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full bg-surface border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                  />
                </div>
              )}

              {/* Custom Message Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-label flex items-center gap-1.5">
                  <Bell size={13} /> Notification Message
                </label>
                <textarea
                  placeholder="e.g. Grab the birthday cake!"
                  className="w-full bg-surface border border-outline-variant/20 rounded-xl px-4 py-3 text-sm font-medium text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline/50 resize-none h-24"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

            </div>

            {/* Mobile Save Button (Desktop uses Header button) */}
            <Button 
              variant="primary" 
              className="w-full mt-8 md:hidden py-3.5 rounded-xl shadow-md shadow-primary/20 text-sm font-bold flex justify-center items-center gap-2" 
              onClick={handleSave} 
              disabled={loading}
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
              {loading ? 'Saving...' : 'Set Alarm'}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Success Modal ── */}
      <Modal isOpen={showSuccess} onClose={() => navigate('/reminders')} title="Alarm Set! 🎉">
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-16 h-16 bg-primary-container text-primary rounded-full flex items-center justify-center mb-2 shadow-inner">
            <Bell size={32} />
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Your alarm for <strong className="text-on-surface font-headline">{selectedEvent?.title}</strong> has been successfully scheduled.
          </p>
          <div className="flex gap-3 w-full mt-4">
            <Button variant="ghost" className="flex-1 rounded-xl bg-surface-container-low border-0 text-on-surface-variant font-bold text-xs hover:bg-surface-container" onClick={() => { setShowSuccess(false); setSelectedEventId(null); }}>
              Add Another
            </Button>
            <Button variant="primary" className="flex-1 rounded-xl shadow-md font-bold text-xs" onClick={() => navigate('/reminders')}>
              View Alarms
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}