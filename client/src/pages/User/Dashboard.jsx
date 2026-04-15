import { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays, Bell, CheckCircle2, Clock, Plus,
  ArrowRight, Circle, CheckCircle, RefreshCw, MapPin,
  Video, TrendingUp, AlertCircle, Trash2, Calendar
} from 'lucide-react';
import { Button } from '../../components/ui';
import { AuthContext } from '../../context/AuthContext';
import { EventContext } from '../../context/EventContext';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7am–6pm

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { events, loading, error, fetchEvents, updateEventStatus, deleteEvent } = useContext(EventContext);
  
  const [completed, setCompleted] = useState(new Set());
  const [syncing, setSyncing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // --- Auto-Sync Loop (Every 60 seconds) ---
  useEffect(() => {
    const syncInterval = setInterval(() => {
      fetchEvents().catch(console.error);
    }, 60000); 
    return () => clearInterval(syncInterval);
  }, [fetchEvents]);

  // --- Process Data Safely ---
  const { todayEvents, upcomingEvents, upcomingFestivals, stats, now, nowMinutes, greeting } = useMemo(() => {
    const currentNow = new Date();
    const getDayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const todayStr = getDayKey(currentNow);
    
    const weekFromNow = new Date(currentNow.getTime() + 7 * 86400000);
    const currentHour = currentNow.getHours();
    const greet = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
    const currentNowMinutes = currentHour * 60 + currentNow.getMinutes();

    const todayEv = [];
    const upcomingEv = [];
    const upcomingFestivalEv = [];
    const weekEv = [];
    
    const sorted = [...(events || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(ev => {
      const evDate = new Date(ev.date);
      const evDateStr = getDayKey(evDate);
      const isSpecial = ev.eventType === 'holiday' || ev.eventType === 'birthday';
      
      if (evDateStr === todayStr) {
        todayEv.push(ev);
      } else if (evDate > currentNow) {
        if (isSpecial) {
          upcomingFestivalEv.push(ev);
        } else {
          upcomingEv.push(ev);
        }
        if (evDate <= weekFromNow) {
          weekEv.push(ev);
        }
      }
    });

    return {
      now: currentNow,
      nowMinutes: currentNowMinutes,
      greeting: greet,
      todayEvents: todayEv,
      upcomingEvents: upcomingEv.slice(0, 5),
      upcomingFestivals: upcomingFestivalEv.slice(0, 6),
      weekEvents: weekEv,
      stats: [
        { label: 'Today',     value: todayEv.length, icon: CalendarDays },
        { label: 'This Week', value: weekEv.length,  icon: TrendingUp },
      ],
    };
  }, [events]); 

  // --- Actions ---
  const toggleDone = async (ev) => {
    if (ev.eventType === 'task') {
      const newStatus = ev.status === 'completed' ? 'needsAction' : 'completed';
      try { await updateEventStatus(ev.id, newStatus); } catch (err) { console.error(err); }
    } else {
      setCompleted(prev => {
        const s = new Set(prev);
        s.has(ev.id) ? s.delete(ev.id) : s.add(ev.id);
        return s;
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this from Google and Planix?')) return;
    setDeletingId(id);
    try { await deleteEvent(id); } catch (err) { console.error(err); } 
    finally { setDeletingId(null); }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    await fetchEvents().catch(console.error);
    setTimeout(() => setSyncing(false), 800);
  };

  return (
    <div className="p-4 md:p-8 lg:px-12 max-w-[1400px] mx-auto w-full animate-in fade-in duration-500 font-body">
      
      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 mb-6 p-3 md:p-4 rounded-xl bg-error/10 border border-error/20 text-error text-xs md:text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <span className="flex-1 font-medium">{error}</span>
          <button className="bg-error text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-error/80 transition-colors" onClick={handleManualSync}>Retry</button>
        </div>
      )}

      {/* ── Hero Header (Matches Screenshot) ── */}
      <div className="mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface font-headline mb-1">
            {greeting}, {user?.name?.split(' ')[0] || 'Coach'} 👋
          </h2>
          <p className="text-sm text-on-surface-variant font-medium">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {todayEvents.length} events today.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 md:py-2.5 rounded-xl bg-surface-container border border-outline-variant/20 text-on-surface font-headline font-semibold text-sm transition-all hover:bg-surface-container-high ${syncing ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleManualSync}
            disabled={syncing}
          >
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button 
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 rounded-xl shadow-md shadow-primary/20 bg-primary hover:bg-primary-dim text-on-primary font-headline font-semibold text-sm border-0 px-4 py-2 md:py-2.5 transition-colors" 
            onClick={() => navigate('/add-event')}
          >
            <Plus size={16} /> <span>New Event</span>
          </button>
        </div>
      </div>

      {/* ── Main Layout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        
        {/* LEFT COLUMN (Spans 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5 md:gap-6">
          
          {/* Top Row: Next Up & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            
            {/* Next Up Card */}
            <div className="md:col-span-2 bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-outline-variant/10 shadow-sm flex flex-col min-h-[160px] md:min-h-[180px]">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-md bg-primary-container text-primary text-[10px] md:text-xs font-bold font-headline uppercase tracking-wide">
                  Next Up
                </span>
                <button className="text-primary hover:text-primary-dim transition-colors font-headline font-semibold text-xs flex items-center gap-1" onClick={() => navigate('/calendar')}>
                  View Calendar <ArrowRight size={12} />
                </button>
              </div>
              
              {todayEvents.length > 0 ? (
                <div className="mt-auto">
                  <div className="text-xs font-bold text-primary mb-1">{todayEvents[0].allDay ? 'All Day' : todayEvents[0].startTime}</div>
                  <h3 className="text-lg md:text-xl font-extrabold font-headline text-on-surface leading-tight mb-2 truncate">
                    {todayEvents[0].eventType === 'birthday' ? '🎂 ' : todayEvents[0].eventType === 'holiday' ? '🎊 ' : ''}{todayEvents[0].title}
                  </h3>
                  {todayEvents[0].location && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant">
                      <MapPin size={12} /> {todayEvents[0].location.split(',')[0]}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-auto flex flex-col items-start gap-2 text-on-surface-variant">
                  <CalendarDays size={28} className="opacity-60" strokeWidth={1.5} />
                  <p className="font-headline font-bold text-base md:text-lg text-on-surface">Your day is clear!</p>
                </div>
              )}
            </div>

            {/* Quick Stats Column */}
            <div className="md:col-span-1 flex flex-row md:flex-col gap-4 md:gap-5">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex-1 bg-surface-container-lowest rounded-3xl p-4 md:p-5 border border-outline-variant/10 shadow-sm flex items-center gap-4">
                  <div className="p-3 md:p-3.5 rounded-2xl bg-primary-container text-primary shrink-0">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface leading-none mb-0.5">{loading ? '—' : value}</span>
                    <span className="text-outline font-label uppercase tracking-wider text-[9px] md:text-[10px] font-bold">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule List */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-7 border border-outline-variant/10 shadow-sm flex-1">
            <h3 className="font-headline font-extrabold text-lg md:text-xl text-on-surface mb-5">Today's Schedule</h3>
            
            <div className="space-y-3">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-16 bg-surface-container-low animate-pulse rounded-2xl" />)
              ) : todayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 md:py-14 bg-surface-container-low/30 rounded-2xl border border-dashed border-outline-variant/30">
                  <CalendarDays size={32} className="text-outline/50 mb-3" strokeWidth={1.5} />
                  <p className="text-on-surface-variant font-body font-medium text-sm">No schedule items left for today.</p>
                </div>
              ) : (
                todayEvents.map((ev) => {
                  const isBday = ev.eventType === 'birthday';
                  const isTask = ev.eventType === 'task';
                  const done = isTask ? ev.status === 'completed' : completed.has(ev.id);
                  const isNow = !isBday && !isTask && ev.startTime && ev.endTime && parseTime(ev.startTime) <= nowMinutes && parseTime(ev.endTime) >= nowMinutes;

                  return (
                    <div key={ev.id} className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl transition-all border ${done ? 'bg-surface-container border-transparent opacity-50' : 'bg-surface border-outline-variant/10 hover:shadow-sm'} ${isNow ? 'ring-1 ring-primary/30 bg-primary-container/10' : ''}`}>
                      
                      {/* Left: Checkbox / Icon */}
                      <button 
                        className="p-1 rounded-full hover:bg-surface-container transition-colors shrink-0" 
                        onClick={() => !isBday && ev.eventType !== 'holiday' && toggleDone(ev)}
                        disabled={isBday || ev.eventType === 'holiday' || deletingId === ev.id}
                        style={{ cursor: (isBday || ev.eventType === 'holiday') ? 'default' : 'pointer' }}
                      >
                        {isBday ? <span className="text-base">🎂</span> : 
                         ev.eventType === 'holiday' ? <span className="text-base">🎊</span> : 
                         isTask ? (done ? <CheckCircle2 size={20} className="text-primary" /> : <Circle size={20} className="text-outline" />) : 
                         (done ? <CheckCircle size={20} className="text-primary" /> : <Circle size={20} className="text-outline-variant" />)}
                      </button>
                      
                      {/* Middle: Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold font-headline truncate text-sm md:text-[15px] ${done ? 'line-through text-outline' : 'text-on-surface'}`}>
                            {ev.title}
                          </h4>
                          {isNow && <span className="bg-primary text-on-primary text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0">Now</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-on-surface-variant font-medium">
                          <span className="flex items-center gap-1"><Clock size={11} /> {ev.allDay ? 'All Day' : ev.startTime}</span>
                          {ev.location && <span className="flex items-center gap-1 truncate max-w-[100px] md:max-w-[150px]"><MapPin size={11} /> {ev.location.split(',')[0]}</span>}
                          {ev.meetLink && <span className="flex items-center gap-1 text-primary"><Video size={11} /> Meet</span>}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <button 
                        className="p-2 rounded-lg text-outline hover:bg-error/10 hover:text-error transition-colors shrink-0" 
                        onClick={() => handleDelete(ev.id)}
                        disabled={deletingId === ev.id}
                      >
                        {deletingId === ev.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Spans 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6">

          {/* Timeline (Matches Screenshot exactly) */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-outline-variant/10 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-extrabold text-lg text-on-surface">Timeline</h3>
              <span className="text-[10px] md:text-xs text-primary font-bold bg-primary-container px-2.5 py-1 rounded-md tracking-wide">
                {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="flex flex-col relative">
              {HOURS.map((h, i) => {
                const hMin = h * 60;
                const isCurrentHour = now.getHours() === h;
                const isLast = i === HOURS.length - 1;
                const evs = todayEvents.filter(e => !e.allDay && e.startTime && parseTime(e.startTime) >= hMin && parseTime(e.startTime) < hMin + 60);
                
                return (
                  <div key={h} className="flex gap-4 min-h-[50px] items-start relative">
                    <span className={`text-[10px] font-semibold w-10 text-right shrink-0 translate-y-[-6px] ${isCurrentHour ? 'text-primary' : 'text-outline-variant'}`}>
                      {h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : `${h} AM`}
                    </span>
                    
                    <div className="flex-1 relative">
                      {/* Vertical line connecting hours */}
                      {!isLast && <div className="absolute left-[-1px] top-2 bottom-[-10px] w-px bg-outline-variant/20" />}
                      
                      {/* Current Time Indicator */}
                      {isCurrentHour && (
                        <div className="absolute left-[-5px] w-full h-[2px] bg-primary z-10 flex items-center" style={{ top: `${((now.getMinutes() / 60) * 100)}%` }}>
                          <div className="w-2.5 h-2.5 rounded-full bg-primary relative -left-[1px]" />
                        </div>
                      )}
                      
                      {/* Hour Tick mark */}
                      <div className="absolute left-[-3px] top-0 w-1.5 h-px bg-outline-variant/30" />

                      {/* Events in this hour */}
                      <div className="pl-4 pb-2 -mt-1.5 flex flex-col gap-1.5">
                        {evs.map(ev => (
                          <div key={ev.id} className="text-[11px] font-bold px-2 py-1 rounded border border-outline-variant/10 text-on-surface-variant truncate">
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events Mini */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-extrabold text-base md:text-lg text-on-surface">Coming Up</h3>
              <button className="text-primary hover:text-primary-dim text-[11px] font-bold" onClick={() => navigate('/calendar')}>View All</button>
            </div>
            
            {upcomingEvents.length === 0 ? (
              <p className="text-[13px] text-outline-variant text-center py-4 font-medium">Nothing scheduled ahead</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingEvents.slice(0, 3).map(ev => {
                  const isBday = ev.eventType === 'birthday';
                  const d = new Date(ev.date);
                  const isTomorrow = d.toDateString() === new Date(now.getTime() + 86400000).toDateString();
                  const label = isTomorrow ? 'Tomorrow' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                  return (
                    <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isBday ? 'bg-secondary-container/40 text-secondary' : ev.eventType === 'holiday' ? 'bg-indigo-100/50 text-indigo-700' : 'bg-primary-container/40 text-primary'}`}>
                        {isBday ? '🎂' : ev.eventType === 'holiday' ? '🎊' : ev.eventType === 'task' ? '✅' : <CalendarDays size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs md:text-sm font-bold text-on-surface truncate">{ev.title}</div>
                        <div className="text-[10px] md:text-[11px] font-medium text-on-surface-variant mt-0.5 truncate">{label}{ev.startTime && !ev.allDay ? ` • ${ev.startTime}` : ''}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Festivals & Birthdays Panel */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 md:p-6 border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-extrabold text-base text-on-surface">🎊 Festivals & Birthdays</h3>
              <button className="text-primary hover:text-primary-dim text-[11px] font-bold" onClick={() => navigate('/calendar')}>Calendar</button>
            </div>

            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-10 bg-surface-container-low animate-pulse rounded-xl mb-2" />)
            ) : upcomingFestivals.length === 0 ? (
              <p className="text-[12px] text-outline-variant text-center py-4 font-medium">No upcoming festivals or birthdays</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingFestivals.map(ev => {
                  const isBday = ev.eventType === 'birthday';
                  const d = new Date(ev.date);
                  const daysUntil = Math.ceil((d - now) / 86400000);
                  const label = daysUntil === 1 ? 'Tomorrow' : daysUntil <= 7 ? `In ${daysUntil} days` : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  return (
                    <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${isBday ? 'bg-rose-100/60' : 'bg-indigo-100/60'}`}>
                        {isBday ? '🎂' : '🎊'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-on-surface truncate">{ev.title}</div>
                        <div className={`text-[10px] font-semibold mt-0.5 ${daysUntil <= 7 ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}