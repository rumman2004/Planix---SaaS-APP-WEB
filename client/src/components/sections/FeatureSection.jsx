import React, { useEffect, useRef, useState } from 'react';

/* ─── Mini animated clock for the reminder card ─── */
const AnimClock = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t+1), 1000); return () => clearInterval(id); }, []);
  const sec = (tick % 60) * 6;
  const min = Math.floor(tick / 60) * 6;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="anim-clock">
      <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="2"/>
      <circle cx="40" cy="40" r="30" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.3)" strokeWidth="1"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(d => (
        <line key={d}
          x1={40 + 28*Math.cos((d-90)*Math.PI/180)}
          y1={40 + 28*Math.sin((d-90)*Math.PI/180)}
          x2={40 + 32*Math.cos((d-90)*Math.PI/180)}
          y2={40 + 32*Math.sin((d-90)*Math.PI/180)}
          stroke="rgba(124,58,237,0.4)" strokeWidth="1"/>
      ))}
      <line x1="40" y1="40"
        x2={40 + 18*Math.cos((min-90)*Math.PI/180)}
        y2={40 + 18*Math.sin((min-90)*Math.PI/180)}
        stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="40"
        x2={40 + 22*Math.cos((sec-90)*Math.PI/180)}
        y2={40 + 22*Math.sin((sec-90)*Math.PI/180)}
        stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="40" cy="40" r="3" fill="#7c3aed"/>
    </svg>
  );
};

