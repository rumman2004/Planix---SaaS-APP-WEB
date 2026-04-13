import React, { useState, useEffect, useRef } from 'react';

const LAST_UPDATED = 'June 15, 2025';
const EFFECTIVE_DATE = 'June 15, 2025';
const COMPANY = 'Planix';
const CONTACT_EMAIL = 'privacy@planix.app';
const WEBSITE = 'https://planix.app';

const sections = [
  { id: 'overview',      label: 'Overview' },
  { id: 'collection',    label: 'Data We Collect' },
  { id: 'use',           label: 'How We Use Data' },
  { id: 'google',        label: 'Google Integration' },
  { id: 'sharing',       label: 'Data Sharing' },
  { id: 'storage',       label: 'Storage & Security' },
  { id: 'rights',        label: 'Your Rights' },
  { id: 'cookies',       label: 'Cookies' },
  { id: 'children',      label: 'Children\'s Privacy' },
  { id: 'changes',       label: 'Policy Changes' },
  { id: 'contact',       label: 'Contact Us' },
];

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: '48px', scrollMarginTop: '100px' }}>
      <h2 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: '22px', fontWeight: 400,
        color: 'rgba(255,255,255,0.92)',
        marginBottom: '16px',
        letterSpacing: '-.3px',
        paddingBottom: '12px',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      }}>{title}</h2>
      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.85, fontWeight: 300 }}>
        {children}
      </div>
    </section>
  );
}

function P({ children, style = {} }) {
  return <p style={{ marginBottom: '14px', ...style }}>{children}</p>;
}

