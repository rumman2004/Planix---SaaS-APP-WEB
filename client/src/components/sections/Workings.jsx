import React, { useState, useEffect, useRef } from 'react';
import { LogIn, CalendarSync, Edit3, BellRing, Sparkles } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Connect Your Google Account',
    desc: 'Click "Get Started" and sign in securely via Google OAuth 2.0. No new password. One click and you\'re in.',
    color: '#7c3aed',
    icon: <LogIn size={28} color="#7c3aed" strokeWidth={2} />,
    detail: 'Google passes a secure code to our backend. We exchange it for tokens, create your account, and issue a JWT in an HTTP-only cookie.',
  },
  {
    num: '02',
    title: 'Your Calendar Loads Instantly',
    desc: 'Planix silently fetches all your existing Google Calendar events. Everything you had is right there — no migration needed.',
    color: '#3b82f6',
    icon: <CalendarSync size={28} color="#3b82f6" strokeWidth={2} />,
    detail: 'We use your stored refresh token to pull the latest events from Google Calendar API and display them in our polished dashboard.',
  },
  {
    num: '03',
    title: 'Manage, Create & Edit',
    desc: 'Add new events, set custom reminder messages, pick precise trigger times. Everything syncs back to Google Calendar in real time.',
    color: '#10b981',
    icon: <Edit3 size={28} color="#10b981" strokeWidth={2} />,
    detail: 'The React frontend sends changes to our Express backend. The controller saves to PostgreSQL and pushes to Google Calendar simultaneously.',
  },
  {
    num: '04',
    title: 'Smart Reminders Fire Automatically',
    desc: 'Our backend CRON job runs every 60 seconds. When your reminder time hits, you get notified — automatically.',
    color: '#f59e0b',
    icon: <BellRing size={28} color="#f59e0b" strokeWidth={2} />,
    detail: 'node-cron monitors the PostgreSQL reminders table. When criteria match, a notification is dispatched instantly — no manual refresh needed.',
  },
];