/* ─── Animated sync arrows ─── */
const SyncViz = () => (
  <div style={{ position:'relative', width:120, height:80, margin:'0 auto' }}>
    <div style={{
      position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',
      width:56,height:56,borderRadius:'50%',
      border:'2px solid rgba(124,58,237,0.4)',
      animation:'spinSlow 4s linear infinite',
      display:'flex',alignItems:'center',justifyContent:'center',
    }}>
      <div style={{ width:36,height:36,borderRadius:'50%',background:'rgba(124,58,237,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 4C8.13 4 5 7.13 5 11H2L5.89 14.89L9.78 11H7C7 8.24 9.24 6 12 6C14.76 6 17 8.24 17 11C17 13.76 14.76 16 12 16C10.76 16 9.65 15.52 8.83 14.73L7.4 16.16C8.59 17.3 10.21 18 12 18C15.87 18 19 14.87 19 11C19 7.13 15.87 4 12 4Z" fill="#a78bfa"/>
        </svg>
      </div>
    </div>
    <div style={{ position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',
      width:28,height:28,borderRadius:6,background:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.3)',
      display:'flex',alignItems:'center',justifyContent:'center'
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M21 5.27L12 13.27L3 5.27" stroke="#60a5fa" strokeWidth="2"/>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      </svg>
    </div>
    <div style={{ position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',
      width:28,height:28,borderRadius:6,background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',
      display:'flex',alignItems:'center',justifyContent:'center'
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke="#10b981" strokeWidth="1.5" fill="none"/>
        <line x1="3" y1="9" x2="21" y2="9" stroke="#10b981" strokeWidth="1.5"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  </div>
);

const Tag = ({ children, color = '#7c3aed' }) => (
  <span style={{
    display:'inline-block',padding:'3px 10px',borderRadius:100,
    background:`${color}22`,border:`1px solid ${color}44`,
    fontSize:11,color:color,fontWeight:500,marginBottom:12,
    fontFamily:'inherit',letterSpacing:'0.5px',
  }}>{children}</span>
);

const FeatureSection = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .feat-wrap * { box-sizing:border-box;margin:0;padding:0; }
        .feat-wrap {
          font-family:'DM Sans',sans-serif;
          background:#05040f;
          padding:100px 60px;
          position:relative;
          overflow:hidden;
        }
        .feat-wrap::before {
          content:'';position:absolute;inset:0;
          background-image:linear-gradient(rgba(120,80,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(120,80,255,0.05) 1px,transparent 1px);
          background-size:60px 60px;pointer-events:none;
        }

        .feat-header { text-align:center;margin-bottom:64px;position:relative;z-index:2; }
        .feat-eyebrow {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.25);
          border-radius:100px;padding:4px 14px;
          font-size:12px;color:#a78bfa;font-weight:500;
          margin-bottom:20px;letter-spacing:0.5px;
        }
        .feat-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(32px,4vw,52px);
          font-weight:800;color:#fff;
          letter-spacing:-1.5px;line-height:1.1;margin-bottom:16px;
        }
        .feat-title span {
          background:linear-gradient(135deg,#a78bfa,#60a5fa);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .feat-desc { font-size:17px;color:rgba(255,255,255,0.4);max-width:480px;margin:0 auto;line-height:1.7;font-weight:300; }

        /* Bento Grid Responsiveness */
        .bento-grid {
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:16px;
          position:relative;z-index:2;
          max-width:1100px;margin:0 auto;
        }

        .bento-card {
          background:rgba(255,255,255,0.035);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:20px;
          padding:28px;
          position:relative;
          overflow:hidden;
          transition:transform 0.3s, border-color 0.3s;
        }
        .bento-card:hover { transform: translateY(-4px); border-color: rgba(124,58,237,0.3); }

        .card-title { font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#fff;margin-bottom:8px;line-height:1.3; }
        .card-body { font-size:14px;color:rgba(255,255,255,0.45);line-height:1.65;font-weight:300; }

        .stat-big {
          font-family:'Syne',sans-serif;
          font-size:clamp(40px, 5vw, 52px);font-weight:800;
          background:linear-gradient(135deg,#a78bfa,#60a5fa);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          line-height:1;margin:12px 0 4px;
        }

        .progress-bar-wrap { margin-top:16px; }
        .progress-label { display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:6px; }
        .progress-track { height:4px;background:rgba(255,255,255,0.08);border-radius:100px;overflow:hidden; }
        .progress-fill { height:100%;border-radius:100px;background:linear-gradient(90deg,#7c3aed,#60a5fa); }

        .event-pill {
          display:flex;align-items:center;gap:10px;
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);
          border-radius:12px;padding:10px 14px;margin-bottom:8px;
        }
        .event-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
        .event-info { flex:1; }
        .event-name { font-size:13px;font-weight:500;color:rgba(255,255,255,0.85); }
        .event-time { font-size:11px;color:rgba(255,255,255,0.35);margin-top:1px; }
        .event-badge { font-size:10px;padding:2px 8px;border-radius:100px; }

        @keyframes spinSlow { from{transform:rotate(0)} to{transform:rotate(360deg)} }

        /* TABLET */
        @media(max-width:900px){
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .feat-wrap { padding: 80px 30px; }
          .premium-ui-flex { flex-direction: column !important; gap: 20px !important; }
        }

        /* MOBILE */
        @media(max-width:600px){
          .bento-grid { grid-template-columns: 1fr; }
          .feat-wrap { padding: 60px 16px; }
          .feat-header { margin-bottom: 40px; }
          .bento-card { padding: 20px; grid-column: span 1 !important; grid-row: span 1 !important; }
          .premium-ui-flex { flex-direction: column !important; }
          .premium-ui-grid { grid-template-columns: 1fr 1fr !important; }
          .feat-desc { font-size: 15px; }
        }
      `}</style>

      <section id="features" className="feat-wrap">
        <div className="feat-header">
          <div className="feat-eyebrow">✦ Everything you need</div>
          <h2 className="feat-title">Built for how you<br /><span>actually work</span></h2>
          <p className="feat-desc">Every feature is designed to remove friction and add intelligence to your daily schedule.</p>
        </div>

        <div className="bento-grid">

          {/* Card 1 – Two-way sync (Tall on Desktop, Normal on Mobile) */}
          <div className="bento-card" style={{ gridRow: 'span 2', borderTop: '2px solid #7c3aed' }}>
            <Tag color="#a78bfa">Google Calendar Sync</Tag>
            <div className="card-title">Two-way sync,<br />zero effort</div>
            <p className="card-body">Events you create, edit, or delete in Planix instantly reflect in your Google Calendar — and vice versa.</p>
            <div style={{ marginTop:24 }}>
              <SyncViz />
              <div style={{ marginTop:16 }}>
                {[
                  { name:'Team Standup', time:'9:00 AM', color:'#7c3aed', badge:'Synced', bc:'#7c3aed' },
                  { name:'Product Review', time:'2:30 PM', color:'#3b82f6', badge:'Synced', bc:'#3b82f6' },
                  { name:'Client Call', time:'Tomorrow', color:'#10b981', badge:'Pending', bc:'#f59e0b' },
                ].map(e => (
                  <div key={e.name} className="event-pill">
                    <div className="event-dot" style={{ background:e.color }} />
                    <div className="event-info">
                      <div className="event-name">{e.name}</div>
                      <div className="event-time">{e.time}</div>
                    </div>
                    <span className="event-badge" style={{ background:`${e.bc}22`,color:e.bc,border:`1px solid ${e.bc}44` }}>{e.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2 – Smart Reminders */}
          <div className="bento-card" style={{ borderTop: '2px solid #3b82f6' }}>
            <Tag color="#60a5fa">Smart Reminders</Tag>
            <div className="card-title">Reminders that actually remind you</div>
            <p className="card-body">Custom messages. Precise trigger times. Server-side CRON never misses a beat.</p>
            <div style={{ display:'flex',justifyContent:'center',marginTop:20 }}>
              <AnimClock />
            </div>
          </div>

          {/* Card 3 – Security */}
          <div className="bento-card" style={{ borderTop: '2px solid #10b981' }}>
            <Tag color="#10b981">Security First</Tag>
            <div className="card-title">Sign in with Google</div>
            <p className="card-body">OAuth 2.0 SSO. JWT in HTTP-only cookies. Zero new passwords to remember.</p>
            <div style={{ marginTop:20,display:'flex',flexDirection:'column',gap:10 }}>
              {[
                { label:'OAuth 2.0', pct:100, color:'#10b981' },
                { label:'XSS Protection', pct:100, color:'#3b82f6' },
                { label:'Session Security', pct:100, color:'#7c3aed' },
              ].map(b => (
                <div className="progress-bar-wrap" key={b.label}>
                  <div className="progress-label"><span>{b.label}</span><span style={{ color:'#fff' }}>Active</span></div>
                  <div className="progress-track"><div className="progress-fill" style={{ width:`${b.pct}%`,background:b.color }} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4 – Reliability (Gradient Stat) */}
          <div className="bento-card" style={{ background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.1))' }}>
            <Tag color="#a78bfa">Reliability</Tag>
            <div className="stat-big">99.9%</div>
            <div className="card-title" style={{ fontSize:16 }}>Uptime SLA</div>
            <p className="card-body">Always-on background job system checks reminders every 60 seconds.</p>
          </div>

          {/* Card 5 – Premium UI (Wide on Desktop, Stacked on Mobile) */}
          <div className="bento-card" style={{ gridColumn: 'span 2', borderTop: '2px solid #f59e0b' }}>
            <Tag color="#f59e0b">Premium UI</Tag>
            <div className="premium-ui-flex" style={{ display:'flex', gap:24, alignItems:'center' }}>
              <div style={{ flex:1 }}>
                <div className="card-title">Glassmorphic,<br />distraction-free</div>
                <p className="card-body">Built with Tailwind CSS v4. Frosted glass components, animated SVGs, fully responsive on every device.</p>
              </div>
              <div className="premium-ui-grid" style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  { label:'Frosted Glass', color:'rgba(124,58,237,0.3)' },
                  { label:'Animated SVG', color:'rgba(59,130,246,0.3)' },
                  { label:'Dark Mode', color:'rgba(16,185,129,0.3)' },
                  { label:'Mobile First', color:'rgba(245,158,11,0.3)' },
                ].map(p => (
                  <div key={p.label} style={{
                    background:p.color, borderRadius:10, padding:'12px',
                    fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.7)',
                    textAlign:'center', border:'1px solid rgba(255,255,255,0.1)',
                  }}>{p.label}</div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default FeatureSection;