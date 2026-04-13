import { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Trash2, Clock, RefreshCw, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { Button } from '../../components/ui';
import { ReminderContext } from '../../context/ReminderContext';
import { EventContext } from '../../context/EventContext';

export default function Reminders() {
  const navigate = useNavigate();
  
  // Contexts
  const { reminders, deleteReminder } = useContext(ReminderContext) || { reminders: [] };
  const { events, loading: eventsLoading, fetchEvents, error } = useContext(EventContext);
  
  // State
  const [syncing, setSyncing] = useState(false);

  // --- Extract Google Calendar Reminders + Custom Reminders ---
  const allReminders = useMemo(() => {
    const list = [];

    // 1. Add Custom Reminders (from ReminderContext)
    (reminders || []).forEach(r => {
      list.push({
        ...r,
        isCustom: true,
        remindAtDate: r.remindAt ? new Date(r.remindAt) : null,
      });
    });

    // 2. Extract Google Calendar Reminders (from EventContext)
    (events || []).forEach(ev => {
      if (!ev.date) return;
      
      let startDateTime = new Date(ev.date);
      if (ev.startTime && !ev.allDay) {
        const [h, m] = ev.startTime.split(':');
        startDateTime.setHours(parseInt(h), parseInt(m), 0);
      }

      if (Array.isArray(ev.reminders) && ev.reminders.length > 0 && ev.startTime) {
        ev.reminders.forEach((rem, idx) => {
          const minsBefore = parseInt(rem.value || rem.minutes || 0);
          if (isNaN(minsBefore)) return;

          // Calculate exact time the reminder fires
          const fireTime = new Date(startDateTime.getTime() - minsBefore * 60000);
          
          list.push({
            id: `gcal-${ev.id}-${idx}`,
            eventId: ev.id,
            eventTitle: ev.title,
            eventType: ev.eventType,
            message: `Upcoming: ${ev.title}`,
            remindAtDate: fireTime,
            minutesBefore: minsBefore,
            isCustom: false,
            active: true
          });
        });
      }
    });

    // Sort by chronological order
    return list.sort((a, b) => {
      if (!a.remindAtDate) return 1;
      if (!b.remindAtDate) return -1;
      return a.remindAtDate - b.remindAtDate;
    });
  }, [events, reminders]);

  const upcoming = allReminders.filter(r => r.remindAtDate && r.remindAtDate >= new Date());
  const past = allReminders.filter(r => r.remindAtDate && r.remindAtDate < new Date());

  const handleSync = async () => {
    setSyncing(true);
    await fetchEvents().catch(console.error);
    setTimeout(() => setSyncing(false), 800);
  };

  return (
    <div className="p-3 sm:p-5 md:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-500 font-body">
      
      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 p-2.5 md:p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs md:text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1 font-medium">{error}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="mb-5 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-on-surface font-headline mb-1 flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-xl bg-secondary-container/50 text-secondary border border-secondary/20">
               <Bell className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
            </div>
            Notifications
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant font-medium mt-1 md:mt-2">
            Your synced Google Calendar alerts and custom reminders.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            className={`flex-1 sm:flex-none flex justify-center items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-headline font-semibold text-xs md:text-sm transition-all hover:bg-surface-container-high ${syncing ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={`w-3.5 h-3.5 md:w-4 md:h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          
          <Button variant="primary" className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 md:gap-2 rounded-xl shadow-md shadow-primary/20 bg-primary hover:bg-primary-dim text-on-primary font-headline font-semibold text-xs md:text-sm border-0 px-3 py-2 md:px-4 md:py-2.5 transition-colors" onClick={() => navigate('/add-reminder')}>
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span>New</span>
          </Button>
        </div>
      </div>

      {/* ── Stats Chips ── */}
      <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 overflow-x-auto hidden-scrollbar pb-1">
        <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary-container/30 border border-secondary-container/50 text-secondary text-[10px] md:text-xs font-bold uppercase tracking-wider font-headline whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> {upcoming.length} Upcoming
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] md:text-xs font-bold uppercase tracking-wider font-headline border border-outline-variant/20 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" /> {past.length} Past
        </div>
      </div>

      {/* ── Main Content ── */}
      {eventsLoading ? (
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 md:h-20 bg-surface-container-lowest/50 animate-pulse rounded-2xl" />)}
        </div>
      ) : allReminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 md:py-16 bg-surface-container-lowest/50 rounded-[1.5rem] border border-dashed border-outline-variant/30 px-4 text-center">
          <Bell className="w-10 h-10 md:w-12 md:h-12 text-outline/40 mb-3 md:mb-4" strokeWidth={1.5} />
          <p className="font-headline font-bold text-base md:text-lg text-on-surface mb-1">No reminders set</p>
          <p className="text-xs md:text-sm text-on-surface-variant mb-5 md:mb-6">Add alerts to your events to see them here.</p>
          <Button variant="primary" onClick={() => navigate('/add-reminder')} className="rounded-xl px-5 text-sm md:text-base bg-primary text-on-primary border-0 font-bold shadow-md shadow-primary/20">
            Create an Alarm
          </Button>
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          
          {/* UPCOMING SECTION */}
          {upcoming.length > 0 && (
            <section>
              <h3 className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant mb-3 md:mb-4 ml-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary animate-pulse" /> Upcoming Alerts
              </h3>
              <div className="flex flex-col gap-2.5 md:gap-3">
                {upcoming.map(r => (
                  <ReminderCard key={r.id} r={r} onDelete={deleteReminder} />
                ))}
              </div>
            </section>
          )}

          {/* PAST SECTION */}
          {past.length > 0 && (
            <section>
              <h3 className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold font-label uppercase tracking-widest text-outline mb-3 md:mb-4 ml-1 mt-6 md:mt-10">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-outline-variant" /> Past Alerts
              </h3>
              <div className="flex flex-col gap-2.5 md:gap-3 opacity-70">
                {past.map(r => (
                  <ReminderCard key={r.id} r={r} onDelete={deleteReminder} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

// ── Reminder Card Component ──
function ReminderCard({ r, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if(!r.isCustom) {
      alert("This is a Google Calendar reminder. To remove it, edit the original event.");
      return;
    }
    if(onDelete) {
       setDeleting(true);
       try { await onDelete(r.id); } catch { setDeleting(false); }
    }
  };

  const isPast = r.remindAtDate && r.remindAtDate < new Date();
  
  // Format helpers
  const todayStr = new Date().toDateString();
  const remindStr = r.remindAtDate ? r.remindAtDate.toDateString() : '';
  const dateLabel = remindStr === todayStr ? 'Today' : r.remindAtDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeLabel = r.remindAtDate?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`bg-surface-container-lowest rounded-[1rem] md:rounded-2xl p-3 md:p-5 flex items-center gap-3 md:gap-5 border transition-all duration-200 shadow-sm ${isPast ? 'border-transparent' : 'border-outline-variant/20 hover:shadow-md hover:border-primary/30'}`}>
      
      {/* Icon */}
      <div className={`w-9 h-9 md:w-12 md:h-12 rounded-[10px] md:rounded-[14px] flex items-center justify-center shrink-0 ${isPast ? 'bg-surface-container text-outline' : r.isCustom ? 'bg-tertiary-container/30 text-tertiary' : 'bg-primary-container/30 text-primary'}`}>
        {r.eventType === 'birthday' ? <span className="text-sm md:text-xl">🎂</span> : r.eventType === 'task' ? <span className="text-sm md:text-xl">✅</span> : <Bell className="w-4 h-4 md:w-5 md:h-5" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5 md:gap-1">
        <h4 className={`font-bold font-headline truncate text-xs md:text-base ${isPast ? 'text-on-surface-variant' : 'text-on-surface'}`}>
          {r.eventTitle || r.message || 'Reminder'}
        </h4>
        
        <div className="flex flex-wrap items-center gap-x-2 md:gap-x-3 gap-y-1">
          {r.remindAtDate && (
            <span className={`text-[9px] md:text-xs font-semibold flex items-center gap-1 ${isPast ? 'text-outline' : 'text-secondary'}`}>
              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" /> {dateLabel} • {timeLabel}
            </span>
          )}
          
          {!r.isCustom && r.minutesBefore !== undefined && (
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant px-1.5 md:px-2 py-0.5 rounded text-nowrap">
              {r.minutesBefore >= 60 ? `${r.minutesBefore / 60}h before` : `${r.minutesBefore}m before`}
            </span>
          )}
          {r.isCustom && (
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider bg-tertiary/10 text-tertiary px-1.5 md:px-2 py-0.5 rounded text-nowrap">
              Custom
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {r.isCustom && (
        <button 
          className="p-1.5 md:p-2.5 rounded-lg md:rounded-xl text-outline-variant hover:bg-error/10 hover:text-error transition-colors shrink-0 border border-transparent hover:border-error/20" 
          onClick={handleDelete} 
          disabled={deleting}
          title="Delete custom reminder"
        >
          {deleting ? <Loader className="w-4 h-4 md:w-4 md:h-4 animate-spin" /> : <Trash2 className="w-4 h-4 md:w-4 md:h-4" />}
        </button>
      )}
    </div>
  );
}