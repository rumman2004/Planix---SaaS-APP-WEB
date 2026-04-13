import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, CheckCircle2, RefreshCw, Bell, Shield, Zap, ChevronRight, Star } from 'lucide-react';
import { Button } from '../../components/ui';

const FEATURES = [
  {
    icon: RefreshCw, color: 'blue', title: 'Two-Way Google Sync',
    desc: 'Every event you create, edit, or delete instantly reflects in your Google Calendar — and vice versa. Real-time, always in sync.',
  },
  {
    icon: Bell, color: 'purple', title: 'Smart Reminder Engine',
    desc: 'Attach custom messages and precise trigger times. A server-side CRON job dispatches your notifications at exactly the right moment.',
  },
  {
    icon: Shield, color: 'teal', title: 'Bulletproof Auth',
    desc: 'Google OAuth 2.0 SSO — no new password needed. Sessions use HTTP-only JWT cookies, protecting you from XSS.',
  },
  {
    icon: Zap, color: 'amber', title: 'Distraction-Free UI',
    desc: 'A focused glassmorphic workspace that gets out of your way so you can think clearly and plan effectively.',
  },
];

const STEPS = [
  { n: 1, title: 'Sign in with Google', desc: 'One click. No new password. We use Google OAuth 2.0 for secure single sign-on.' },
  { n: 2, title: 'Events appear instantly', desc: 'Planix fetches your Google Calendar data and displays it in a clean, focused view.' },
  { n: 3, title: 'Set smart reminders', desc: 'Attach custom messages and precise trigger times. Our CRON engine handles the rest.' },
  { n: 4, title: 'Everything stays in sync', desc: 'Changes in Planix push to Google Calendar — and vice versa. One source of truth.' },
];

const PREVIEW_EVENTS = [
  { title: 'Team Standup',    time: '09:00–09:30', color: '#5b8af0', recur: 'Weekly' },
  { title: 'Design Review',  time: '11:30–12:30', color: '#9b72f0', recur: null     },
  { title: 'Sprint Planning', time: '15:00–17:00', color: '#f0a63a', recur: 'Biweekly' },
];

const IC = { blue: '#5b8af0', purple: '#9b72f0', teal: '#22d3a5', amber: '#f0a63a' };

