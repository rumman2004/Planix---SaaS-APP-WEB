import React, { useState } from 'react';
import Button from './Button';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar({
  onDateSelect,
  eventDots = [],   // array of date strings "YYYY-MM-DD" that get a dot
  defaultView = 'monthly',
  style = {},
}) {
  const today = new Date();
  const [view, setView] = useState(defaultView);
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(today.getDate());
  const [note, setNote] = useState('');

  const { year, month } = current;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const blanks = Array(firstDay).fill(null);
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allCells = [...blanks, ...dates];

  /* Weekly: show only current week */
  const getWeekDates = () => {
    const dayOfWeek = today.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - dayOfWeek + i);
      return d.getDate();
    });
  };

  const handleSelect = (d) => {
    if (!d) return;
    setSelected(d);
    onDateSelect?.({ day: d, month, year, date: new Date(year, month, d) });
  };

  const hasDot = (d) => {
    const str = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return eventDots.includes(str);
  };

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const displayDates = view === 'weekly' ? getWeekDates() : allCells;
  const displayDayLabels = view === 'weekly'
    ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    : DAYS;

  /* Styles */
  const s = {
    card: {
      borderRadius: '24px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
      backdropFilter: 'blur(40px) saturate(200%)',
      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      border: '0.5px solid rgba(255,255,255,0.15)',
      fontFamily: "'DM Sans', sans-serif",
      ...style,
    },
    glow: {
      position: 'absolute',
      top: '-40%', left: '-20%',
      width: '80%', height: '80%',
      background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    toggleRow: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    togglePill: {
      display: 'flex', alignItems: 'center', gap: '4px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '100px', padding: '4px',
    },
    tab: (active) => ({
      padding: '6px 18px',
      borderRadius: '100px',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      border: 'none',
      fontFamily: "'DM Sans', sans-serif",
      transition: 'all 0.2s',
      background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      color: active ? '#fff' : 'rgba(255,255,255,0.45)',
      backdropFilter: active ? 'blur(10px)' : 'none',
    }),
    header: {
      display: 'flex', alignItems: 'baseline',
      justifyContent: 'space-between',
      marginTop: '16px',
    },
    month: {
      fontFamily: "'DM Serif Display', serif",
      fontSize: '42px', fontWeight: 400,
      color: 'rgba(255,255,255,0.95)',
      lineHeight: 1, letterSpacing: '-1px',
    },
    dayNum: {
      fontFamily: "'DM Serif Display', serif",
      fontSize: '42px',
      color: 'rgba(255,255,255,0.28)',
      lineHeight: 1, letterSpacing: '-1px',
    },
    navRow: {
      display: 'flex', gap: '6px', alignItems: 'center',
    },
    navBtn: {
      background: 'rgba(255,255,255,0.06)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '14px',
      cursor: 'pointer',
      width: '28px', height: '28px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      marginTop: '14px',
      textAlign: 'center',
    },
    dayLabel: {
      fontSize: '10px',
      fontWeight: 500,
      color: 'rgba(255,255,255,0.28)',
      letterSpacing: '0.5px',
      paddingBottom: '8px',
      textTransform: 'uppercase',
    },
    dateCell: (d, isSelected, isTdy) => ({
      fontSize: '13px',
      fontWeight: isSelected ? 600 : 400,
      color: d
        ? isSelected ? '#fff'
          : isTdy ? 'rgba(167,139,250,0.95)'
          : 'rgba(255,255,255,0.6)'
        : 'transparent',
      padding: '7px 2px',
      borderRadius: '100px',
      cursor: d ? 'pointer' : 'default',
      transition: 'all 0.15s',
      background: isSelected
        ? 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(217,70,239,0.8))'
        : 'transparent',
      boxShadow: isSelected ? '0 4px 16px rgba(139,92,246,0.4)' : 'none',
      position: 'relative',
    }),
    dot: {
      position: 'absolute',
      bottom: '2px', left: '50%',
      transform: 'translateX(-50%)',
      width: '4px', height: '4px',
      borderRadius: '50%',
      background: 'rgba(167,139,250,0.8)',
    },
    footer: {
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '14px',
      paddingTop: '12px',
      borderTop: '0.5px solid rgba(255,255,255,0.08)',
    },
    noteInput: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '13px',
      color: 'rgba(255,255,255,0.4)',
      flex: 1,
    },
  };

  const prevMonth = () => {
    setCurrent(c =>
      c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }
    );
  };

  const nextMonth = () => {
    setCurrent(c =>
      c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }
    );
  };

  return (
    <div style={s.card}>
      <div style={s.glow} />

      {/* Top row */}
      <div style={s.toggleRow}>
        <div style={s.togglePill}>
          <button style={s.tab(view === 'weekly')} onClick={() => setView('weekly')}>Weekly</button>
          <button style={s.tab(view === 'monthly')} onClick={() => setView('monthly')}>Monthly</button>
        </div>
        <div style={s.navRow}>
          <button style={s.navBtn} onClick={prevMonth}>‹</button>
          <button style={s.navBtn} onClick={nextMonth}>›</button>
        </div>
      </div>

      {/* Month + day header */}
      <div style={s.header}>
        <span style={s.month}>{MONTHS[month]}</span>
        <span style={s.dayNum}>{String(selected).padStart(2, '0')}</span>
      </div>

      {/* Grid */}
      <div style={s.grid}>
        {displayDayLabels.map(d => (
          <div key={d} style={s.dayLabel}>{d}</div>
        ))}
        {displayDates.map((d, i) => {
          const isSelected = d === selected;
          const isTdy = isToday(d);
          return (
            <div
              key={i}
              style={s.dateCell(d, isSelected, isTdy)}
              onClick={() => handleSelect(d)}
            >
              {d ?? ''}
              {d && hasDot(d) && !isSelected && <span style={s.dot} />}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.22)', marginRight: '8px' }}>✎</span>
        <input
          style={s.noteInput}
          placeholder="Add a note..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <Button variant="primary" size="sm" style={{ borderRadius: '12px' }}>
          + New Event
        </Button>
      </div>
    </div>
  );
}
