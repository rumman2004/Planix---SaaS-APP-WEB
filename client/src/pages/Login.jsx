import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import {  Button } from '../components/ui';

export default function Login({ onGoogleSignIn }) {
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [pressedBtn, setPressedBtn] = useState(false);

  const handleGoogleSignIn = () => {
    onGoogleSignIn?.();
    // Redirect to backend OAuth route
    const backendUrl = import.meta.env.VITE_BACKEND_API_URI || 'http://localhost:5000/api';
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .planix-login-root {
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

        .planix-login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 15% 10%, rgba(120,80,255,0.4) 0%, transparent 60%),
            radial-gradient(ellipse 55% 50% at 85% 15%, rgba(255,100,180,0.25) 0%, transparent 55%),
            radial-gradient(ellipse 60% 55% at 50% 85%, rgba(60,160,255,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 5% 75%,  rgba(80,220,180,0.12) 0%, transparent 50%);
          animation: meshShift 14s ease-in-out infinite alternate;
          pointer-events: none;
        }

        @keyframes meshShift {
          0%   { opacity: 0.8; transform: scale(1); }
          100% { opacity: 1;   transform: scale(1.06); }
        }

        .login-card {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 340px 1fr;
          width: 100%;
          max-width: 820px;
          min-height: 520px;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 0.5px solid rgba(255,255,255,0.14);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12);
          animation: cardIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── LEFT PANEL ── */
        .login-left {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px;
          background:
            radial-gradient(ellipse 100% 80% at 30% 20%, rgba(139,92,246,0.9) 0%, rgba(99,59,222,0.7) 35%, transparent 70%),
            radial-gradient(ellipse 80% 70% at 80% 80%, rgba(236,72,153,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 10% 80%, rgba(59,130,246,0.5) 0%, transparent 55%),
            linear-gradient(160deg, #1a0a3e 0%, #0d0b2a 100%);
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 50% at 60% 40%, rgba(255,255,255,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Floating orbs */
        .left-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }
        .left-orb-1 {
          width: 180px; height: 180px;
          top: -40px; left: -40px;
          background: rgba(139,92,246,0.4);
          animation: orbFloat1 8s ease-in-out infinite;
        }
        .left-orb-2 {
          width: 120px; height: 120px;
          bottom: 60px; right: -20px;
          background: rgba(236,72,153,0.35);
          animation: orbFloat2 10s ease-in-out infinite;
        }
        .left-orb-3 {
          width: 100px; height: 100px;
          bottom: -20px; left: 40px;
          background: rgba(59,130,246,0.3);
          animation: orbFloat1 12s ease-in-out infinite reverse;
        }

        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(12px, -16px); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(-10px, 14px); }
        }

        .left-logo {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-star {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          border: 0.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          color: white;
          backdrop-filter: blur(10px);
        }

        .logo-name {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: rgba(255,255,255,0.95);
          letter-spacing: -0.3px;
        }

        .left-bottom {
          position: relative;
          z-index: 1;
        }

        .left-tagline {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          font-weight: 400;
          margin-bottom: 10px;
          letter-spacing: 0.2px;
        }

        .left-headline {
          font-family: 'DM Serif Display', serif;
          font-size: 26px;
          font-weight: 400;
          color: rgba(255,255,255,0.95);
          line-height: 1.25;
          letter-spacing: -0.5px;
          margin-bottom: 20px;
        }

        /* Feature pills */
        .feature-pills {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 0.5px solid rgba(255,255,255,0.13);
          border-radius: 100px;
          padding: 6px 12px;
          width: fit-content;
          backdrop-filter: blur(10px);
        }

        .feature-pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(167,139,250,0.9);
          box-shadow: 0 0 8px rgba(167,139,250,0.8);
          flex-shrink: 0;
        }

        .feature-pill span {
          font-size: 12px;
          color: rgba(255,255,255,0.65);
          font-weight: 400;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 44px;
          position: relative;
        }

        .right-logo-mark {
          color: rgba(255,255,255,0.95);
          margin-bottom: 18px;
          opacity: 0.7;
        }

        .right-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          font-weight: 400;
          color: rgba(255,255,255,0.95);
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          line-height: 1.15;
        }

        .right-subtitle {
          font-size: 13px;
          line-height: 1.65;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
          margin-bottom: 36px;
          max-width: 280px;
        }

        /* Google button */
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 14px 24px;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 0.5px solid rgba(255,255,255,0.16);
          color: rgba(255,255,255,0.88);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          letter-spacing: 0.1px;
          position: relative;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .google-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.2s;
          border-radius: inherit;
        }

        .google-btn:hover {
          background: rgba(255,255,255,0.13);
          border-color: rgba(255,255,255,0.28);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .google-btn:hover::before { opacity: 1; }
        .google-btn:active { transform: scale(0.98); }

        .google-icon {
          width: 20px; height: 20px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .google-btn-text {
          position: relative;
          z-index: 1;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .divider-line {
          flex: 1;
          height: 0.5px;
          background: rgba(255,255,255,0.1);
        }

        .divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.22);
          white-space: nowrap;
          letter-spacing: 0.5px;
        }

        /* Bottom note */
        .login-note {
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          text-align: center;
          line-height: 1.6;
        }

        .login-note a {
          color: rgba(167,139,250,0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }

        .login-note a:hover { color: rgba(167,139,250,1); }

        /* Security badge */
        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          padding: 6px 14px;
          margin-bottom: 20px;
          width: fit-content;
          align-self: center;
        }

        .security-badge span {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.2px;
        }

        .security-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(74,222,128,0.7);
          box-shadow: 0 0 6px rgba(74,222,128,0.6);
          animation: secPulse 2.5s infinite;
          flex-shrink: 0;
        }

        @keyframes secPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .login-card {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
          .login-left { min-height: 200px; padding: 24px; }
          .left-headline { font-size: 22px; }
          .login-right { padding: 32px 28px; }
        }
      `}</style>

      <div className="planix-login-root">
        <div className="login-card">

          {/* ── LEFT ── */}
          <div className="login-left">
            <div className="left-orb left-orb-1" />
            <div className="left-orb left-orb-2" />
            <div className="left-orb left-orb-3" />

            <div className="left-logo">
              <div className="logo-star">
                <CalendarDays size={20} />
              </div>
              <span className="logo-name">Planix</span>
            </div>

            <div className="left-bottom">
              <p className="left-tagline">You can easily</p>
              <h2 className="left-headline">
                Get access your personal hub for clarity and productivity
              </h2>
              <div className="feature-pills">
                <div className="feature-pill">
                  <div className="feature-pill-dot" />
                  <span>Google Calendar sync</span>
                </div>
                <div className="feature-pill">
                  <div className="feature-pill-dot" style={{ background: 'rgba(103,232,249,0.9)', boxShadow: '0 0 8px rgba(103,232,249,0.8)' }} />
                  <span>Smart reminders</span>
                </div>
                <div className="feature-pill">
                  <div className="feature-pill-dot" style={{ background: 'rgba(248,180,217,0.9)', boxShadow: '0 0 8px rgba(248,180,217,0.7)' }} />
                  <span>Secure & private</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="login-right">
            <div className="right-logo-mark">
              <CalendarDays size={26} />
            </div>

            <h1 className="right-title">Welcome back</h1>
            <p className="right-subtitle">
              Access your calendar, events, and smart reminders — all in one beautiful place.
            </p>

            {/* Google Sign In */}
            <Button
              className="google-btn"
              onClick={handleGoogleSignIn}
              onMouseEnter={() => setHoveredBtn(true)}
              onMouseLeave={() => setHoveredBtn(false)}
              onMouseDown={() => setPressedBtn(true)}
              onMouseUp={() => setPressedBtn(false)}
            >
              <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="google-btn-text">Continue with Google</span>
            </Button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">secured by OAuth 2.0</span>
              <div className="divider-line" />
            </div>

            <div className="security-badge">
              <div className="security-dot" />
              <span>End-to-end encrypted · No password needed</span>
            </div>

            <p className="login-note">
              By continuing, you agree to our{' '}
              <a href="terms">Terms of Service</a> and{' '}
              <a href="privacy">Privacy Policy</a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}