import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ListTodo, 
  Bell, 
  Settings, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  Zap, 
  Lock, 
  Smartphone, 
  BellRing, 
  Moon 
} from 'lucide-react';

const events = [
  { title:'Team Standup', time:'9:00 AM', dur:'30 min', color:'#7c3aed', tag:'Work' },
  { title:'Design Review', time:'11:00 AM', dur:'1 hr', color:'#3b82f6', tag:'Design' },
  { title:'Lunch Break', time:'1:00 PM', dur:'1 hr', color:'#10b981', tag:'Personal' },
  { title:'Client Demo', time:'3:00 PM', dur:'45 min', color:'#f59e0b', tag:'Sales' },
  { title:'Team Retro', time:'5:00 PM', dur:'1 hr', color:'#ec4899', tag:'Work' },
];

const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const today = 3; // Thursday

const MockDashboard = () => {
  const [activeEvent, setActiveEvent] = useState(0);
  const [reminderVisible, setReminderVisible] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setActiveEvent(a => (a+1)%events.length), 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setReminderVisible(true), 1200);
    return () => clearTimeout(id);
  }, []);

  const e = events[activeEvent];

  return (
    <div className="mock-dash-root" style={{
      background:'rgba(10,8,25,0.95)',
      border:'1px solid rgba(255,255,255,0.1)',
      borderRadius:20,
      overflow:'hidden',
      fontFamily:'DM Sans,sans-serif',
      maxWidth:700,
      margin:'0 auto',
      boxShadow:'0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.2)',
      position: 'relative' // Needed for absolute positioning of toast
    }}>
      {/* Window chrome */}
      <div style={{ display:'flex',alignItems:'center',gap:8,padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)' }}>
        <div style={{ width:10,height:10,borderRadius:'50%',background:'#ef4444',opacity:0.7 }}/>
        <div style={{ width:10,height:10,borderRadius:'50%',background:'#f59e0b',opacity:0.7 }}/>
        <div style={{ width:10,height:10,borderRadius:'50%',background:'#10b981',opacity:0.7 }}/>
        <div style={{ flex:1,textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.25)' }}>planix.app/dashboard</div>
      </div>

      {/* App layout */}
      <div className="mock-layout">
        {/* Sidebar */}
        <div className="mock-sidebar" style={{ borderRight:'1px solid rgba(255,255,255,0.06)',padding:'20px 12px' }}>
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:24,padding:'0 8px' }}>
            <div style={{ width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="white" strokeWidth="2.5" fill="none"/><line x1="3" y1="9" x2="21" y2="9" stroke="white" strokeWidth="2.5"/></svg>
            </div>
            <span style={{ fontSize:14,fontWeight:700,color:'#fff',fontFamily:'Syne,sans-serif' }}>Planix</span>
          </div>

          {[
            { label:'Dashboard', active:true, icon: <LayoutDashboard size={14} /> },
            { label:'Calendar', active:false, icon: <Calendar size={14} /> },
            { label:'Events', active:false, icon: <ListTodo size={14} /> },
            { label:'Reminders', active:false, icon: <Bell size={14} /> },
            { label:'Settings', active:false, icon: <Settings size={14} /> },
          ].map(item => (
            <div key={item.label} style={{
              display:'flex',alignItems:'center',gap:10,
              padding:'8px 10px',borderRadius:8,marginBottom:2,
              background:item.active?'rgba(124,58,237,0.2)':'transparent',
              fontSize:12,color:item.active?'#a78bfa':'rgba(255,255,255,0.35)',
              cursor:'pointer',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </div>
          ))}

          <div style={{ marginTop:20,padding:'0 8px' }}>
            <div style={{ fontSize:10,color:'rgba(255,255,255,0.2)',marginBottom:8,letterSpacing:'0.5px',textTransform:'uppercase' }}>Calendars</div>
            {[
              { label:'My Calendar', color:'#7c3aed' },
              { label:'Work', color:'#3b82f6' },
              { label:'Personal', color:'#10b981' },
            ].map(c => (
              <div key={c.label} style={{ display:'flex',alignItems:'center',gap:8,padding:'4px 0',fontSize:11,color:'rgba(255,255,255,0.4)' }}>
                <div style={{ width:8,height:8,borderRadius:'50%',background:c.color,flexShrink:0 }}/>
                {c.label}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mock-main" style={{ padding:20 }}>
          {/* Header */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20 }}>
            <div>
              <div className="mock-month-title" style={{ fontSize:18,fontWeight:800,color:'#fff',fontFamily:'Syne,sans-serif',letterSpacing:-0.5 }}>April 2025</div>
              <div style={{ fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:1 }}>5 events today</div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:8 }}>
              <div className="mock-nav-btn" style={{ width:28,height:28,borderRadius:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'rgba(255,255,255,0.5)' }}>
                <ArrowLeft size={14} />
              </div>
              <div className="mock-nav-btn" style={{ width:28,height:28,borderRadius:7,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'rgba(255,255,255,0.5)' }}>
                <ArrowRight size={14} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 12px',borderRadius:7,background:'rgba(124,58,237,0.2)',border:'1px solid rgba(124,58,237,0.3)',fontSize:11,color:'#a78bfa',cursor:'pointer' }}>
                <Plus size={12} /> <span className="mock-add-text">Event</span>
              </div>
            </div>
          </div>

          {/* Day strip */}
          <div style={{ display:'flex',gap:4,marginBottom:16 }}>
            {days.map((d, i) => (
              <div key={d} style={{
                flex:1,textAlign:'center',padding:'6px 4px',borderRadius:8,
                background:i===today?'rgba(124,58,237,0.2)':'transparent',
                border:`1px solid ${i===today?'rgba(124,58,237,0.4)':'transparent'}`,
                cursor:'pointer',
              }}>
                <div style={{ fontSize:9,color:i===today?'#a78bfa':'rgba(255,255,255,0.3)',marginBottom:2 }}>{d}</div>
                <div style={{ fontSize:13,fontWeight:i===today?700:400,color:i===today?'#fff':'rgba(255,255,255,0.4)',fontFamily:'Syne,sans-serif' }}>{10+i}</div>
              </div>
            ))}
          </div>

          {/* Events */}
          <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
            {events.map((ev, i) => (
              <div key={i} style={{
                display:'flex',alignItems:'center',gap:10,
                padding:'9px 12px',borderRadius:10,
                background:activeEvent===i?`${ev.color}18`:'rgba(255,255,255,0.02)',
                border:`1px solid ${activeEvent===i?ev.color+'44':'rgba(255,255,255,0.05)'}`,
                transition:'all 0.3s',cursor:'pointer',
              }}>
                <div style={{ width:3,height:28,borderRadius:2,background:ev.color,flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12,fontWeight:500,color:'rgba(255,255,255,0.85)' }}>{ev.title}</div>
                  <div style={{ fontSize:10,color:'rgba(255,255,255,0.35)',marginTop:1 }}>{ev.time} · {ev.dur}</div>
                </div>
                <span className="mock-tag" style={{ fontSize:9,padding:'2px 7px',borderRadius:100,background:`${ev.color}22`,color:ev.color,border:`1px solid ${ev.color}33` }}>{ev.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reminder toast */}
      {reminderVisible && (
        <div className="mock-toast" style={{
          position:'absolute',bottom:24,right:24,
          background:'rgba(20,16,40,0.95)',
          border:'1px solid rgba(124,58,237,0.4)',
          borderRadius:14,padding:'12px 16px',
          display:'flex',alignItems:'center',gap:10,
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
          animation:'slideInToast 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
          maxWidth:260,
          zIndex:20,
        }}>
          <div style={{ width:32,height:32,borderRadius:10,background:'rgba(124,58,237,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <BellRing size={16} color="#a78bfa" />
          </div>
          <div>
            <div style={{ fontSize:11,fontWeight:600,color:'#fff' }}>Reminder: Team Standup</div>
            <div style={{ fontSize:10,color:'rgba(255,255,255,0.4)',marginTop:2 }}>Starting in 5 minutes</div>
          </div>
        </div>
      )}
    </div>
  );
};

const PreviewSection = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .prev-wrap * { box-sizing:border-box;margin:0;padding:0; }
        .prev-wrap {
          font-family:'DM Sans',sans-serif;
          background:#05040f;
          padding:100px 60px;
          position:relative;
          overflow:hidden;
        }
        .prev-wrap::before {
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse 60% 40% at 50% 100%,rgba(124,58,237,0.12),transparent);
          pointer-events:none;
        }

        .prev-inner { max-width:1100px;margin:0 auto; }
        .prev-header { text-align:center;margin-bottom:56px; }
        .prev-eyebrow {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);
          border-radius:100px;padding:4px 14px;
          font-size:12px;color:#34d399;font-weight:500;margin-bottom:20px;
        }
        .prev-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(32px,4vw,52px);font-weight:800;
          color:#fff;letter-spacing:-1.5px;line-height:1.1;margin-bottom:14px;
        }
        .prev-title span {
          background:linear-gradient(135deg,#34d399,#60a5fa);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .prev-sub { font-size:17px;color:rgba(255,255,255,0.4);max-width:480px;margin:0 auto;line-height:1.7;font-weight:300; }

        .mock-container { position:relative;padding:0 20px; }

        @keyframes slideInToast {
          from { opacity:0;transform:translateY(16px); }
          to { opacity:1;transform:translateY(0); }
        }

        .prev-badges {
          display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:40px;
        }
        .prev-badge {
          display:flex;align-items:center;gap:6px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:100px;padding:6px 16px;
          font-size:12px;color:rgba(255,255,255,0.5);
        }
        .prev-badge span { display:flex; align-items:center; justify-content:center; }

        /* Desktop Layout */
        .mock-layout { display:grid; grid-template-columns:200px 1fr; min-height:400px; }

        /* Responsive Mobile Layout */
        @media(max-width:700px){
          .prev-wrap { padding:60px 16px; }
          .mock-container { padding: 0; }
          .prev-title { font-size: 36px; }
          .prev-sub { font-size: 15px; }
          
          /* Hide sidebar and stretch main content */
          .mock-layout { grid-template-columns: 1fr; }
          .mock-sidebar { display: none; }
          
          /* Adjust main dashboard padding and fonts for mobile */
          .mock-main { padding: 16px !important; }
          .mock-month-title { font-size: 16px !important; }
          .mock-nav-btn { display: none !important; } /* Hide arrow navs to save space */
          .mock-add-text { display: none; } /* Just show the + icon */
          
          /* Toast adjustments */
          .mock-toast { 
            right: 12px !important; 
            bottom: 12px !important; 
            left: 12px !important; 
            max-width: none !important; 
          }
        }
      `}</style>

      <section id="preview" className="prev-wrap">
        <div className="prev-inner">
          <div className="prev-header">
            <div className="prev-eyebrow">
              <Sparkles size={14} /> Live Preview
            </div>
            <h2 className="prev-title">See it in<br /><span>action</span></h2>
            <p className="prev-sub">A beautiful, distraction-free workspace for everything on your schedule.</p>
          </div>

          <div className="mock-container">
            <MockDashboard />
          </div>

          <div className="prev-badges">
            {[
              { icon: <Zap size={14} />, label:'Real-time sync' },
              { icon: <Lock size={14} />, label:'JWT secured' },
              { icon: <Smartphone size={14} />, label:'Mobile responsive' },
              { icon: <BellRing size={14} />, label:'Smart reminders' },
              { icon: <Moon size={14} />, label:'Dark mode native' },
            ].map(b => (
              <div key={b.label} className="prev-badge">
                <span>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PreviewSection;