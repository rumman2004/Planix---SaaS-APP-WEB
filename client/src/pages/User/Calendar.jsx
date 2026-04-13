import { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, MapPin, Video, X, RefreshCw, Trash2, Edit3 } from 'lucide-react';
import { EventContext } from '../../context/EventContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/**
 * Helper to get a stable YYYY-MM-DD date string from a Date object
 * consistent with how we visualize all-day events.
 */
const getDayKey = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function CalendarPage() {
  const navigate = useNavigate();
  const { events, loading, fetchEvents, deleteEvent } = useContext(EventContext);
  
  const [today] = useState(new Date());
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(null); 
  const [syncing, setSyncing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetchEvents();
    } catch (err) {
      console.error("Sync failed", err);
    } finally {
      setTimeout(() => setSyncing(false), 800);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this from Planix and Google?")) return;
    setDeletingId(id);
    try {
      await deleteEvent(id);
    } catch (err) {
      console.error("Failed to delete", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/edit-event/${id}`); 
  };

  // --- Navigation Logic ---
  const handlePrev = () => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const t = new Date();
    setCurrent(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelected(t);
  };

  // --- Grid Calculations ---
  const activeGrid = useMemo(() => {
    const cells = [];
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev  = new Date(year, month, 0).getDate();

    // Padding from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month - 1, daysInPrev - i), current: false });
    }
    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), current: true });
    }
    // Padding for next month
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ date: new Date(year, month + 1, d), current: false });
    }
    
    return cells;
  }, [current]);

  // --- Dynamic Header Label ---
  const headerLabel = useMemo(() => {
    return `${MONTHS[current.getMonth()]} ${current.getFullYear()}`;
  }, [current]);

  // Map events to date strings (STABLE YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = {};
    (events || []).forEach(ev => {
      if (!ev.date) return;
      const key = getDayKey(ev.date);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [events]);

  const selectedKey = useMemo(() => getDayKey(selected), [selected]);
  const todayKey = useMemo(() => getDayKey(today), [today]);

  const selectedEvents = selected ? (eventsByDate[selectedKey] || []) : [];
  
  const isToday  = d => getDayKey(d) === todayKey;
  const isSelected = d => selected && getDayKey(d) === selectedKey;

  const getEventMeta = (ev) => {
    const isBday = ev.eventType === 'birthday';
    const isTask = ev.eventType === 'task';
    const isHoliday = ev.eventType === 'holiday';
    
    const bgClass = isBday ? 'bg-emerald-100/50 text-emerald-700' : 
                    isTask ? 'bg-amber-100/50 text-amber-700' : 
                    isHoliday ? 'bg-indigo-100/50 text-indigo-700' : 
                    'bg-primary/10 text-primary';
                    
    const timeColorClass = isBday ? 'text-emerald-600' : 
                           isTask ? 'text-amber-500' : 
                           isHoliday ? 'text-indigo-600' : 
                           'text-primary';
                           
    const icon = isBday ? '🎂 ' : isTask ? '✅ ' : isHoliday ? '🎊 ' : '';
    const title = ev.title || (isBday ? 'Birthday' : isHoliday ? 'Festival' : 'Untitled');
    return { bgClass, icon, title, timeColorClass };
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 flex-1 w-full max-w-7xl mx-auto h-full flex flex-col min-h-0 animate-in fade-in duration-500">
      
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto justify-between md:justify-start">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-on-surface">
            {headerLabel}
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-surface-container-low rounded-full px-1 py-1">
              <button className="p-1.5 md:p-2 rounded-full hover:bg-white/50 text-on-surface-variant transition-colors" onClick={handlePrev}>
                <ChevronLeft size={20} />
              </button>
              <button className="p-1.5 md:p-2 rounded-full hover:bg-white/50 text-on-surface-variant transition-colors" onClick={handleNext}>
                <ChevronRight size={20} />
              </button>
            </div>
            <button
              className="px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold bg-white border border-outline-variant/20 shadow-sm text-primary hover:bg-surface-container-low transition-colors"
              onClick={handleToday}
            >
              Today
            </button>
            <button
              className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold ${syncing ? 'bg-primary/10 text-primary' : 'bg-primary text-white'} transition-all`}
              onClick={handleSync}
              disabled={syncing}
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Sync Calendar'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 flex-1 min-h-0 w-full">
        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col min-h-0">
           {/* Grid Container */}
           <div className="bg-white/80 backdrop-blur-3xl rounded-2xl md:rounded-[2rem] shadow-xl shadow-primary/5 border border-outline-variant/10 overflow-hidden flex flex-col h-full ring-1 ring-white/50">
             
             {/* Days of Week Header */}
             <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-surface-container-lowest/50 shrink-0">
               {DAYS.map(d => (
                 <div key={d} className="py-3 md:py-4 text-center text-[10px] md:text-xs font-label uppercase tracking-widest text-outline font-semibold">
                   <span className="hidden sm:inline">{d}</span>
                   <span className="sm:hidden">{d.slice(0, 3)}</span>
                 </div>
               ))}
             </div>

             {/* Days Grid */}
             <div className="grid grid-cols-7 flex-1 min-h-0 relative bg-surface-container-lowest/30">
               {loading && !syncing && (
                 <div className="absolute inset-0 z-20 bg-surface/50 backdrop-blur-sm flex items-center justify-center">
                    <RefreshCw size={32} className="animate-spin text-primary" />
                 </div>
               )}
               {activeGrid.map(({ date, current: isCurrent }, i) => {
                 const dayKey = getDayKey(date);
                 const dayEvents = eventsByDate[dayKey] || [];
                 const sel = isSelected(date);
                 const tod = isToday(date);
                 
                 return (
                   <div
                     key={i}
                     onClick={() => setSelected(date)}
                     className={`min-h-[80px] md:min-h-[100px] border-b border-r border-outline-variant/10 p-1 sm:p-2 xl:p-4 flex flex-col gap-1 cursor-pointer transition-colors relative group
                        ${isCurrent ? 'bg-surface-container-lowest/20 hover:bg-surface-container-lowest text-on-surface-variant font-medium' : 'bg-surface-container-lowest/50 text-outline/40 hover:bg-surface-container-lowest'}
                        ${sel ? 'ring-2 ring-inset ring-primary-container z-10 rounded-lg' : ''}
                     `}
                   >
                     {/* Date Number Indicator */}
                     <div className="flex justify-center sm:justify-end mb-1">
                        {tod ? (
                          <span className="bg-gradient-to-br from-primary to-primary-container text-white w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full font-bold shadow-md shadow-primary/20 text-xs sm:text-sm">
                            {date.getDate()}
                          </span>
                        ) : (
                          <span className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full font-semibold text-xs sm:text-sm ${isCurrent ? 'group-hover:text-primary transition-colors' : ''}`}>
                             {date.getDate()}
                          </span>
                        )}
                     </div>

                     {/* Events list */}
                     <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                       {/* Prioritize Holidays and Birthdays in the grid view */}
                       {dayEvents.sort((a, b) => {
                         if (a.eventType === 'holiday' || a.eventType === 'birthday') return -1;
                         if (b.eventType === 'holiday' || b.eventType === 'birthday') return 1;
                         return 0;
                       }).slice(0, 3).map(ev => {
                         const { bgClass, icon, title } = getEventMeta(ev);
                         return (
                           <div key={ev.id} className={`${bgClass} px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold truncate max-w-full hover:opacity-80 transition-opacity`}>
                             {icon}{title}
                           </div>
                         );
                       })}
                       {dayEvents.length > 3 && (
                         <div className="text-[9px] sm:text-[10px] text-outline font-medium px-1 truncate">+{dayEvents.length - 3} more</div>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>

        {/* Right Sidebar Insights - Selected Day */}
        {selected && (
          <aside className="w-full lg:w-80 shrink-0 flex flex-col bg-white/80 backdrop-blur-3xl rounded-[2rem] border border-outline-variant/10 shadow-lg p-5 md:p-8 h-[400px] lg:h-full overflow-y-auto hidden-scrollbar animate-in slide-in-from-right-4 duration-300">
            
            {/* Header info */}
            <div className="flex justify-between items-start mb-6 shrink-0">
               <div>
                  <h3 className="text-xl md:text-2xl font-headline font-extrabold tracking-tight text-on-surface mb-1">
                    {getDayKey(selected) === todayKey ? 'Today' : 'Selected Day'}
                  </h3>
                  <p className="text-on-surface-variant text-xs md:text-sm font-medium">
                    {selected.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
               </div>
               <button className="p-1.5 md:p-2 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors" onClick={() => setSelected(null)}>
                 <X size={16} />
               </button>
            </div>

            <div className="flex items-center justify-between mb-5 shrink-0">
               <h4 className="text-[10px] md:text-xs font-label uppercase tracking-widest text-outline font-bold">Agenda</h4>
               <span className="bg-primary/10 text-primary text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-bold">
                 {selectedEvents.length} ITEM{selectedEvents.length !== 1 && 'S'}
               </span>
            </div>

            {/* Events List */}
            <div className="space-y-3 md:space-y-4 flex-1">
               {selectedEvents.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-32 md:h-40 text-center space-y-3 text-outline/50">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-container rounded-full flex items-center justify-center">
                       <Plus size={24} className="md:w-8 md:h-8" />
                    </div>
                    <p className="font-medium text-xs md:text-sm">Clear schedule</p>
                 </div>
               ) : (
                 [...selectedEvents].sort((a,b) => (a.allDay? -1 : 1)).map(ev => {
                   const { icon, title, bgClass, timeColorClass } = getEventMeta(ev);
                   const isDeleting = deletingId === ev.id;
                   
                   return (
                     <div key={ev.id} className={`flex gap-3 md:gap-4 group cursor-pointer transition-all duration-300 ${isDeleting ? 'opacity-50 scale-95' : ''}`}>
                       
                       {/* Timeline segment */}
                       <div className="flex flex-col items-center pt-1 w-8 md:w-10 shrink-0">
                         <span className="text-[10px] md:text-xs font-bold font-headline text-on-surface">
                            {ev.allDay ? 'All' : ev.startTime ? ev.startTime.split(' ')[0] : 'TBD'}
                         </span>
                         <span className="text-[8px] md:text-[9px] text-outline/60 font-bold uppercase -mt-0.5">
                            {ev.allDay ? 'Day' : ev.startTime ? ev.startTime.split(' ')[1] : ''}
                         </span>
                         <div className={`w-0.5 h-full ${bgClass} group-hover:${bgClass.replace('/50', '')} transition-colors my-1 md:my-2 rounded-full`} />
                       </div>
                       
                       {/* Event Card */}
                       <div className={`bg-white rounded-xl md:rounded-2xl p-3 md:p-4 flex-1 shadow-sm border border-outline-variant/10 group-hover:-translate-y-1 group-hover:shadow-md transition-all relative overflow-hidden bg-gradient-to-b from-white to-surface-container-lowest/30`}>
                           {/* Category Accent Line */}
                           <div className={`absolute top-0 left-0 w-full h-1 ${bgClass.replace('/10', '').replace('/50', '')} opacity-40`} />

                           {/* Content */}
                           <div className="flex justify-between items-start mb-2">
                             <div>
                               <p className={`text-[9px] md:text-[10px] font-label font-bold mb-0.5 md:mb-1 uppercase tracking-wider ${timeColorClass}`}>
                                  {ev.eventType === 'birthday' ? 'BIRTHDAY' : ev.eventType === 'task' ? 'ACTION ITEM' : ev.eventType === 'holiday' ? 'FESTIVAL / HOLIDAY' : 'CALENDAR EVENT'}
                               </p>
                               <p className="text-xs md:text-sm font-bold text-on-surface leading-tight pr-6">{icon}{title}</p>
                             </div>
                           </div>

                           <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2 md:gap-x-3 mt-2 md:mt-3">
                              {ev.location && (
                                 <p className="text-[9px] md:text-[10.5px] font-medium text-on-surface-variant flex items-center gap-1 bg-surface-container-low px-1.5 md:px-2 py-1 rounded-md">
                                   <MapPin size={10} className={timeColorClass} /> <span className="truncate max-w-[80px] md:max-w-[120px]">{ev.location.split(',')[0]}</span>
                                 </p>
                              )}
                              {ev.meetLink && (
                                 <p className="text-[9px] md:text-[10.5px] font-medium text-on-surface-variant flex items-center gap-1 bg-surface-container-low px-1.5 md:px-2 py-1 rounded-md">
                                   <Video size={10} className={timeColorClass} /> Meet
                                 </p>
                              )}
                           </div>
                           
                           {ev.description && (
                             <p className="text-xs text-on-surface-variant mt-3 leading-relaxed line-clamp-3">
                               {ev.description}
                             </p>
                           )}

                           {/* Hover Actions Menu */}
                           <div className="absolute top-2 right-2 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 shadow-sm backdrop-blur-md rounded-lg p-0.5 border border-outline-variant/20 lg:-translate-y-1 lg:group-hover:translate-y-0 duration-300">
                             <button className="p-1 md:p-1.5 rounded-md hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors" title="Edit" onClick={(e) => handleEdit(e, ev.id)}>
                               <Edit3 size={12} className="md:w-3.5 md:h-3.5" />
                             </button>
                             <button className="p-1 md:p-1.5 rounded-md hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors" title="Delete" onClick={(e) => handleDelete(e, ev.id)} disabled={isDeleting}>
                               {isDeleting ? <RefreshCw size={12} className="animate-spin md:w-3.5 md:h-3.5" /> : <Trash2 size={12} className="md:w-3.5 md:h-3.5" />}
                             </button>
                           </div>

                           {/* Synced Info */}
                           <div className="mt-3 flex items-center justify-between border-t border-outline-variant/10 pt-2">
                             <span className="text-[9px] font-bold text-emerald-600/80 uppercase tracking-wide flex items-center gap-1">
                               ✓ Synced
                             </span>
                           </div>
                       </div>
                     </div>
                   );
                 })
               )}
            </div>

            {/* Quick Action Button - Bottom fixed */}
            <button 
              className="mt-4 md:mt-6 shrink-0 w-full flex items-center justify-center gap-2 py-2.5 md:py-3 px-4 rounded-xl border-2 border-dashed border-outline-variant/30 text-stone-500 font-bold text-xs md:text-sm bg-surface-container-lowest/50 hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-all duration-300"
              onClick={() => navigate('/add-event')}
            >
              <Plus size={16} strokeWidth={2.5}/> Add to {selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </button>
          </aside>
        )}
      </div>
    </div>
  );
}
