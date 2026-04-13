import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

const ACCENT_COLORS = {
  work:     { bar: 'linear-gradient(180deg,#7c3aed,#db2777)', badge: 'rgba(139,92,246,0.2)', badgeBorder: 'rgba(139,92,246,0.3)', badgeText: 'rgba(167,139,250,0.9)' },
  personal: { bar: 'linear-gradient(180deg,#0891b2,#0284c7)', badge: 'rgba(8,145,178,0.15)', badgeBorder: 'rgba(8,145,178,0.3)', badgeText: 'rgba(103,232,249,0.9)' },
  health:   { bar: 'linear-gradient(180deg,#16a34a,#15803d)', badge: 'rgba(22,163,74,0.15)', badgeBorder: 'rgba(22,163,74,0.3)', badgeText: 'rgba(74,222,128,0.9)' },
  focus:    { bar: 'linear-gradient(180deg,#d97706,#b45309)', badge: 'rgba(217,119,6,0.15)', badgeBorder: 'rgba(217,119,6,0.3)', badgeText: 'rgba(251,191,36,0.9)' },
  // Adding specific colors for Tasks and Birthdays just in case!
  task:     { bar: 'linear-gradient(180deg,#3b82f6,#2563eb)', badge: 'rgba(59,130,246,0.15)', badgeBorder: 'rgba(59,130,246,0.3)', badgeText: 'rgba(96,165,250,0.9)' },
  birthday: { bar: 'linear-gradient(180deg,#f43f5e,#e11d48)', badge: 'rgba(244,63,94,0.15)', badgeBorder: 'rgba(244,63,94,0.3)', badgeText: 'rgba(251,113,133,0.9)' },
};

export default function EventCard({
  title = 'Untitled Event',
  time = '',
  location = '',
  category = 'work',
  attendees = [],         
  reminderLabel = '',
  synced = true,
  onClick,
  onDelete, // <-- New Prop added here
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  // Fallback to 'work' if the category isn't in our list
  const accent = ACCENT_COLORS[category?.toLowerCase()] || ACCENT_COLORS.work;

  const s = {
    card: {
      borderRadius: '18px',
      padding: '16px 16px 16px 20px',
      position: 'relative',
      overflow: 'hidden',
      background: hovered ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.3)' : 'none',
      fontFamily: "'DM Sans', sans-serif",
      ...style,
    },
    accent: {
      position: 'absolute',
      left: 0, top: 0, bottom: 0,
      width: '3px',
      background: accent.bar,
    },
    top: {
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '8px',
    },
    titleGroup: {
      paddingRight: '12px',
    },
    title: {
      fontSize: '14px', fontWeight: 500,
      color: 'rgba(255,255,255,0.92)',
      marginBottom: '3px',
    },
    time: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.35)',
    },
    topRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    badge: {
      fontSize: '11px',
      padding: '3px 10px',
      borderRadius: '100px',
      background: accent.badge,
      border: `0.5px solid ${accent.badgeBorder}`,
      color: accent.badgeText,
      whiteSpace: 'nowrap',
      textTransform: 'capitalize',
    },
    deleteBtn: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      borderRadius: '6px',
      color: 'rgba(255,255,255,0.3)',
      transition: 'all 0.2s',
      opacity: hovered ? 1 : 0, // Only show trash can on hover for a cleaner UI
    },
    location: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.32)',
      marginBottom: '10px',
    },
    footer: {
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '10px',
      paddingTop: '10px',
      borderTop: '0.5px solid rgba(255,255,255,0.07)',
    },
    attendees: {
      display: 'flex', alignItems: 'center',
    },
    bubble: (color, idx) => ({
      width: '26px', height: '26px',
      borderRadius: '50%',
      border: '1.5px solid rgba(10,8,20,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '9px', fontWeight: 600,
      background: color || 'rgba(255,255,255,0.1)',
      color: '#fff',
      marginLeft: idx === 0 ? 0 : '-8px',
      zIndex: 10 - idx,
      position: 'relative',
    }),
    reminderPill: {
      fontSize: '11px',
      color: accent.badgeText,
      background: accent.badge,
      padding: '3px 8px',
      borderRadius: '8px',
    },
    syncPill: {
      fontSize: '11px',
      color: 'rgba(74,222,128,0.85)',
      background: 'rgba(22,163,74,0.12)',
      padding: '3px 8px',
      borderRadius: '8px',
    },
  };

  return (
    <div
      style={s.card}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.accent} />

      <div style={s.top}>
        <div style={s.titleGroup}>
          <div style={s.title}>{title}</div>
          {time && <div style={s.time}>{time}</div>}
        </div>
        
        <div style={s.topRight}>
          <span style={s.badge}>{category}</span>
          
          {/* Delete Button */}
          {onDelete && (
            <button 
              style={{
                ...s.deleteBtn,
                color: hovered ? '#f43f5e' : 'rgba(255,255,255,0.3)',
                background: hovered ? 'rgba(244,63,94,0.1)' : 'transparent'
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevents the card onClick from firing
                onDelete();
              }}
              title="Delete item"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {location && <div style={s.location}>{location}</div>}

      <div style={s.footer}>
        {attendees?.length > 0 ? (
          <div style={s.attendees}>
            {attendees.slice(0, 4).map((a, i) => (
              <div key={i} style={s.bubble(a.color, i)}>{a.initials}</div>
            ))}
            {attendees.length > 4 && (
              <div style={{ ...s.bubble('rgba(255,255,255,0.08)', 4), color: 'rgba(255,255,255,0.4)' }}>
                +{attendees.length - 4}
              </div>
            )}
          </div>
        ) : (
          <div />
        )}

        <div>
          {reminderLabel && (
            <span style={s.reminderPill}>🔔 {reminderLabel}</span>
          )}
          {!reminderLabel && synced && (
            <span style={s.syncPill}>✓ Synced</span>
          )}
        </div>
      </div>
    </div>
  );
}