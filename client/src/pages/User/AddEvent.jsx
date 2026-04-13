import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CalendarDays, Clock, Bell, AlignLeft,
  Plus, Trash2, Check, RefreshCw, MapPin, Users,
  Video, Globe, Lock, ChevronDown, Loader, AlertCircle, Calendar
} from 'lucide-react';
import { Button, Modal } from '../../components/ui';
import { EventContext } from '../../context/EventContext';

const COLORS = [
  { name: 'Blue',   value: 'blue',   hex: '#5b8af0' },
  { name: 'Purple', value: 'purple', hex: '#9b72f0' },
  { name: 'Teal',   value: 'teal',   hex: '#22d3a5' },
  { name: 'Amber',  value: 'amber',  hex: '#f0a63a' },
  { name: 'Rose',   value: 'rose',   hex: '#f06878' },
  { name: 'Lime',   value: 'lime',   hex: '#84e060' },
];

const RECUR_OPTIONS = [
  { value: 'none',      label: 'Does not repeat' },
  { value: 'daily',     label: 'Every day' },
  { value: 'weekdays',  label: 'Every weekday (Mon–Fri)' },
  { value: 'weekly',    label: 'Every week' },
  { value: 'biweekly',  label: 'Every 2 weeks' },
  { value: 'monthly',   label: 'Every month' },
  { value: 'yearly',    label: 'Every year' },
];

const REMINDER_OPTS = [
  { value: '5',    label: '5 mins before' },
  { value: '15',   label: '15 mins before' },
  { value: '30',   label: '30 mins before' },
  { value: '60',   label: '1 hour before' },
  { value: '120',  label: '2 hours before' },
  { value: '1440', label: '1 day before' },
];

const VISIBILITY = [
  { value: 'default', label: 'Default visibility', icon: Globe },
  { value: 'public',  label: 'Public',             icon: Globe },
  { value: 'private', label: 'Private',            icon: Lock  },
];

