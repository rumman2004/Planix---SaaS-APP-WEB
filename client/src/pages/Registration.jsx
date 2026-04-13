import React, { useState } from 'react';
import { CalendarDays, CalendarSync, BellRing, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../components/ui';

export default function Registration({ onGoogleSignUp }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const handleGoogleSignUp = () => {
    onGoogleSignUp?.();
    window.location.href = '/auth/google';
  };

  const features = [
    {
      icon: <CalendarSync size={18} color="white" />,
      title: 'Two-way Google Sync',
      desc: 'All your existing events appear instantly.',
      color: 'rgba(139,92,246,0.9)',
      glow: 'rgba(139,92,246,0.5)',
    },
    {
      icon: <BellRing size={18} color="white" />,
      title: 'Smart Reminders',
      desc: 'Custom triggers, not generic alerts.',
      color: 'rgba(103,232,249,0.9)',
      glow: 'rgba(103,232,249,0.5)',
    },
    {
      icon: <ShieldCheck size={18} color="white" />,
      title: 'Zero-password Security',
      desc: 'OAuth 2.0 — no new password to remember.',
      color: 'rgba(74,222,128,0.9)',
      glow: 'rgba(74,222,128,0.5)',
    },
    {
      icon: <Zap size={18} color="white" />,
      title: 'Instant Setup',
      desc: 'One click and you are ready to go.',
      color: 'rgba(251,191,36,0.9)',
      glow: 'rgba(251,191,36,0.5)',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}

        .reg-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .reg-root::before {
          content:'';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 65% 55% at 10% 15%, rgba(99,59,222,0.45) 0%, transparent 60%),
            radial-gradient(ellipse 50% 45% at 90% 10%, rgba(236,72,153,0.28) 0%, transparent 55%),
            radial-gradient(ellipse 55% 50% at 55% 90%, rgba(8,145,178,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 0% 80%,  rgba(20,184,166,0.15) 0%, transparent 50%);
          animation: meshDrift 16s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes meshDrift {
          0%   { opacity:.85; transform:scale(1) rotate(0deg); }
          100% { opacity:1;   transform:scale(1.07) rotate(1deg); }
        }

        .reg-card {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 380px;
          width: 100%;
          max-width: 860px;
          min-height: 540px;
          background: rgba(255,255,255,0.055);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 0.5px solid rgba(255,255,255,0.13);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1);
          animation: cardIn .5s cubic-bezier(.34,1.56,.64,1) both;
        }

        @keyframes cardIn {
          from { opacity:0; transform:translateY(28px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        /* ── LEFT: features ── */
        .reg-left {
          padding: 40px 38px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 0.5px solid rgba(255,255,255,0.08);
        }

        .reg-left-top {}

        .reg-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }

        .reg-logo-mark {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(139,92,246,0.7), rgba(217,70,239,0.6));
          border: 0.5px solid rgba(200,160,255,0.35);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(139,92,246,0.3);
        }

        .reg-logo-name {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: rgba(255,255,255,0.95);
        }

        .reg-left-heading {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          font-weight: 400;
          color: rgba(255,255,255,0.95);
          line-height: 1.22;
          letter-spacing: -.5px;
          margin-bottom: 8px;
        }

        .reg-left-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          font-weight: 300;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 0.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(10px);
          cursor: default;
          transition: all .2s ease;
        }

        .feature-item:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.13);
          transform: translateX(4px);
        }

        .feature-icon-wrap {
          width: 36px; height: 36px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: box-shadow .2s;
        }

        .feature-text {}

        .feature-title {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          margin-bottom: 2px;
        }

        .feature-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          line-height: 1.5;
        }

        .reg-left-footer {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          line-height: 1.5;
        }

        /* ── RIGHT: sign-up form ── */
        .reg-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
        }

        .reg-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 100% 0%, rgba(139,92,246,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .reg-step-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(139,92,246,0.15);
          border: 0.5px solid rgba(167,139,250,0.25);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          color: rgba(167,139,250,0.85);
          font-weight: 500;
          letter-spacing: .3px;
          margin-bottom: 18px;
          width: fit-content;
          position: relative;
          z-index: 1;
        }

        .step-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(167,139,250,0.9);
          box-shadow: 0 0 6px rgba(167,139,250,0.8);
        }

        .reg-title {
          font-family: 'DM Serif Display', serif;
          font-size: 30px;
          font-weight: 400;
          color: rgba(255,255,255,0.95);
          letter-spacing: -.5px;
          line-height: 1.15;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }

        .reg-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          font-weight: 300;
          line-height: 1.65;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        /* Google button */
        .google-signup-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 15px 24px;
          border-radius: 14px;
          background: rgba(255,255,255,0.085);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 0.5px solid rgba(255,255,255,0.16);
          color: rgba(255,255,255,0.9);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all .25s cubic-bezier(.34,1.56,.64,1);
          letter-spacing: .1px;
          position: relative;
          overflow: hidden;
          margin-bottom: 18px;
          z-index: 1;
        }

        .google-signup-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%);
          opacity: 0;
          transition: opacity .2s;
        }

        .google-signup-btn:hover {
          background: rgba(255,255,255,0.13);
          border-color: rgba(255,255,255,0.26);
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.35);
        }

        .google-signup-btn:hover::before { opacity: 1; }
        .google-signup-btn:active { transform: scale(.98); }

        .google-icon { width:20px; height:20px; flex-shrink:0; position:relative; z-index:1; }
        .google-btn-label { position:relative; z-index:1; }

        /* What happens next */
        .next-steps {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }

        .next-steps-title {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.25);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .next-step-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          padding: 3px 0;
        }

        .step-num {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: rgba(139,92,246,0.2);
          border: 0.5px solid rgba(139,92,246,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 9px;
          font-weight: 600;
          color: rgba(167,139,250,0.9);
          flex-shrink: 0;
        }

        /* Divider */
        .reg-divider {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
          position: relative; z-index: 1;
        }

        .reg-divider-line {
          flex: 1; height: .5px;
          background: rgba(255,255,255,0.08);
        }

        .reg-divider-text {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          white-space: nowrap;
          letter-spacing: .5px;
        }

        .reg-note {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          text-align: center;
          line-height: 1.65;
          position: relative; z-index: 1;
        }

        .reg-note a {
          color: rgba(167,139,250,0.75);
          text-decoration: none;
          font-weight: 500;
          transition: color .15s;
        }

        .reg-note a:hover { color: rgba(167,139,250,1); }

        .login-link {
          text-align: center;
          margin-top: 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          position: relative; z-index: 1;
        }

        .login-link a {
          color: rgba(167,139,250,0.85);
          text-decoration: none;
          font-weight: 500;
        }

        .login-link a:hover { color: rgba(167,139,250,1); }

        @media (max-width:680px) {
          .reg-card { grid-template-columns:1fr; max-width:420px; }
          .reg-left { display:none; }
          .reg-right { padding:36px 28px; }
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-card">

          {/* LEFT */}
          <div className="reg-left">
            <div className="reg-left-top">
              <div className="reg-logo">
                <div className="reg-logo-mark">
                  <CalendarDays size={20} color="white" />
                </div>
                <span className="reg-logo-name">Planix</span>
              </div>

              <h2 className="reg-left-heading">
                Everything you need to own your time
              </h2>
              <p className="reg-left-sub">
                Join thousands of people who use Planix to stay on top of every event, reminder, and deadline.
              </p>

              <div className="feature-list">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="feature-item"
                    onMouseEnter={() => setHoveredFeature(i)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div
                      className="feature-icon-wrap"
                      style={{
                        background: `${f.color.replace('0.9','0.15')}`,
                        border: `0.5px solid ${f.color.replace('0.9','0.3')}`,
                        boxShadow: hoveredFeature === i ? `0 0 16px ${f.glow}` : 'none',
                      }}
                    >
                      {f.icon}
                    </div>
                    <div className="feature-text">
                      <div className="feature-title">{f.title}</div>
                      <div className="feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reg-left-footer">
              Planix is free to use. No credit card required.
            </div>
          </div>

          {/* RIGHT */}
          <div className="reg-right">
            <div className="reg-step-pill">
              <div className="step-dot" />
              Create your account
            </div>

            <h1 className="reg-title">Get started<br />with Planix</h1>
            <p className="reg-subtitle">
              One click is all it takes — we use your Google account to sign you in safely.
            </p>

            <Button className="google-signup-btn" onClick={handleGoogleSignUp}>
              <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="google-btn-label">Sign up with Google</span>
            </Button>

            <div className="next-steps">
              <div className="next-steps-title">What happens next</div>
              <div className="next-step-row">
                <div className="step-num">1</div>
                Google verifies your identity securely
              </div>
              <div className="next-step-row">
                <div className="step-num">2</div>
                We import your existing calendar events
              </div>
              <div className="next-step-row">
                <div className="step-num">3</div>
                Your dashboard is ready in seconds
              </div>
            </div>

            <div className="reg-divider">
              <div className="reg-divider-line" />
              <span className="reg-divider-text">secured by OAuth 2.0 · no password stored</span>
              <div className="reg-divider-line" />
            </div>

            <p className="reg-note">
              By creating an account you agree to our{' '}
              <a href="/terms">Terms of Service</a> and{' '}
              <a href="/privacy">Privacy Policy</a>
            </p>

            <p className="login-link">
              Already have an account? <a href="/login">Sign in</a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}