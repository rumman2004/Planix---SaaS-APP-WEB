import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, PlayCircle } from 'lucide-react';
import { Button } from '../ui';

/* ─── Animated floating orb canvas ─── */
const OrbCanvas = () => {
  const ref = useRef(null);
  
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w, h, t = 0;
    
    const resize = () => { 
      w = canvas.width = canvas.offsetWidth; 
      h = canvas.height = canvas.offsetHeight; 
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const orbs = [
      { x: 0.3, y: 0.4, r: 0.28, hue: 260, speed: 0.0004 },
      { x: 0.7, y: 0.6, r: 0.22, hue: 200, speed: 0.0006 },
      { x: 0.5, y: 0.3, r: 0.18, hue: 290, speed: 0.0003 },
    ];
    
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      orbs.forEach((o, i) => {
        const cx = w * (o.x + 0.08 * Math.sin(t * o.speed * 1000 + i));
        const cy = h * (o.y + 0.06 * Math.cos(t * o.speed * 800 + i));
        const r = Math.min(w, h) * o.r;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `hsla(${o.hue},80%,65%,0.22)`);
        g.addColorStop(1, `hsla(${o.hue},60%,40%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      });
      t++;
      raf = requestAnimationFrame(draw);
    };
    
    draw();
    return () => { 
      cancelAnimationFrame(raf); 
      window.removeEventListener('resize', resize); 
    };
  }, []);
  
  return <canvas ref={ref} style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} />;
};

/* ─── Floating calendar card ─── */
const CalCard = ({ delay, top, left, right, title, time, color }) => (
  <div style={{
    position:'absolute', top, left, right,
    background:'rgba(255,255,255,0.06)',
    border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:16, padding:'12px 16px',
    backdropFilter:'blur(20px)',
    animation:`floatCard 6s ease-in-out ${delay}s infinite`,
    minWidth:200,
  }}>
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ width:10,height:10,borderRadius:'50%',background:color,flexShrink:0 }} />
      <span style={{ fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.9)',fontFamily:'inherit' }}>{title}</span>
    </div>
    <div style={{ fontSize:11,color:'rgba(255,255,255,0.45)',marginTop:4,paddingLeft:18,fontFamily:'inherit' }}>{time}</div>
  </div>
);

/* ─── Smooth scroll helper ─── */
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ─── Nav links — map label → section id ─── */
const NAV_LINKS = [
  { label: 'Features',      id: 'features'      },
  { label: 'Preview',       id: 'preview'       },
  { label: 'How It Works',  id: 'how-it-works'  },
  { label: 'Reviews',       id: 'reviews'       },
];

/* ─── Main Hero ─── */
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .planix-hero * { box-sizing:border-box; margin:0; padding:0; }
        .planix-hero {
          font-family:'DM Sans',sans-serif;
          background:#05040f;
          min-height:100vh;
          position:relative;
          overflow:hidden;
          display:flex;
          flex-direction:column;
        }
        .planix-hero::before {
          content:'';position:absolute;inset:0;
          background-image:
            linear-gradient(rgba(120,80,255,0.07) 1px,transparent 1px),
            linear-gradient(90deg,rgba(120,80,255,0.07) 1px,transparent 1px);
          background-size:60px 60px;
          pointer-events:none;z-index:1;
        }

        /* ── Nav ── */
        .hero-nav {
          position:relative;z-index:10;
          display:flex;align-items:center;justify-content:space-between;
          padding:20px 60px;
        }
        .hero-logo {
          font-family:'Syne',sans-serif;font-weight:800;font-size:22px;color:#fff;
          display:flex;align-items:center;gap:8px;letter-spacing:-0.5px;
          cursor:pointer;user-select:none;
        }
        .hero-logo-mark {
          width:30px;height:30px;
          background:linear-gradient(135deg,#7c3aed,#3b82f6);
          border-radius:8px;display:flex;align-items:center;justify-content:center;
        }
        .nav-pills {
          display:flex;gap:4px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:100px;padding:4px;
        }
        .nav-pill {
          padding:6px 16px;border-radius:100px;font-size:13px;
          color:rgba(255,255,255,0.6);cursor:pointer;transition:all 0.2s;
          font-family:'DM Sans',sans-serif;background:none;border:none;
        }
        .nav-pill:hover { color:#fff;background:rgba(255,255,255,0.08); }
        .nav-cta { display:flex;gap:10px;align-items:center; }
        .btn-ghost {
          padding:8px 20px;border-radius:100px;
          border:1px solid rgba(255,255,255,0.15);
          background:transparent;color:rgba(255,255,255,0.7);
          font-size:13px;cursor:pointer;transition:all 0.2s;
          font-family:'DM Sans',sans-serif;
        }
        .btn-ghost:hover { border-color:rgba(255,255,255,0.4);color:#fff; }
        .btn-primary-nav {
          padding:8px 22px;border-radius:100px;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none;color:#fff;font-size:13px;
          cursor:pointer;font-weight:500;
          font-family:'DM Sans',sans-serif;
          box-shadow:0 0 24px rgba(124,58,237,0.4);
          transition:all 0.2s;
        }
        .btn-primary-nav:hover { transform:translateY(-1px);box-shadow:0 0 32px rgba(124,58,237,0.6); }

        /* ── Body ── */
        .hero-body {
          position:relative;z-index:10;flex:1;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;padding:60px 40px 80px;
        }
        .hero-badge {
          display:inline-flex;align-items:center;gap:8px;
          background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.4);
          border-radius:100px;padding:6px 16px;
          font-size:12px;color:#a78bfa;font-weight:500;
          margin-bottom:32px;letter-spacing:0.5px;
          animation:fadeUp 0.6s ease both;font-family:'DM Sans',sans-serif;
        }
        .hero-badge-pulse { width:7px;height:7px;border-radius:50%;background:#7c3aed;animation:pulse 2s ease infinite; }
        .hero-h1 {
          font-family:'Syne',sans-serif;
          font-size:clamp(36px, 8vw, 84px); font-weight:800;
          line-height:1.0;letter-spacing:-3px;color:#fff;
          max-width:900px;margin-bottom:24px;
          animation:fadeUp 0.7s 0.1s ease both;
        }
        .hero-h1 .grad {
          background:linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .hero-sub {
          font-size:clamp(15px, 4vw, 18px); color:rgba(255,255,255,0.5);max-width:520px;
          line-height:1.7;margin-bottom:44px;
          animation:fadeUp 0.7s 0.2s ease both;font-weight:300;
        }
        .hero-actions {
          display:flex;gap:14px;align-items:center;margin-bottom:64px;
          animation:fadeUp 0.7s 0.3s ease both;
          flex-wrap:wrap;justify-content:center;
        }
        .btn-hero-primary {
          display:flex;align-items:center;justify-content:center;gap:8px;
          padding:14px 32px;border-radius:100px;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);
          border:none;color:#fff;font-size:15px;font-weight:500;
          cursor:pointer;box-shadow:0 0 40px rgba(124,58,237,0.5);
          transition:all 0.3s;font-family:'DM Sans',sans-serif;
        }
        .btn-hero-primary:hover { transform:translateY(-2px);box-shadow:0 0 60px rgba(124,58,237,0.7); }
        .btn-hero-secondary {
          display:flex;align-items:center;justify-content:center;gap:8px;
          padding:14px 32px;border-radius:100px;
          background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);
          color:rgba(255,255,255,0.8);font-size:15px;font-weight:400;
          cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;
        }
        .btn-hero-secondary:hover { background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.3); }
        .hero-social-proof { display:flex;align-items:center;gap:16px;animation:fadeUp 0.7s 0.4s ease both; }
        .avatars { display:flex; }
        .avatar {
          width:32px;height:32px;border-radius:50%;
          border:2px solid #05040f;margin-left:-8px;
          background:linear-gradient(135deg,#7c3aed,#3b82f6);
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:700;color:#fff;font-family:'DM Sans',sans-serif;
        }
        .avatars .avatar:first-child { margin-left:0; }
        .proof-text { font-size:13px;color:rgba(255,255,255,0.45); }
        .proof-text strong { color:#a78bfa; }
        .hero-visual { position:absolute;inset:0;pointer-events:none;z-index:5; transition: all 0.3s ease; }
        .hero-bottom-fade {
          position:absolute;bottom:0;left:0;right:0;height:200px;
          background:linear-gradient(to top,#05040f,transparent);
          z-index:6;pointer-events:none;
        }

        /* ── Animations ── */
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatCard { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(1deg)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

        /* ── Responsive Mobile Enhancements ── */
        @media(max-width:900px){
          .hero-nav{padding:16px 24px;}
          .nav-pills{display:none;}
        }
        
        @media(max-width:600px){
          .hero-nav { padding: 16px; }
          .hero-logo { font-size: 18px; }
          .hero-logo-mark { width: 26px; height: 26px; }
          .logo-star svg { width: 14px; height: 14px; }
          .btn-ghost { padding: 8px 12px; font-size: 12px; }
          .btn-primary-nav { padding: 8px 16px; font-size: 12px; }

          .hero-body { padding: 40px 16px 60px; }
          .hero-badge { font-size: 11px; padding: 4px 12px; margin-bottom: 24px; }
          .hero-h1 { margin-bottom: 16px; letter-spacing: -1.5px; line-height: 1.15; }
          .hero-sub { margin-bottom: 32px; }
          
          /* Stack buttons and make them full width for easy tapping */
          .hero-actions { 
            flex-direction: column; 
            width: 100%; 
            max-width: 320px;
            gap: 12px; 
            margin-bottom: 40px; 
          }
          .btn-hero-primary, .btn-hero-secondary { width: 100%; }
          
          /* Adjust social proof layout */
          .hero-social-proof { flex-direction: column; gap: 8px; }
          
          /* Fade and scale background cards so they don't block text */
          .hero-visual { 
            opacity: 0.15; 
            transform: scale(0.6); 
            transform-origin: top center; 
          }
        }
      `}</style>

      <section className="planix-hero">
        <OrbCanvas />

        <div className="hero-visual">
          <CalCard delay={0}   top="22%" left="6%"  title="Team Standup"    time="Today · 9:00 AM"     color="#7c3aed" />
          <CalCard delay={1.5} top="38%" right="5%" title="Product Review"  time="Today · 2:30 PM"     color="#3b82f6" />
          <CalCard delay={0.8} top="62%" left="4%"  title="⏰ Reminder set" time="5 min before event"  color="#10b981" />
          <CalCard delay={2}   top="18%" right="7%" title="Client Call"     time="Tomorrow · 11:00 AM" color="#f59e0b" />
        </div>

        <div className="hero-bottom-fade" />

        {/* ── NAV ── */}
        <nav className="hero-nav">
          <div className="hero-logo" onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>
            <div className="hero-logo-mark">
              <div className="logo-star">
                <CalendarDays size={16} color="white" />
              </div>
            </div>
            Planix
          </div>

          {/* Scroll-to-section links */}
          <div className="nav-pills">
            {NAV_LINKS.map(({ label, id }) => (
              <button key={id} className="nav-pill" onClick={() => scrollTo(id)}>
                {label}
              </button>
            ))}
          </div>

          {/* Auth */}
          <div className="nav-cta">
            <button className="btn-ghost" onClick={() => navigate('/login')}>Log in</button>
            <button className="btn-primary-nav" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </nav>

        {/* ── BODY ── */}
        <div className="hero-body">
          <div className="hero-badge">
            <div className="hero-badge-pulse" />
            Now with Smart Reminder Engine · v2.0
          </div>

          <h1 className="hero-h1">
            Your Calendar,<br />
            <span className="grad">Supercharged</span>
          </h1>

          <p className="hero-sub">
            Connect Google Calendar. Get intelligent reminders,
            manage every event, and never miss a moment — all in one
            beautifully designed workspace.
          </p>

          <div className="hero-actions">
            {/* Primary CTA → register */}
            <Button className="btn-hero-primary" onClick={() => navigate('/register')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" fillOpacity="0.9"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" fillOpacity="0.7"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" fillOpacity="0.5"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" fillOpacity="0.6"/>
              </svg>
              Continue with Google
            </Button>

            {/* Secondary CTA → scrolls to #preview */}
            <Button className="btn-hero-secondary" onClick={() => scrollTo('preview')}>
              <PlayCircle size={18} color="rgba(255,255,255,0.6)" />
              See it in action
            </Button>
          </div>

          <div className="hero-social-proof">
            <div className="avatars">
              {['JD','KL','MR','AR','+9'].map(a => (
                <div key={a} className="avatar" style={a==='+9'?{background:'rgba(124,58,237,0.5)'}:{}}>{a}</div>
              ))}
            </div>
            <p className="proof-text">Trusted by <strong>12,000+</strong> professionals</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;