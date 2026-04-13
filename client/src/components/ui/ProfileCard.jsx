import React, { useState } from 'react';
import Button from './Button';

export default function ProfileCard({
  name = 'User',
  handle = '',
  lastSeen = '',
  status = 'online',   // 'online' | 'away' | 'offline' | 'connecting'
  avatarInitials,
  avatarUrl,
  stats = [],          // [{ label, value }]
  onAddMember,
  onMessage,
  style = {},
}) {
  const [imgError, setImgError] = useState(false);

  const statusConfig = {
    online:     { color: '#4ade80', glow: 'rgba(74,222,128,0.8)', label: 'Online' },
    away:       { color: '#fbbf24', glow: 'rgba(251,191,36,0.7)', label: 'Away' },
    offline:    { color: 'rgba(255,255,255,0.25)', glow: 'transparent', label: 'Offline' },
    connecting: { color: '#60a5fa', glow: 'rgba(96,165,250,0.7)', label: 'Connecting' },
  };
  const sc = statusConfig[status] || statusConfig.online;

  const initials = avatarInitials
    || name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const s = {
    card: {
      borderRadius: '22px',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      border: '0.5px solid rgba(255,255,255,0.13)',
      ...style,
    },
    hero: {
      height: '160px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.3) 50%, rgba(20,184,166,0.3) 100%)',
      overflow: 'hidden',
    },
    heroBg: {
      position: 'absolute', inset: 0,
      background:
        'radial-gradient(circle at 65% 40%, rgba(139,92,246,0.3), transparent 60%), radial-gradient(circle at 30% 70%, rgba(236,72,153,0.2), transparent 50%)',
    },
    avatar: {
      width: '72px', height: '72px',
      borderRadius: '50%',
      background: avatarUrl && !imgError
        ? 'transparent'
        : 'linear-gradient(135deg, #7c3aed, #db2777)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px', fontWeight: 600,
      fontFamily: "'DM Serif Display', serif",
      color: '#fff',
      border: '2px solid rgba(255,255,255,0.2)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
      position: 'relative', zIndex: 1,
      overflow: 'hidden',
    },
    avatarImg: {
      width: '100%', height: '100%',
      objectFit: 'cover', borderRadius: '50%',
    },
    statusPill: {
      position: 'absolute',
      bottom: '12px', left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      border: '0.5px solid rgba(255,255,255,0.18)',
      borderRadius: '100px',
      padding: '4px 12px',
      fontSize: '11px',
      color: 'rgba(255,255,255,0.7)',
      display: 'flex', alignItems: 'center', gap: '5px',
      whiteSpace: 'nowrap',
    },
    statusDot: {
      width: '6px', height: '6px',
      borderRadius: '50%',
      background: sc.color,
      boxShadow: `0 0 8px ${sc.glow}`,
      animation: status !== 'offline' ? 'dotPulse 2s infinite' : 'none',
      flexShrink: 0,
    },
    body: {
      padding: '18px',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      borderTop: '0.5px solid rgba(255,255,255,0.09)',
    },
    name: {
      fontFamily: "'DM Serif Display', serif",
      fontSize: '20px', fontWeight: 400,
      color: 'rgba(255,255,255,0.95)',
      marginBottom: '2px',
    },
    handle: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.38)',
      marginBottom: '14px',
    },
    stats: {
      display: 'flex', gap: '16px',
      marginBottom: '14px',
    },
    statItem: {
      display: 'flex', flexDirection: 'column', gap: '2px',
    },
    statValue: {
      fontSize: '16px', fontWeight: 500,
      color: 'rgba(255,255,255,0.88)',
    },
    statLabel: {
      fontSize: '11px',
      color: 'rgba(255,255,255,0.32)',
    },
    actions: {
      display: 'flex', gap: '8px',
    },
  };

  return (
    <>
      <style>{`
        @keyframes dotPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.55; transform:scale(0.8); }
        }
      `}</style>

      <div style={s.card}>
        {/* Hero */}
        <div style={s.hero}>
          <div style={s.heroBg} />
          <div style={s.avatar}>
            {avatarUrl && !imgError ? (
              <img src={avatarUrl} alt={name} style={s.avatarImg} onError={() => setImgError(true)} />
            ) : initials}
          </div>
          <div style={s.statusPill}>
            <div style={s.statusDot} />
            {sc.label}
          </div>
        </div>

        {/* Body */}
        <div style={s.body}>
          <div style={s.name}>{name}</div>
          <div style={s.handle}>
            {handle && `${handle}`}{handle && lastSeen && ' · '}{lastSeen && lastSeen}
          </div>

          {stats.length > 0 && (
            <div style={s.stats}>
              {stats.map((st, i) => (
                <div key={i} style={s.statItem}>
                  <span style={s.statValue}>{st.value}</span>
                  <span style={s.statLabel}>{st.label}</span>
                </div>
              ))}
            </div>
          )}

          <div style={s.actions}>
            <Button
              variant="primary"
              style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '12px' }}
              onClick={onAddMember}
            >
              + Add member
            </Button>
            {onMessage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMessage}
              >
                💬
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