const Workings = () => {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a+1) % steps.length), 3500);
    return () => clearInterval(id);
  }, []);

  const s = steps[active];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .work-wrap * { box-sizing:border-box;margin:0;padding:0; }
        .work-wrap {
          font-family:'DM Sans',sans-serif;
          background:#05040f;
          padding:100px 60px;
          position:relative;
          overflow:hidden;
        }
        .work-wrap::before {
          content:'';position:absolute;inset:0;
          background-image:linear-gradient(rgba(120,80,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(120,80,255,0.05) 1px,transparent 1px);
          background-size:60px 60px;pointer-events:none;
        }

        .work-inner { max-width:1100px;margin:0 auto; }

        .work-header { text-align:center;margin-bottom:72px; }
        .work-eyebrow {
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);
          border-radius:100px;padding:4px 14px;
          font-size:12px;color:#60a5fa;font-weight:500;margin-bottom:20px;
        }
        .work-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(28px,5vw,52px);font-weight:800;
          color:#fff;letter-spacing:-1.5px;line-height:1.1;margin-bottom:14px;
        }
        .work-title span {
          background:linear-gradient(135deg,#60a5fa,#a78bfa);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .work-sub { font-size:clamp(15px, 2vw, 17px);color:rgba(255,255,255,0.4);max-width:460px;margin:0 auto;line-height:1.7;font-weight:300; }

        .work-layout { display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center; }

        /* Steps list */
        .steps-list { display:flex;flex-direction:column;gap:4px; }
        .step-item {
          display:flex;gap:16px;padding:18px 20px;border-radius:16px;
          cursor:pointer;transition:all 0.3s;border:1px solid transparent;
          position:relative;
        }
        .step-item.active { background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1); }
        .step-item:hover:not(.active) { background:rgba(255,255,255,0.02); }

        .step-num {
          font-family:'Syne',sans-serif;font-size:11px;font-weight:800;
          color:rgba(255,255,255,0.2);min-width:24px;padding-top:2px;letter-spacing:1px;
          transition:color 0.3s;
        }
        .step-item.active .step-num { color:inherit; }

        .step-content {}
        .step-title { font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:rgba(255,255,255,0.5);margin-bottom:4px;transition:color 0.3s; }
        .step-item.active .step-title { color:#fff; }
        .step-desc { font-size:13px;color:rgba(255,255,255,0.3);line-height:1.6;display:none; }
        .step-item.active .step-desc { display:block;color:rgba(255,255,255,0.55); }

        .step-progress {
          position:absolute;left:0;top:0;bottom:0;width:2px;border-radius:100px;
          background:rgba(255,255,255,0.05);overflow:hidden;
        }
        .step-progress-fill {
          width:100%;background:var(--clr);
          animation:fillDown 3.5s linear forwards;
          border-radius:100px;
        }
        @keyframes fillDown { from{height:0} to{height:100%} }

        /* Right panel */
        .work-panel {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:24px;padding:36px;
          position:relative;overflow:hidden;
          min-height:360px;
          display:flex;flex-direction:column;justify-content:space-between;
        }
        .panel-top { display:flex;align-items:flex-start;gap:16px;margin-bottom:24px; }
        .panel-icon {
          width:60px;height:60px;border-radius:16px;
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;
        }
        .panel-icon svg { width: 28px; height: 28px; }
        .panel-num { font-family:'Syne',sans-serif;font-size:80px;font-weight:800;line-height:1;
          position:absolute;right:28px;top:20px;
          background:linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0));
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .panel-title { font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#fff;line-height:1.2;margin-bottom:10px; }
        .panel-desc { font-size:15px;color:rgba(255,255,255,0.45);line-height:1.7;font-weight:300;margin-bottom:20px; }
        .panel-detail {
          background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);
          border-radius:12px;padding:14px 16px;
          font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6;
        }
        .panel-detail::before { content:'ℹ️  '; }

        .dots { display:flex;gap:8px;justify-content:center;margin-top:16px; }
        .dot { width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.15);transition:all 0.3s; }
        .dot.active { width:20px;border-radius:100px; }

        /* Tablet Scaling */
        @media(max-width:900px){
          .work-layout { grid-template-columns:1fr; gap: 30px; }
          .work-wrap { padding:60px 24px; }
          .work-header { margin-bottom: 40px; }
        }

        /* Ultra-Compact Mobile Scaling */
        @media(max-width:600px){
          .work-wrap { padding:40px 12px; }
          .work-title { font-size: 28px; letter-spacing: -1px; margin-bottom: 10px; }
          .work-sub { font-size: 14px; line-height: 1.5; }
          
          .steps-list { gap: 0px; }
          .step-item { padding: 12px 10px; gap: 12px; border-radius: 12px; }
          .step-num { min-width: 20px; font-size: 10px; }
          .step-title { font-size: 14px; margin-bottom: 2px; }
          .step-desc { font-size: 12px; line-height: 1.4; }

          .work-panel { 
            padding: 20px; 
            min-height: auto; 
            border-radius: 16px;
          }
          .panel-top { margin-bottom: 16px; }
          .panel-num { font-size: 44px; right: 16px; top: 12px; }
          .panel-icon { width: 44px; height: 44px; border-radius: 12px; }
          .panel-icon svg { width: 22px; height: 22px; }
          
          .panel-title { font-size: 20px; margin-bottom: 8px; }
          .panel-desc { font-size: 13px; margin-bottom: 16px; line-height: 1.5; }
          .panel-detail { padding: 10px 12px; font-size: 11px; border-radius: 10px; }
          
          .dots { margin-top: 16px; }
        }
      `}</style>

      <section id="how-it-works" className="work-wrap" ref={ref}>
        <div className="work-inner">
          <div className="work-header">
            <div className="work-eyebrow">
              <Sparkles size={14} /> The Journey
            </div>
            <h2 className="work-title">Up and running<br /><span>in 4 steps</span></h2>
            <p className="work-sub">From first click to full automation — Planix gets you productive in under a minute.</p>
          </div>

          <div className="work-layout">
            {/* Steps */}
            <div className="steps-list">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`step-item${active === i ? ' active' : ''}`}
                  style={{ '--clr': step.color }}
                  onClick={() => setActive(i)}
                >
                  {active === i && (
                    <div className="step-progress">
                      <div className="step-progress-fill" key={`${i}-${active}`} style={{ background:step.color }} />
                    </div>
                  )}
                  <div className="step-num" style={active===i?{color:step.color}:{}}>{step.num}</div>
                  <div className="step-content">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel */}
            <div className="work-panel" style={{ borderTop:`2px solid ${s.color}` }}>
              <div className="panel-num">{s.num}</div>
              <div>
                <div className="panel-top">
                  <div className="panel-icon" style={{ background:`${s.color}22`,border:`1px solid ${s.color}44` }}>
                    {s.icon}
                  </div>
                </div>
                <div className="panel-title">{s.title}</div>
                <div className="panel-desc">{s.desc}</div>
                <div className="panel-detail">{s.detail}</div>
              </div>
              <div className="dots">
                {steps.map((_, i) => (
                  <div key={i} className={`dot${active===i?' active':''}`} style={active===i?{background:s.color}:{}} onClick={()=>setActive(i)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Workings;