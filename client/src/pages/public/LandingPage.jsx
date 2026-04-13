import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Sections
import HeroSection from '../../components/sections/HeroSection';
import PreviewSection from '../../components/sections/PreviewSection';
import FeatureSection from '../../components/sections/FeatureSection';
import Workings from '../../components/sections/Workings';
import Testimonials from '../../components/sections/Testimonials';

const LandingPage = () => {
  return (
    <div
      style={{
        background: '#05040f',
        minHeight: '100vh',
        overflowX: 'hidden',
        color: '#fff',
      }}
    >
      <style>{`
        /* Desktop Footer Padding */
        .landing-footer {
          padding: 40px 60px;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .landing-footer {
            padding: 40px 20px !important;
            flex-direction: column !important;
            text-align: center !important;
            gap: 32px !important;
          }

          .footer-links {
            justify-content: center !important;
            gap: 20px !important;
          }

          .footer-logo {
            justify-content: center !important;
          }
        }
      `}</style>

      {/* All sections own their own nav, bg, and layout */}
      <main>
        <HeroSection />
        <PreviewSection />
        <FeatureSection />
        <Workings />
        <Testimonials />
      </main>

      {/* Footer */}
      <footer className="landing-footer"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          background: '#05040f',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div className="footer-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 20,
            color: '#fff',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)'
            }}
          >
            <CalendarDays size={18} color="white" />
          </div>
          Planix
        </div>

        {/* Links */}
        <div className="footer-links" style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {[
            { name: 'Privacy', path: '/privacy' },
            { name: 'Terms', path: '/terms' }
          ].map(link => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.target.style.color = '#7c3aed')}
              onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.4)')}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.2)',
            fontFamily: 'DM Sans, sans-serif',
            margin: 0,
            width: '100%',
            textAlign: 'center',
            marginTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.03)',
            paddingTop: '20px'
          }}
        >
          © {new Date().getFullYear()} Planix. Built for productivity.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;