function UL({ items }) {
  return (
    <ul style={{ paddingLeft: '0', listStyle: 'none', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ color: 'rgba(167,139,250,0.7)', marginTop: '2px', flexShrink: 0, fontSize: '12px' }}>✦</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ color = 'purple', children }) {
  const colors = {
    purple: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', text: 'rgba(196,181,253,0.9)' },
    cyan:   { bg: 'rgba(8,145,178,0.1)',  border: 'rgba(8,145,178,0.25)',  text: 'rgba(103,232,249,0.9)' },
    green:  { bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.25)',  text: 'rgba(74,222,128,0.9)'  },
    amber:  { bg: 'rgba(217,119,6,0.1)',  border: 'rgba(217,119,6,0.25)',  text: 'rgba(251,191,36,0.9)'  },
  };
  const c = colors[color];
  return (
    <div style={{
      background: c.bg, border: `0.5px solid ${c.border}`,
      borderRadius: '12px', padding: '14px 18px',
      marginBottom: '16px', color: c.text,
      fontSize: '13px', lineHeight: 1.7,
    }}>
      {children}
    </div>
  );
}

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('overview');
  const [scrolled, setScrolled] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sectionEls = sections.map(s => document.getElementById(s.id)).filter(Boolean);
      let current = sections[0].id;
      for (const el of sectionEls) {
        if (window.scrollY >= el.offsetTop - 130) current = el.id;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{
          background:#0a0a0f;
          font-family:'DM Sans',sans-serif;
          color:rgba(255,255,255,0.85);
        }
        body::before{
          content:'';
          position:fixed; inset:0; z-index:0;
          background:
            radial-gradient(ellipse 60% 50% at 5% 5%,   rgba(99,59,222,.3)  0%,transparent 60%),
            radial-gradient(ellipse 50% 40% at 95% 95%,  rgba(8,145,178,.18) 0%,transparent 55%),
            radial-gradient(ellipse 40% 35% at 50% 50%,  rgba(139,92,246,.08)0%,transparent 60%);
          pointer-events:none;
          animation:bgDrift 18s ease-in-out infinite alternate;
        }
        @keyframes bgDrift{
          0%  {opacity:.8;transform:scale(1);}
          100%{opacity:1;transform:scale(1.05);}
        }

        .pp-nav{
          position:fixed; top:0; left:0; right:0; z-index:100;
          padding:0 40px;
          height:60px;
          display:flex; align-items:center; justify-content:space-between;
          transition:all .25s;
        }
        .pp-nav.scrolled{
          background:rgba(10,10,20,.8);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-bottom:0.5px solid rgba(255,255,255,.08);
        }
        .pp-nav-logo{
          display:flex; align-items:center; gap:8px;
          text-decoration:none;
        }
        .pp-nav-mark{
          width:30px; height:30px; border-radius:8px;
          background:linear-gradient(135deg,rgba(139,92,246,.7),rgba(217,70,239,.6));
          border:0.5px solid rgba(200,160,255,.3);
          display:flex; align-items:center; justify-content:center;
          font-size:14px;
        }
        .pp-nav-name{
          font-family:'DM Serif Display',serif;
          font-size:18px; color:rgba(255,255,255,.9);
        }
        .pp-nav-back{
          font-size:12px; color:rgba(255,255,255,.4);
          text-decoration:none;
          padding:6px 14px;
          border:0.5px solid rgba(255,255,255,.1);
          border-radius:100px;
          transition:all .2s;
          font-weight:400;
        }
        .pp-nav-back:hover{
          color:rgba(255,255,255,.8);
          border-color:rgba(255,255,255,.25);
          background:rgba(255,255,255,.06);
        }

        .pp-layout{
          position:relative; z-index:1;
          max-width:1100px; margin:0 auto;
          display:grid;
          grid-template-columns:220px 1fr;
          gap:0;
          padding-top:60px;
        }

        .pp-sidebar{
          position:sticky; top:60px;
          height:calc(100vh - 60px);
          overflow-y:auto;
          padding:36px 20px 40px 32px;
          border-right:0.5px solid rgba(255,255,255,.06);
        }

        .pp-sidebar::-webkit-scrollbar{width:0;}

        .pp-sidebar-label{
          font-size:10px; font-weight:500;
          letter-spacing:1.5px; text-transform:uppercase;
          color:rgba(255,255,255,.2);
          margin-bottom:14px;
          padding-left:4px;
        }

        .pp-sidebar-link{
          display:block;
          padding:7px 10px;
          border-radius:8px;
          font-size:12px; font-weight:400;
          color:rgba(255,255,255,.38);
          cursor:pointer;
          transition:all .15s;
          margin-bottom:2px;
          border:none; background:transparent;
          text-align:left; width:100%;
          font-family:'DM Sans',sans-serif;
        }

        .pp-sidebar-link:hover{
          color:rgba(255,255,255,.7);
          background:rgba(255,255,255,.06);
        }

        .pp-sidebar-link.active{
          color:rgba(167,139,250,.95);
          background:rgba(139,92,246,.12);
          font-weight:500;
        }

        .pp-content{
          padding:48px 60px 80px 56px;
          max-width:780px;
        }

        .pp-hero{
          margin-bottom:52px;
          padding-bottom:36px;
          border-bottom:0.5px solid rgba(255,255,255,.07);
        }

        .pp-badge{
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(139,92,246,.12);
          border:0.5px solid rgba(167,139,250,.22);
          border-radius:100px;
          padding:4px 12px; margin-bottom:16px;
          font-size:11px; font-weight:500;
          color:rgba(167,139,250,.85);
          letter-spacing:.3px;
        }

        .pp-hero-title{
          font-family:'DM Serif Display',serif;
          font-size:40px; font-weight:400;
          color:rgba(255,255,255,.95);
          letter-spacing:-1px; line-height:1.1;
          margin-bottom:14px;
        }

        .pp-hero-desc{
          font-size:14px; color:rgba(255,255,255,.42);
          font-weight:300; line-height:1.7;
          max-width:560px; margin-bottom:20px;
        }

        .pp-meta{
          display:flex; gap:24px; flex-wrap:wrap;
        }

        .pp-meta-item{
          font-size:12px; color:rgba(255,255,255,.28);
        }

        .pp-meta-item strong{
          color:rgba(255,255,255,.55); font-weight:500;
        }

        @media(max-width:768px){
          .pp-layout{grid-template-columns:1fr;}
          .pp-sidebar{display:none;}
          .pp-content{padding:32px 24px 60px;}
          .pp-hero-title{font-size:30px;}
        }
      `}</style>

      {/* Nav */}
      <nav className={`pp-nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/" className="pp-nav-logo">
          <div className="pp-nav-mark">✦</div>
          <span className="pp-nav-name">Planix</span>
        </a>
        <a href="/" className="pp-nav-back">← Back to app</a>
      </nav>

      <div className="pp-layout">

        {/* Sidebar */}
        <aside className="pp-sidebar">
          <div className="pp-sidebar-label">Contents</div>
          {sections.map(s => (
            <button
              key={s.id}
              className={`pp-sidebar-link${activeSection === s.id ? ' active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="pp-content" ref={contentRef}>

          {/* Hero */}
          <div className="pp-hero" id="overview">
            <div className="pp-badge">✦ Legal</div>
            <h1 className="pp-hero-title">Privacy Policy</h1>
            <p className="pp-hero-desc">
              We built Planix to help you manage your time, not to harvest your data. This policy explains exactly what we collect, why we collect it, and how you stay in control at all times.
            </p>
            <div className="pp-meta">
              <div className="pp-meta-item">Last updated: <strong>{LAST_UPDATED}</strong></div>
              <div className="pp-meta-item">Effective: <strong>{EFFECTIVE_DATE}</strong></div>
            </div>
          </div>

          <Section id="overview" title="1. Overview">
            <InfoBox color="green">
              <strong>Short version:</strong> Planix collects only the minimum data required to deliver its calendar management service. We do not sell your data, serve ads, or share your information with third parties for marketing purposes.
            </InfoBox>
            <P>
              {COMPANY} ("we," "our," or "us") operates the Planix calendar management platform accessible at {WEBSITE} and through our associated mobile applications. This Privacy Policy describes how we collect, use, disclose, and protect information about you when you use our services.
            </P>
            <P>
              By accessing or using Planix, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our practices, please discontinue use of our services.
            </P>
            <P>
              This policy applies to all users of the Planix platform, including those who access our services through a web browser, mobile application, or third-party integration. It does not apply to third-party websites or services that may be linked to from within Planix.
            </P>
          </Section>

          <Section id="collection" title="2. Information We Collect">
            <P>We collect information in three primary ways: information you provide directly, information collected automatically, and information from third-party services like Google.</P>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: '10px', marginTop: '20px' }}>2.1 Information You Provide</h3>
            <UL items={[
              'Google account name and email address (obtained via OAuth 2.0 sign-in)',
              'Profile photo associated with your Google account (optional, display only)',
              'Event titles, descriptions, dates, times, locations, and attendee lists you create in Planix',
              'Custom reminder messages and notification preferences you configure',
              'Notes attached to calendar entries',
              'Feedback, support requests, or communications you send to us',
            ]} />

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: '10px', marginTop: '20px' }}>2.2 Automatically Collected Information</h3>
            <UL items={[
              'IP address and approximate geographic location (country/region level only)',
              'Device type, operating system, and browser version',
              'Pages visited, features used, and time spent on the platform',
              'Date and time of access, and session duration',
              'Error logs and crash reports to help us improve reliability',
              'Referral source (how you arrived at Planix)',
            ]} />

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: '10px', marginTop: '20px' }}>2.3 What We Do NOT Collect</h3>
            <InfoBox color="cyan">
              We never collect payment card numbers, social security numbers, government-issued ID numbers, biometric data, or any sensitive personal information beyond what is necessary to provide the calendar service. We do not build advertising profiles.
            </InfoBox>
          </Section>

          <Section id="use" title="3. How We Use Your Information">
            <P>We use the information we collect exclusively to provide, maintain, and improve the Planix service. Specifically:</P>
            <UL items={[
              'Authenticating your identity and maintaining your logged-in session',
              'Displaying your calendar events, reminders, and scheduling data within the app',
              'Synchronizing events between Planix and your Google Calendar in real time',
              'Delivering smart reminder notifications at the times you specify',
              'Sending transactional emails (e.g., account confirmation, security alerts) — never marketing emails without explicit opt-in',
              'Diagnosing technical issues and improving application performance',
              'Complying with legal obligations and enforcing our Terms of Service',
              'Detecting, preventing, and responding to fraud, abuse, or security incidents',
            ]} />
            <P>
              We do <strong style={{ color: 'rgba(255,255,255,.75)' }}>not</strong> use your data to train machine learning models, display advertisements, or create behavioral profiles for sale to third parties.
            </P>
          </Section>

          <Section id="google" title="4. Google Integration & OAuth">
            <InfoBox color="purple">
              Planix authenticates exclusively via Google OAuth 2.0. We never store your Google password. Access tokens are encrypted at rest and used only to sync calendar data on your behalf.
            </InfoBox>
            <P>
              When you sign in with Google, you grant Planix permission to access specific Google account resources. We request only the permissions necessary to deliver the service:
            </P>
            <UL items={[
              'Your basic profile information (name, email, profile photo) — for account identification',
              'Google Calendar read/write access — to fetch, create, update, and delete events on your primary calendar',
              'Offline access (refresh token) — to perform background sync without requiring you to re-authenticate each session',
            ]} />
            <P>
              Google OAuth tokens are stored in our PostgreSQL database in encrypted form. Refresh tokens are used solely to maintain your calendar synchronization and are never shared with any third party. You can revoke Planix's access to your Google account at any time by visiting your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(167,139,250,.85)', textDecoration: 'none' }}>Google Account Permissions page</a>.
            </P>
            <P>
              Revoking access will immediately disconnect Planix from your Google Calendar. Your Planix account data (events created in Planix) will be retained for 30 days before automatic deletion, unless you request immediate deletion.
            </P>
            <P>
              Our use of Google APIs complies with the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(167,139,250,.85)', textDecoration: 'none' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
            </P>
          </Section>

          <Section id="sharing" title="5. Data Sharing & Disclosure">
            <P>
              We do not sell, rent, or trade your personal information. We share your data only in the following limited circumstances:
            </P>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: '10px', marginTop: '20px' }}>5.1 Service Providers</h3>
            <P>We work with a small number of trusted third-party vendors to operate Planix:</P>
            <UL items={[
              'Supabase (PostgreSQL database hosting) — stores your account data and calendar events on servers in the EU/US',
              'Render / Railway (application hosting) — hosts the Planix backend server infrastructure',
              'Google LLC — calendar synchronization via the Google Calendar API',
              'Resend / SendGrid (optional) — transactional email delivery for notifications and alerts',
            ]} />
            <P>Each provider is contractually bound to process your data only as directed by us and to maintain appropriate security standards.</P>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: '10px', marginTop: '20px' }}>5.2 Legal Requirements</h3>
            <P>
              We may disclose your information if required to do so by law, court order, or governmental authority, or if we believe in good faith that disclosure is necessary to protect the rights, property, or safety of Planix, our users, or the public.
            </P>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', marginBottom: '10px', marginTop: '20px' }}>5.3 Business Transfers</h3>
            <P>
              In the event of a merger, acquisition, or sale of all or substantially all of our assets, your information may be transferred to the acquiring entity. We will provide notice before your information is transferred and becomes subject to a different privacy policy.
            </P>
          </Section>

          <Section id="storage" title="6. Data Storage & Security">
            <P>
              We take the security of your data seriously and implement industry-standard safeguards:
            </P>
            <UL items={[
              'All data is encrypted in transit using TLS 1.2 or higher',
              'Google OAuth tokens are encrypted at rest using AES-256',
              'Session cookies are HTTP-only and Secure-flagged to prevent XSS attacks',
              'JWT tokens have short expiry windows and are signed with HMAC-SHA256',
              'Database access is restricted to authenticated backend services only',
              'We conduct regular security reviews and dependency audits',
            ]} />
            <P>
              Your data is stored on servers located in the United States and/or European Union. If you are located outside these regions, your data may be transferred internationally. By using Planix, you consent to this transfer.
            </P>
            <InfoBox color="amber">
              <strong>Important:</strong> No method of electronic transmission or storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security. In the event of a data breach affecting your personal information, we will notify you in accordance with applicable law.
            </InfoBox>
            <P>
              We retain your data for as long as your account is active or as needed to provide you services. You may request deletion of your account and all associated data at any time by contacting {CONTACT_EMAIL}.
            </P>
          </Section>

          <Section id="rights" title="7. Your Rights & Choices">
            <P>Depending on your location, you may have the following rights regarding your personal data:</P>
            <UL items={[
              'Access: Request a copy of the personal data we hold about you',
              'Correction: Request correction of inaccurate or incomplete data',
              'Deletion: Request deletion of your account and all associated personal data',
              'Portability: Request your data in a machine-readable format (JSON/CSV)',
              'Restriction: Request that we limit processing of your data in certain circumstances',
              'Objection: Object to processing of your data for certain purposes',
              'Withdrawal of consent: Revoke Google Calendar access at any time via your Google Account settings',
            ]} />
            <P>
              To exercise any of these rights, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'rgba(167,139,250,.85)', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>. We will respond to verified requests within 30 days. We may need to verify your identity before processing your request.
            </P>
            <P>
              If you are a resident of the European Economic Area (EEA), you have the right to lodge a complaint with your local data protection authority if you believe our processing of your personal data violates applicable law.
            </P>
          </Section>

          <Section id="cookies" title="8. Cookies & Tracking">
            <P>Planix uses a minimal set of cookies, all strictly necessary for the service to function:</P>
            <UL items={[
              'Session cookie (HTTP-only): Stores your encrypted JWT session token. Required for authentication. Duration: session + 7-day sliding window.',
              'CSRF token: Protects against cross-site request forgery attacks. Duration: session.',
              'Preference cookie: Stores your UI preferences (theme, timezone). Duration: 1 year.',
            ]} />
            <P>
              We do not use advertising cookies, third-party tracking cookies, or analytics cookies from services like Google Analytics. We use self-hosted, privacy-preserving analytics (if any) that do not share data with third parties.
            </P>
            <P>
              You can configure your browser to refuse all cookies or to indicate when a cookie is being set. However, disabling cookies will prevent you from using Planix, as authentication requires cookies to function.
            </P>
          </Section>

          <Section id="children" title="9. Children's Privacy">
            <InfoBox color="amber">
              Planix is not directed to children under the age of 13 (or 16 in the EEA), and we do not knowingly collect personal information from children.
            </InfoBox>
            <P>
              If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us at {CONTACT_EMAIL}. We will promptly delete such information from our systems.
            </P>
          </Section>

          <Section id="changes" title="10. Changes to This Policy">
            <P>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:
            </P>
            <UL items={[
              'Posting the updated policy on this page with a revised "Last Updated" date',
              'Sending an email notification to your registered address (for material changes)',
              'Displaying an in-app notification when you next log in',
            ]} />
            <P>
              Your continued use of Planix after the effective date of any changes constitutes your acceptance of the revised policy. If you do not agree with the changes, you should discontinue use and request deletion of your account.
            </P>
          </Section>

          <Section id="contact" title="11. Contact Us">
            <P>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</P>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.09)',
              borderRadius: '16px', padding: '20px 22px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {[
                ['Company', COMPANY],
                ['Privacy Email', CONTACT_EMAIL],
                ['Website', WEBSITE],
                ['Response Time', 'Within 30 business days'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,.3)', width: '120px', flexShrink: 0 }}>{k}</span>
                  <span style={{ color: 'rgba(255,255,255,.7)' }}>{v}</span>
                </div>
              ))}
            </div>
          </Section>

        </main>
      </div>
    </>
  );
}