export default function Home() {
  const navigate = useNavigate();
  const handleLogin = () => {
    const url = import.meta.env.VITE_BACKEND_API_URI || 'http://localhost:5000/api';
    window.location.href = `${url}/auth/google`;
  };

  return (
    <div className="hp">
      {/* Ambient orbs */}
      <div className="orb" style={{ width: 700, height: 700, background: 'rgba(91,138,240,0.09)', top: -200, left: -200 }} />
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(155,114,240,0.07)', top: '40%', right: -150 }} />
      <div className="orb" style={{ width: 400, height: 400, background: 'rgba(34,211,165,0.06)', bottom: -100, left: '30%' }} />

      {/* ── Nav ── */}
      <nav className="hp-nav glass">
        <div className="hp-brand" onClick={() => navigate('/')}>
          <div className="hp-logo"><Calendar size={18} strokeWidth={2.5} /></div>
          <span className="hp-brand-name">Planix</span>
        </div>
        <div className="hp-nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <button className="nav-ghost-btn" onClick={() => navigate('/dashboard')}>Sign in</button>
          <button className="nav-primary-btn" onClick={handleLogin}>
            Get started free <ArrowRight size={14} />
          </button>
        </div>
        {/* Mobile nav */}
        <button className="mobile-cta" onClick={handleLogin}>Start free</button>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-eyebrow glass">
          <div className="eyebrow-dot" />
          <span>Free · No credit card · Syncs with Google Calendar</span>
        </div>

        <h1 className="hero-h1">
          The calendar app<br />
          <span className="hero-gradient">that thinks ahead.</span>
        </h1>

        <p className="hero-p">
          Planix is an intelligent layer over Google Calendar — seamlessly syncing events,
          dispatching smart reminders, and presenting everything in a beautiful, focused workspace.
        </p>

        <div className="hero-cta">
          <button className="cta-primary" onClick={handleLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
            <ArrowRight size={15} />
          </button>
          <button className="cta-ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            See features <ChevronRight size={15} />
          </button>
        </div>

        {/* Trust badges */}
        <div className="trust-row">
          {['Free forever', 'No ads', 'Open sync'].map(t => (
            <div key={t} className="trust-badge">
              <CheckCircle2 size={12} /> {t}
            </div>
          ))}
        </div>

        {/* ── App mockup ── */}
        <div className="hero-app glass">
          {/* Sidebar mock */}
          <div className="mock-sidebar">
            <div className="mock-brand">
              <div className="mock-logo" /><div className="mock-brand-text" />
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`mock-nav-item ${i === 1 ? 'active' : ''}`}>
                <div className="mock-icon" />
                <div className="mock-label" />
              </div>
            ))}
          </div>
          {/* Content mock */}
          <div className="mock-content">
            <div className="mock-header">
              <div>
                <div className="mock-title" />
                <div className="mock-sub" />
              </div>
              <div className="mock-btn" />
            </div>
            <div className="mock-stats">
              {['#5b8af0', '#9b72f0', '#22d3a5', '#f0a63a'].map(c => (
                <div key={c} className="mock-stat">
                  <div className="mock-stat-num" style={{ background: `${c}25`, width: 38, height: 38, borderRadius: 9 }} />
                  <div className="mock-stat-label" />
                </div>
              ))}
            </div>
            <div className="mock-events">
              {PREVIEW_EVENTS.map((ev, i) => (
                <div key={i} className="mock-event" style={{ borderLeft: `2px solid ${ev.color}`, animationDelay: `${i * 0.15}s` }}>
                  <div className="mev-top">
                    <span className="mev-title">{ev.title}</span>
                    {ev.recur && (
                      <span className="mev-recur" style={{ color: ev.color }}>
                        <RefreshCw size={9} /> {ev.recur}
                      </span>
                    )}
                  </div>
                  <div className="mev-time" style={{ color: ev.color }}>{ev.time}</div>
                  <div className="mev-synced">✓ Synced to Google</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="features-sec">
        <div className="sec-eyebrow">Features</div>
        <h2 className="sec-h2">Everything you need, nothing you don't.</h2>
        <p className="sec-p">Built to be a smart companion to your Google Calendar — not a replacement.</p>
        <div className="feat-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card glass">
              <div className="feat-icon" style={{ background: `${IC[f.color]}18`, color: IC[f.color] }}>
                <f.icon size={20} />
              </div>
              <h3 className="feat-title">{f.title}</h3>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="how-sec">
        <div className="sec-eyebrow">How it works</div>
        <h2 className="sec-h2">Up and running in under a minute.</h2>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={s.n} className="step glass">
              <div className="step-num">{s.n}</div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
              <div className="step-body">
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-sec">
        <div className="cta-inner glass">
          <div className="cta-icon"><Calendar size={28} /></div>
          <h2 className="cta-h2">Ready to supercharge your schedule?</h2>
          <p className="cta-p">It takes 30 seconds — no credit card required.</p>
          <button className="cta-primary" onClick={handleLogin} style={{ fontSize: '1rem', padding: '14px 32px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="hp-logo" style={{ width: 26, height: 26 }}><Calendar size={14} /></div>
          <span className="footer-name">Planix</span>
        </div>
        <span className="footer-copy">© {new Date().getFullYear()} Planix — Built with Google Calendar API</span>
      </footer>

      <style>{`
        .hp { background: var(--bg); color: var(--text); min-height: 100vh; position: relative; overflow-x: hidden; }
        .orb { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; animation: orbDrift 20s ease-in-out infinite alternate; }
        @keyframes orbDrift { from { transform: translate(0,0); } to { transform: translate(40px,30px); } }

        /* Nav */
        .hp-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 48px; position: sticky; top: 0; z-index: 100;
          border-bottom: 1px solid var(--glass-border); border-radius: 0;
        }
        .hp-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .hp-logo {
          width: 34px; height: 34px; border-radius: 9px; background: var(--accent-dim);
          border: 1px solid rgba(91,138,240,0.3); display: flex; align-items: center;
          justify-content: center; color: var(--accent);
        }
        .hp-brand-name { font-size: 1.1rem; font-weight: 800; letter-spacing: -0.4px; }
        .hp-nav-links { display: flex; align-items: center; gap: 24px; font-size: 0.85rem; }
        .hp-nav-links a { color: var(--text-2); transition: color 0.18s; text-decoration: none; }
        .hp-nav-links a:hover { color: var(--text); }
        .nav-ghost-btn { background: none; border: 1px solid var(--glass-border); border-radius: 9px; color: var(--text-2); padding: 7px 16px; cursor: pointer; font-size: 0.84rem; font-family: inherit; transition: all 0.18s; }
        .nav-ghost-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }
        .nav-primary-btn { background: var(--accent); border: none; border-radius: 9px; color: white; padding: 8px 16px; cursor: pointer; font-size: 0.84rem; font-weight: 600; font-family: inherit; display: flex; align-items: center; gap: 6px; transition: opacity 0.18s; }
        .nav-primary-btn:hover { opacity: 0.88; }
        .mobile-cta { display: none; background: var(--accent); border: none; border-radius: 9px; color: white; padding: 8px 14px; font-size: 0.82rem; font-weight: 600; font-family: inherit; cursor: pointer; }

        /* Hero */
        .hero {
          position: relative; z-index: 1; display: flex; flex-direction: column;
          align-items: center; text-align: center; padding: 90px 24px 60px; gap: 24px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px;
          border-radius: 99px; font-size: 0.78rem; color: var(--text-2);
          animation: fadeUp 0.5s ease both;
        }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #22d3a5; animation: pulse 2s ease infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.8); } }
        .hero-h1 {
          font-size: clamp(2.6rem, 6vw, 5rem); font-weight: 900; line-height: 1.06;
          letter-spacing: -2.5px; animation: fadeUp 0.55s 0.05s ease both;
        }
        .hero-gradient {
          background: linear-gradient(135deg, #5b8af0, #9b72f0, #22d3a5);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-p {
          max-width: 520px; color: var(--text-2); font-size: 1rem; line-height: 1.8;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; animation: fadeUp 0.6s 0.15s ease both; }

        /* CTA buttons */
        .cta-primary {
          display: inline-flex; align-items: center; gap: 10px; background: var(--accent);
          border: none; border-radius: 12px; color: white; padding: 12px 24px;
          font-size: 0.92rem; font-weight: 600; font-family: inherit; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 20px rgba(91,138,240,0.3);
        }
        .cta-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(91,138,240,0.4); }
        .cta-ghost {
          display: inline-flex; align-items: center; gap: 6px; background: none;
          border: 1px solid var(--glass-border); border-radius: 12px; color: var(--text-2);
          padding: 12px 20px; font-size: 0.92rem; font-family: inherit; cursor: pointer; transition: all 0.2s;
        }
        .cta-ghost:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }

        /* Trust */
        .trust-row { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; animation: fadeUp 0.6s 0.2s ease both; }
        .trust-badge { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: var(--text-3); }
        .trust-badge svg { color: #22d3a5; }

        /* App mockup */
        .hero-app {
          margin-top: 16px; border-radius: 20px; overflow: hidden;
          width: min(900px, 95vw); height: 380px; display: flex;
          animation: fadeUp 0.7s 0.25s ease both;
        }
        .mock-sidebar {
          width: 180px; flex-shrink: 0; background: rgba(255,255,255,0.02);
          border-right: 1px solid var(--glass-border); padding: 20px 14px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .mock-brand { display: flex; gap: 8px; align-items: center; margin-bottom: 16px; }
        .mock-logo { width: 28px; height: 28px; border-radius: 8px; background: var(--accent-dim); }
        .mock-brand-text { width: 60px; height: 12px; border-radius: 6px; background: var(--surface-3); }
        .mock-nav-item { display: flex; gap: 8px; align-items: center; padding: 8px 10px; border-radius: 9px; }
        .mock-nav-item.active { background: var(--accent-dim); }
        .mock-icon { width: 16px; height: 16px; border-radius: 4px; background: var(--surface-3); flex-shrink: 0; }
        .mock-label { width: 60px; height: 10px; border-radius: 5px; background: var(--surface-3); }
        .mock-nav-item.active .mock-icon { background: rgba(91,138,240,0.4); }
        .mock-nav-item.active .mock-label { background: rgba(91,138,240,0.25); }
        .mock-content { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }
        .mock-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .mock-title { width: 200px; height: 16px; border-radius: 8px; background: var(--surface-3); margin-bottom: 6px; }
        .mock-sub { width: 120px; height: 10px; border-radius: 5px; background: var(--surface-2); }
        .mock-btn { width: 90px; height: 32px; border-radius: 9px; background: var(--accent-dim); border: 1px solid rgba(91,138,240,0.2); }
        .mock-stats { display: flex; gap: 10px; }
        .mock-stat { flex: 1; background: var(--surface-1); border: 1px solid var(--surface-2); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .mock-stat-label { height: 8px; border-radius: 4px; background: var(--surface-3); }
        .mock-events { display: flex; flex-direction: column; gap: 8px; }
        .mock-event {
          background: var(--surface-1); border: 1px solid var(--surface-2); border-radius: 9px;
          padding: 10px 14px; animation: fadeUp 0.5s ease both;
        }
        .mev-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .mev-title { font-size: 0.82rem; font-weight: 700; color: var(--text); }
        .mev-recur { display: flex; align-items: center; gap: 3px; font-size: 0.65rem; font-weight: 600; }
        .mev-time { font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; margin-bottom: 3px; }
        .mev-synced { font-size: 0.65rem; color: #22d3a5; font-weight: 600; }

        /* Sections */
        .features-sec, .how-sec {
          position: relative; z-index: 1; padding: 80px 48px;
          max-width: 1100px; margin: 0 auto;
        }
        .sec-eyebrow { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent); margin-bottom: 12px; }
        .sec-h2 { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; letter-spacing: -0.8px; margin-bottom: 10px; }
        .sec-p { color: var(--text-2); font-size: 0.95rem; margin-bottom: 40px; line-height: 1.7; max-width: 520px; }

        .feat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .feat-card { padding: 28px; border-radius: 16px; transition: transform 0.22s; border: 1px solid var(--glass-border); }
        .feat-card:hover { transform: translateY(-4px); }
        .feat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .feat-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
        .feat-desc { font-size: 0.82rem; color: var(--text-2); line-height: 1.65; }

        /* Steps */
        .steps { display: flex; flex-direction: column; gap: 0; }
        .step { display: flex; gap: 20px; align-items: flex-start; padding: 24px 28px; border-radius: 14px; position: relative; margin-bottom: 8px; border: 1px solid var(--glass-border); }
        .step-num {
          width: 38px; height: 38px; border-radius: 50%; background: var(--accent-dim);
          border: 1px solid rgba(91,138,240,0.3); color: var(--accent);
          font-size: 0.95rem; font-weight: 800; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
        }
        .step-connector { display: none; }
        .step-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
        .step-desc { font-size: 0.82rem; color: var(--text-2); line-height: 1.6; }

        /* CTA section */
        .cta-sec { position: relative; z-index: 1; padding: 0 48px 60px; }
        .cta-inner {
          max-width: 700px; margin: 0 auto; border-radius: 20px; padding: 60px 48px;
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;
          border: 1px solid var(--glass-border);
        }
        .cta-icon { width: 56px; height: 56px; border-radius: 16px; background: var(--accent-dim); color: var(--accent); display: flex; align-items: center; justify-content: center; }
        .cta-h2 { font-size: 2rem; font-weight: 800; letter-spacing: -0.8px; }
        .cta-p { color: var(--text-2); font-size: 0.9rem; }

        /* Footer */
        .footer {
          display: flex; align-items: center; justify-content: space-between; padding: 20px 48px;
          border-top: 1px solid var(--glass-border); position: relative; z-index: 1;
        }
        .footer-brand { display: flex; align-items: center; gap: 8px; }
        .footer-name { font-weight: 700; font-size: 0.9rem; }
        .footer-copy { color: var(--text-3); font-size: 0.78rem; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .hp-nav { padding: 12px 20px; }
          .hp-nav-links { display: none; }
          .mobile-cta { display: block; }
          .hero { padding: 60px 16px 40px; }
          .hero-h1 { letter-spacing: -1.5px; }
          .features-sec, .how-sec { padding: 60px 20px; }
          .hero-app { height: 260px; }
          .mock-sidebar { display: none; }
          .cta-sec { padding: 0 16px 40px; }
          .cta-inner { padding: 40px 24px; }
          .footer { padding: 16px 20px; flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>
    </div>
  );
}