export default function AddEvent() {
  const navigate = useNavigate();
  const { addEvent } = useContext(EventContext);
  const [loading,     setLoading]     = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab,   setActiveTab]   = useState('details');
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState('');
  const [colorOpen,   setColorOpen]   = useState(false);

  const [form, setForm] = useState({
    eventType: 'event',
    title: '', date: '', endDate: '', startTime: '', endTime: '',
    allDay: false, description: '', location: '', meetLink: false,
    color: 'blue', recurrence: 'none', visibility: 'default',
    guests: [], reminders: [{ id: 1, value: '15' }],
  });

  const [guestInput, setGuestInput] = useState('');
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // --- Handle Type Changes (Smart Defaults) ---
  const handleTypeChange = (type) => {
    if (type === 'birthday') {
      setForm(p => ({ ...p, eventType: 'birthday', allDay: true, recurrence: 'yearly', color: 'rose' }));
    } else if (type === 'task') {
      setForm(p => ({ ...p, eventType: 'task', allDay: true, recurrence: 'none', color: 'blue' }));
    } else {
      setForm(p => ({ ...p, eventType: 'event', allDay: false, recurrence: 'none', color: 'blue' }));
    }
    setActiveTab('details');
  };

  /* Reminders */
  const addReminder = () => set('reminders', [...form.reminders, { id: Date.now(), value: '30' }]);
  const removeReminder = id => set('reminders', form.reminders.filter(r => r.id !== id));
  const updateReminder = (id, value) =>
    set('reminders', form.reminders.map(r => r.id === id ? { ...r, value } : r));

  /* Guests */
  const addGuest = () => {
    const email = guestInput.trim();
    if (!email || !email.includes('@') || form.guests.includes(email)) return;
    set('guests', [...form.guests, email]);
    setGuestInput('');
  };

  /* Validate */
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.date)         e.date  = 'Date is required';
    if (form.eventType === 'event' && !form.allDay && !form.startTime) e.startTime = 'Start time is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await addEvent(form);
      setShowSuccess(true);
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => setForm({
    eventType: 'event',
    title: '', date: '', endDate: '', startTime: '', endTime: '',
    allDay: false, description: '', location: '', meetLink: false,
    color: 'blue', recurrence: 'none', visibility: 'default',
    guests: [], reminders: [{ id: 1, value: '15' }],
  });

  const selColor = COLORS.find(c => c.value === form.color) || COLORS[0];

  return (
    <div className="flex flex-col min-h-full flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 gap-4 md:gap-6 animate-in fade-in duration-300">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface/90 backdrop-blur-xl rounded-2xl md:rounded-[2rem] shadow-sm border border-outline-variant/20 px-4 md:px-6 py-3 md:py-4 gap-3 md:gap-0">
        <div className="flex items-center gap-3">
           <button 
             className="p-2 -ml-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors" 
             onClick={() => navigate(-1)}
           >
             <ArrowLeft size={18} />
           </button>
           <h1 className="text-lg md:text-2xl font-extrabold font-headline text-on-surface tracking-tight">New Item</h1>
        </div>
        <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
          <Button variant="ghost" className="hidden sm:flex" onClick={() => navigate(-1)}>Cancel</Button>
          <Button variant="primary" className="flex-1 sm:flex-none shadow-md shadow-primary/20 px-4 py-2" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
            {loading ? 'Saving…' : 'Save to Calendar'}
          </Button>
        </div>
      </header>

      {apiError && (
        <div className="flex items-center gap-2 p-3 md:p-4 bg-error/10 text-error rounded-xl border border-error/20 text-xs md:text-sm font-semibold">
          <AlertCircle size={16} className="shrink-0" /> {apiError}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-5 md:gap-6 flex-1 min-h-0">

        {/* ── Left form ── */}
        <div className="flex-1 bg-surface-container-lowest/80 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] shadow-md border border-outline-variant/20 p-5 md:p-8 overflow-y-auto hidden-scrollbar flex flex-col gap-6 md:gap-8">
          
          {/* Type Toggle */}
          <div className="flex p-1 bg-surface-container-low/50 border border-outline-variant/20 rounded-xl w-full md:w-fit shadow-sm overflow-x-auto hidden-scrollbar">
            <button 
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${form.eventType === 'event' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface'}`}
              onClick={() => handleTypeChange('event')}
            >
              📅 Event
            </button>
            <button 
               className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${form.eventType === 'task' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface'}`}
               onClick={() => handleTypeChange('task')}
            >
              ✅ Task
            </button>
            <button 
               className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${form.eventType === 'birthday' ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface'}`}
               onClick={() => handleTypeChange('birthday')}
            >
              🎂 Birthday
            </button>
          </div>

          {/* Title row */}
          <div className="flex items-start gap-3 md:gap-4 mt-2">
            {/* Color picker */}
            <div className="relative mt-2 shrink-0">
              <button
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-[3px] border-white shadow-sm hover:scale-110 transition-transform"
                style={{ background: selColor.hex }}
                onClick={() => setColorOpen(o => !o)}
                title="Pick color"
              />
              {colorOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setColorOpen(false)} />
                  <div className="absolute top-12 left-0 z-50 bg-white/95 backdrop-blur-xl border border-outline-variant/20 shadow-xl p-3 rounded-2xl flex flex-wrap gap-2 w-[180px]">
                    {COLORS.map(c => (
                      <button
                        key={c.value}
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-white hover:scale-110 transition-transform ${form.color === c.value ? 'border-primary' : 'border-transparent'}`}
                        style={{ background: c.hex }}
                        onClick={() => { set('color', c.value); setColorOpen(false); }}
                        title={c.name}
                      >
                        {form.color === c.value && <Check size={14} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <input
                className={`w-full bg-transparent border-b-2 ${errors.title ? 'border-error text-error' : 'border-outline-variant/30 text-on-surface'} text-2xl md:text-4xl lg:text-5xl font-extrabold font-headline py-1 md:py-2 outline-none focus:border-primary transition-colors placeholder:text-outline-variant/50 placeholder:font-bold`}
                placeholder={form.eventType === 'birthday' ? "Whose birthday?" : form.eventType === 'task' ? "Add a task" : "Add title"}
                value={form.title}
                onChange={e => set('title', e.target.value)}
              />
              {errors.title && <span className="flex items-center gap-1 mt-2 text-xs font-bold text-error"><AlertCircle size={12} /> {errors.title}</span>}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-surface-container-low/50 border border-outline-variant/20 rounded-xl p-1 gap-1 overflow-x-auto hidden-scrollbar" style={{ display: form.eventType === 'task' ? 'none' : 'flex' }}>
            {['details', 'guests', 'advanced'].map(t => (
              <button
                key={t}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${activeTab === t ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-surface'}`}
                onClick={() => setActiveTab(t)}
                disabled={form.eventType === 'birthday' && t === 'guests'}
                style={{ opacity: (form.eventType === 'birthday' && t === 'guests') ? 0.4 : 1 }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'guests' && form.guests.length > 0 && (
                  <span className="bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded-md min-w-[20px] text-center">{form.guests.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Details tab ── */}
          {(activeTab === 'details' || form.eventType === 'task') && (
            <div className="flex flex-col gap-5 md:gap-6 animate-in fade-in duration-300">

              {form.eventType === 'event' && (
                <label className="flex items-center justify-between p-3 md:p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl md:rounded-2xl cursor-pointer hover:border-primary/30 transition-all group shadow-sm">
                  <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">All-day event</span>
                  <div className={`w-10 h-5 md:w-12 md:h-6 rounded-full relative transition-colors duration-300 ${form.allDay ? 'bg-primary' : 'bg-outline-variant'}`} onClick={() => set('allDay', !form.allDay)}>
                    <div className={`absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${form.allDay ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </label>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                    <CalendarDays size={14} className="text-primary" /> {form.eventType === 'birthday' ? 'Date' : 'Start date'}
                  </label>
                  <input
                    type="date"
                    className={`w-full bg-surface-container-lowest border ${errors.date ? 'border-error' : 'border-outline-variant/30 hover:border-outline-variant/50'} rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                  />
                  {errors.date && <span className="flex items-center gap-1 text-xs text-error font-bold"><AlertCircle size={12} /> {errors.date}</span>}
                </div>
                
                {/* Start Time */}
                {form.eventType === 'event' && !form.allDay && (
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                       <Clock size={14} className="text-primary" /> Start time
                    </label>
                    <input
                      type="time"
                      className={`w-full bg-surface-container-lowest border ${errors.startTime ? 'border-error' : 'border-outline-variant/30 hover:border-outline-variant/50'} rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                      value={form.startTime}
                      onChange={e => set('startTime', e.target.value)}
                    />
                    {errors.startTime && <span className="flex items-center gap-1 text-xs text-error font-bold"><AlertCircle size={12} /> {errors.startTime}</span>}
                  </div>
                )}
                
                {/* End Date */}
                {form.eventType === 'event' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                      <CalendarDays size={14} className="text-primary" /> End date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 hover:border-outline-variant/50 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={form.endDate || form.date}
                      onChange={e => set('endDate', e.target.value)}
                    />
                  </div>
                )}
                
                {/* End Time */}
                {form.eventType === 'event' && !form.allDay && (
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                      <Clock size={14} className="text-primary" /> End time
                    </label>
                    <input
                      type="time"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 hover:border-outline-variant/50 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      value={form.endTime}
                      onChange={e => set('endTime', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Recurrence */}
              <div className="flex flex-col gap-1.5 w-full sm:w-1/2">
                <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                  <RefreshCw size={14} className="text-primary" /> Repeat
                </label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface border border-outline-variant/30 hover:border-outline-variant/50 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm font-semibold text-on-surface appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                    value={form.recurrence} 
                    onChange={e => set('recurrence', e.target.value)}
                    disabled={form.eventType === 'birthday'}
                  >
                    {RECUR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                  <AlignLeft size={14} className="text-primary" /> {form.eventType === 'birthday' ? 'Gift ideas or notes' : 'Description'}
                </label>
                <textarea
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 hover:border-outline-variant/50 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm font-medium text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none min-h-[100px] placeholder:text-outline/50"
                  placeholder={form.eventType === 'task' ? "Add details..." : "Add notes, agenda, or links…"}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                />
              </div>

              {/* Reminders */}
              <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/15">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                    <Bell size={14} className="text-primary" /> Notifications
                  </label>
                  <button className="flex items-center gap-1 text-xs md:text-sm font-bold text-primary hover:text-primary-dim transition-colors" onClick={addReminder}>
                    <Plus size={14} /> Add
                  </button>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  {form.reminders.map(r => (
                    <div key={r.id} className="flex items-center gap-2 md:gap-3 bg-surface border border-outline-variant/20 p-1.5 md:p-2 rounded-xl shadow-sm">
                      <Bell size={14} className="text-primary ml-2 shrink-0 hidden sm:block" />
                      <div className="relative flex-1">
                        <select 
                           className="w-full bg-transparent text-xs md:text-sm font-semibold text-on-surface appearance-none outline-none py-1.5 px-2 md:px-3 cursor-pointer" 
                           value={r.value} 
                           onChange={e => updateReminder(r.id, e.target.value)}
                        >
                          {REMINDER_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                      </div>
                      <button className="p-2 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0" onClick={() => removeReminder(r.id)}>
                         <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ── Guests tab ── */}
          {activeTab === 'guests' && form.eventType !== 'birthday' && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                   <Users size={14} className="text-primary" /> Invite people
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none focus:border-primary transition-all placeholder:text-outline/50"
                    type="email"
                    placeholder="Enter email address"
                    value={guestInput}
                    onChange={e => setGuestInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addGuest()}
                  />
                  <button className="bg-primary hover:bg-primary-dim text-white px-4 rounded-xl flex items-center justify-center transition-colors shadow-md shadow-primary/20 shrink-0" onClick={addGuest}>
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              
              {form.guests.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {form.guests.map(g => (
                    <div key={g} className="flex items-center justify-between bg-surface border border-outline-variant/20 p-2.5 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-primary-container text-primary font-bold text-xs flex items-center justify-center">
                            {g[0].toUpperCase()}
                         </div>
                         <span className="text-xs md:text-sm font-bold text-on-surface truncate max-w-[150px] sm:max-w-[250px]">{g}</span>
                      </div>
                      <button className="p-1.5 md:p-2 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0" onClick={() => set('guests', form.guests.filter(x => x !== g))}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 md:py-16 text-outline/50 border border-dashed border-outline-variant/30 rounded-2xl bg-surface-container-lowest/50">
                  <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-3">
                     <Users size={28} />
                  </div>
                  <p className="font-bold text-sm text-on-surface-variant">No guests added</p>
                  <p className="text-xs font-medium mt-1">Type an email and press Enter</p>
                </div>
              )}
            </div>
          )}

          {/* ── Advanced tab ── */}
          {activeTab === 'advanced' && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              
              <div className="flex flex-col gap-1.5 md:w-1/2">
                <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                   <Globe size={14} className="text-primary" /> Visibility
                </label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface appearance-none outline-none focus:border-primary transition-all cursor-pointer" 
                    value={form.visibility} 
                    onChange={e => set('visibility', e.target.value)}
                  >
                    {VISIBILITY.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                </div>
              </div>
              
              {form.eventType === 'event' && (
                <>
                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                      <MapPin size={14} className="text-primary" /> Location
                    </label>
                    <input
                      className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface outline-none focus:border-primary transition-all placeholder:text-outline/50"
                      placeholder="Add location or address"
                      value={form.location}
                      onChange={e => set('location', e.target.value)}
                    />
                  </div>

                  {/* Meet */}
                  <label className="flex items-center justify-between p-4 bg-surface border border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/50 transition-all group shadow-sm mt-1">
                    <div className="flex items-center gap-3">
                       <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <Video size={16} />
                       </div>
                       <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Add Google Meet conferencing</span>
                    </div>
                    <div className={`w-10 h-5 md:w-12 md:h-6 rounded-full relative transition-colors duration-300 shrink-0 ${form.meetLink ? 'bg-primary' : 'bg-outline-variant/40'}`} onClick={() => set('meetLink', !form.meetLink)}>
                      <div className={`absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${form.meetLink ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </label>
                </>
              )}

              <div className="flex flex-col gap-1.5 mt-2 pt-4 border-t border-outline-variant/10 md:w-1/2">
                <label className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                   <Calendar size={14} className="text-primary" /> Target Calendar
                </label>
                <div className="relative opacity-60 pointer-events-none">
                  <select className="w-full bg-surface border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-medium text-on-surface appearance-none outline-none">
                    <option>Primary (Google Calendar)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline" />
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 md:p-4 bg-primary/5 text-on-surface-variant rounded-xl border border-primary/20 mt-1">
                <AlertCircle size={16} className="text-primary shrink-0 mt-0.5" />
                <span className="text-xs font-medium leading-relaxed">Advanced settings are applied directly to Google Calendar when the item is synced.</span>
              </div>
            </div>
          )}

        </div>

        {/* ── Right preview ── */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-3 md:gap-4 lg:sticky lg:top-24 self-start order-first lg:order-last">
          <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-on-surface-variant flex items-center gap-2 px-1">
             <div className="w-2 h-2 rounded-full bg-error animate-pulse" /> Live Preview
          </div>

          {/* Event Preview Card */}
          <div className="bg-surface-container-lowest rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-outline-variant/20" style={{ borderTop: `4px solid ${selColor.hex}` }}>
            <div className="p-3 md:p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/30">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: selColor.hex }} />
                  <span className="text-[10px] md:text-xs font-bold" style={{ color: selColor.hex }}>{selColor.name}</span>
               </div>
               <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-outline-variant/30">
                  <CalendarDays size={12} className="text-primary"/> Google
               </div>
            </div>
            
            <div className="p-4 md:p-5 flex flex-col gap-2.5 md:gap-3">
              <h3 className="text-lg md:text-xl font-extrabold font-headline text-on-surface leading-tight">
                {form.eventType === 'birthday' ? '🎂 ' : form.eventType === 'task' ? '✅ ' : ''}
                {form.title || (form.eventType === 'birthday' ? 'Birthday' : 'Event title')}
              </h3>

              {(form.date || form.startTime) && (
                <div className="flex items-start gap-2.5 text-xs md:text-sm font-medium text-on-surface-variant mt-1">
                  <CalendarDays size={16} className="mt-0.5 text-primary shrink-0" />
                  <span className="leading-snug">
                    {form.date ? new Date(form.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric'}) : '—'}
                    {form.startTime ? ` • ${form.startTime}` : ''}
                    {form.endTime ? ` – ${form.endTime}` : ''}
                    {form.allDay ? ' • All day' : ''}
                  </span>
                </div>
              )}
              {form.recurrence !== 'none' && (
                <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-on-surface-variant">
                  <RefreshCw size={16} className="text-primary shrink-0" />
                  <span>{RECUR_OPTIONS.find(o => o.value === form.recurrence)?.label}</span>
                </div>
              )}
              {form.location && (
                <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-on-surface-variant">
                  <MapPin size={16} className="text-primary shrink-0" />
                  <span className="truncate">{form.location}</span>
                </div>
              )}
              {form.meetLink && (
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-secondary bg-secondary-container/40 w-fit px-2.5 py-1 rounded-md mt-1 border border-secondary/20">
                  <Video size={14} className="shrink-0" />
                  <span>Google Meet</span>
                </div>
              )}
              {form.guests.length > 0 && (
                <div className="flex items-center gap-2.5 text-xs md:text-sm font-medium text-on-surface-variant">
                  <Users size={16} className="text-primary shrink-0" />
                  <span>{form.guests.length} guest{form.guests.length !== 1 ? 's' : ''}</span>
                </div>
              )}
              
              {form.description && (
                <div className="border-t border-outline-variant/10 pt-3 mt-1">
                  <p className="text-[11px] md:text-xs font-medium text-on-surface-variant leading-relaxed line-clamp-3">{form.description}</p>
                </div>
              )}
              
              {form.reminders.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-surface-container p-1 rounded-md">
                     <Bell size={12} className="text-primary" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-outline">
                    {form.reminders.length} notification{form.reminders.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => navigate('/dashboard')} title="Item Saved! 🎉">
        <div className="flex flex-col items-center justify-center text-center px-2 py-4 md:py-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg" style={{ background: `${selColor.hex}15`, color: selColor.hex, boxShadow: `0 10px 25px -5px ${selColor.hex}30` }}>
            <Check size={32} strokeWidth={3} className="md:w-10 md:h-10" />
          </div>
          <p className="text-sm md:text-base text-on-surface-variant font-medium leading-relaxed mb-6 md:mb-8 max-w-sm">
            <strong className="text-on-surface text-lg md:text-xl block mb-2 font-headline">{form.title}</strong> 
            has been saved and synced to your Google Calendar.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <Button variant="ghost" className="w-full sm:flex-1 border-2 border-outline-variant/20 hover:border-outline-variant/40 hover:bg-surface py-2.5" onClick={() => { setShowSuccess(false); resetForm(); setActiveTab('details'); }}>
              Add Another
            </Button>
            <Button variant="primary" className="w-full sm:flex-1 shadow-md shadow-primary/20 py-2.5" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}