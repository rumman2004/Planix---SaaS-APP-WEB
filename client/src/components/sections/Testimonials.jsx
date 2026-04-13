import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Anika Sharma',
    role: 'Product Manager · Stripe',
    initials: 'AS',
    color: '#7c3aed',
    text: 'Planix replaced 3 tools I was using. The smart reminders actually work — I stopped missing meetings the day I switched.',
    stars: 5,
  },
  {
    name: 'Marcus Rowe',
    role: 'Senior Engineer · Linear',
    initials: 'MR',
    color: '#3b82f6',
    text: 'The two-way Google sync is seamless. I barely notice it\'s there — which is exactly what I want from a calendar tool.',
    stars: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Founder · Nomad Studios',
    initials: 'PN',
    color: '#10b981',
    text: 'The glassmorphic UI is stunning on mobile. Planix is the first calendar app I\'ve actually enjoyed opening.',
    stars: 5,
  },
  {
    name: 'James Okonkwo',
    role: 'Design Lead · Figma',
    initials: 'JO',
    color: '#f59e0b',
    text: 'As someone obsessed with design, Planix earns it. The attention to detail in the UI is rare for a productivity tool.',
    stars: 5,
  },
  {
    name: 'Sofia Lindqvist',
    role: 'CTO · Helios Health',
    initials: 'SL',
    color: '#ec4899',
    text: 'Security-conscious teams can trust Planix. HTTP-only JWT cookies, no plain passwords — it\'s done right.',
    stars: 5,
  },
  {
    name: 'Ryan Chen',
    role: 'Freelance Consultant',
    initials: 'RC',
    color: '#14b8a6',
    text: 'I manage 4 client calendars. Planix keeps everything synced without me lifting a finger. Absolute time saver.',
    stars: 5,
  },
];

const Stars = ({ n }) => (
  <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
    ))}
  </div>
);

const Card = ({ t, i, active }) => {
  const isActive = active === i;
  const offset = i - active;
  
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      // Use dynamic calc() and clamp() so the carousel scales down on mobile without overflowing
      transform: `translate(-50%, -50%) translateX(calc(${offset} * clamp(260px, 80vw, 340px))) scale(${isActive ? 1 : 0.85})`,
      opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.4,
      transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      zIndex: isActive ? 10 : 5 - Math.abs(offset),
      pointerEvents: isActive ? 'auto' : 'none',
      width: '100%',
      maxWidth: '360px', // Prevent it from getting too wide on desktop
    }}>
      <div 
        className="testi-card-inner" 
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderTop: `2px solid ${t.color}`,
          borderRadius: 20,
          backdropFilter: 'blur(20px)',
        }}
      >
        <Stars n={t.stars} />
        <p style={{ 
          fontSize: 'clamp(14px, 4vw, 15px)', // Scales text slightly on tiny screens
          color: 'rgba(255,255,255,0.7)', 
          lineHeight: 1.7, 
          marginBottom: 20, 
          fontWeight: 300, 
          fontFamily: 'inherit' 
        }}>
          "{t.text}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'inherit',
          }}>
            {t.initials}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: 'inherit' }}>{t.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'inherit' }}>{t.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        
        .testi-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .testi-wrap {
          font-family: 'DM Sans', sans-serif;
          background: #05040f;
          padding: 100px 60px;
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        
        .testi-wrap::before {
          content: ''; position: absolute; inset: 0;
          background-image: linear-gradient(rgba(120,80,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,80,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px; pointer-events: none;
        }

        .testi-inner { max-width: 1100px; margin: 0 auto; }

        .testi-header { text-align: center; margin-bottom: 72px; }
        
        .testi-eyebrow {
          display: inline-flex; alignItems: center; gap: 6px;
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25);
          border-radius: 100px; padding: 4px 14px;
          font-size: 12px; color: #fbbf24; font-weight: 500; margin-bottom: 20px;
        }
        
        .testi-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 52px); font-weight: 800;
          color: #fff; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 14px;
        }
        
        .testi-title span {
          background: linear-gradient(135deg, #fbbf24, #f87171);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        
        .testi-sub { 
          font-size: clamp(15px, 2vw, 17px); 
          color: rgba(255,255,255,0.4); line-height: 1.7; font-weight: 300; 
        }

        .carousel { 
          position: relative; 
          height: 280px; 
          margin-bottom: 40px; 
          width: 100%;
        }

        .testi-card-inner { padding: 28px; }

        .dots-row { display: flex; gap: 8px; justify-content: center; margin-bottom: 40px; }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; transition: all 0.3s; }
        .dot.active { width: 20px; border-radius: 100px; background: #7c3aed; }

        .stat-row {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
          border-top: 1px solid rgba(255,255,255,0.06); padding-top: 40px;
        }
        
        .stat-card {
          text-align: center; padding: 24px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
        }
        
        .stat-num { 
          font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 40px); 
          font-weight: 800; color: #fff; letter-spacing: -1px; 
        }
        
        .stat-num span { 
          background: linear-gradient(135deg, #a78bfa, #60a5fa); 
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; 
        }
        
        .stat-label { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }

        /* Desktop down to tablet */
        @media(max-width: 900px){
          .testi-wrap { padding: 80px 32px; }
          .stat-row { gap: 12px; }
          .testi-card-inner { padding: 24px; }
        }

        /* Mobile specific styling */
        @media(max-width: 600px){
          .testi-wrap { padding: 60px 16px; }
          .testi-header { margin-bottom: 40px; }
          .stat-row { grid-template-columns: 1fr; gap: 12px; padding-top: 32px; }
          .carousel { height: 320px; } /* Give text more vertical room to wrap */
          .testi-card-inner { padding: 20px; } /* Slightly tighter padding inside cards */
          .stat-card { padding: 16px; }
        }
      `}</style>

      <section id="reviews" className="testi-wrap">
        <div className="testi-inner">
          <div className="testi-header">
            <div className="testi-eyebrow">
              <Star size={14} fill="#fbbf24" strokeWidth={2} /> Testimonials
            </div>
            <h2 className="testi-title">Loved by teams<br /><span>worldwide</span></h2>
            <p className="testi-sub">Real feedback from people who switched to Planix.</p>
          </div>

          <div className="carousel">
            {testimonials.map((t, i) => (
              <Card key={i} t={t} i={i} active={active} />
            ))}
          </div>

          <div className="dots-row">
            {testimonials.map((_, i) => (
              <div key={i} className={`dot${active === i ? ' active' : ''}`} onClick={() => setActive(i)} />
            ))}
          </div>

          <div className="stat-row">
            {[
              { num: '12K+', label: 'Active users worldwide' },
              { num: '99.9%', label: 'Uptime over last 12 months' },
              { num: '4.9★', label: 'Average rating across reviews' },
            ].map(s => (
              <div key={s.num} className="stat-card">
                <div className="stat-num"><span>{s.num}</span></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;