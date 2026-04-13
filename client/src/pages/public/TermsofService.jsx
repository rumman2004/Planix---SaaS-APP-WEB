import React, { useState, useEffect } from 'react';

const LAST_UPDATED   = 'June 15, 2025';
const EFFECTIVE_DATE = 'June 15, 2025';
const COMPANY        = 'Planix';
const CONTACT_EMAIL  = 'legal@planix.app';
const WEBSITE        = 'https://planix.app';

const sections = [
  { id: 'acceptance',    label: 'Acceptance of Terms' },
  { id: 'description',   label: 'Service Description' },
  { id: 'eligibility',   label: 'Eligibility' },
  { id: 'accounts',      label: 'Accounts & Authentication' },
  { id: 'acceptable',    label: 'Acceptable Use' },
  { id: 'intellectual',  label: 'Intellectual Property' },
  { id: 'google',        label: 'Google Services' },
  { id: 'data',          label: 'Your Data' },
  { id: 'availability',  label: 'Availability & SLA' },
  { id: 'disclaimers',   label: 'Disclaimers' },
  { id: 'liability',     label: 'Limitation of Liability' },
  { id: 'indemnification', label: 'Indemnification' },
  { id: 'termination',   label: 'Termination' },
  { id: 'governing',     label: 'Governing Law' },
  { id: 'changes',       label: 'Changes to Terms' },
  { id: 'contact',       label: 'Contact' },
];

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: '48px', scrollMarginTop: '100px' }}>
      <h2 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: '22px', fontWeight: 400,
        color: 'rgba(255,255,255,.92)',
        marginBottom: '16px', letterSpacing: '-.3px',
        paddingBottom: '12px',
        borderBottom: '0.5px solid rgba(255,255,255,.08)',
      }}>{title}</h2>
      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,.58)', lineHeight: 1.85, fontWeight: 300 }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }) {
  return <p style={{ marginBottom: '14px' }}>{children}</p>;
}

function UL({ items }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ color: 'rgba(167,139,250,.7)', marginTop: '2px', flexShrink: 0, fontSize: '12px' }}>✦</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ color = 'purple', children }) {
  const c = {
    purple: { bg: 'rgba(139,92,246,.1)',  border: 'rgba(139,92,246,.25)', text: 'rgba(196,181,253,.9)' },
    cyan:   { bg: 'rgba(8,145,178,.1)',   border: 'rgba(8,145,178,.25)',  text: 'rgba(103,232,249,.9)' },
    green:  { bg: 'rgba(22,163,74,.1)',   border: 'rgba(22,163,74,.25)',  text: 'rgba(74,222,128,.9)'  },
    amber:  { bg: 'rgba(217,119,6,.1)',   border: 'rgba(217,119,6,.25)',  text: 'rgba(251,191,36,.9)'  },
    red:    { bg: 'rgba(220,38,38,.1)',   border: 'rgba(220,38,38,.25)',  text: 'rgba(252,165,165,.9)' },
  }[color];
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

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const els = sections.map(s => document.getElementById(s.id)).filter(Boolean);
      let cur = sections[0].id;
      for (const el of els) {
        if (window.scrollY >= el.offsetTop - 130) cur = el.id;
      }
      setActiveSection(cur);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{
          background:#0a0a0f;
          font-family:'DM Sans',sans-serif;
          color:rgba(255,255,255,.85);
        }
        body::before{
          content:'';
          position:fixed; inset:0; z-index:0;
          background:
            radial-gradient(ellipse 55% 50% at 95% 5%,   rgba(217,70,239,.2)  0%,transparent 55%),
            radial-gradient(ellipse 50% 40% at 5%  95%,  rgba(8,145,178,.18)  0%,transparent 55%),
            radial-gradient(ellipse 40% 35% at 50% 50%,  rgba(99,59,222,.07)  0%,transparent 60%);
          pointer-events:none;
          animation:bgTos 20s ease-in-out infinite alternate;
        }
        @keyframes bgTos{
          0%  {opacity:.8; transform:scale(1);}
          100%{opacity:1;  transform:scale(1.06);}
        }

        .tos-nav{
          position:fixed; top:0; left:0; right:0; z-index:100;
          padding:0 40px; height:60px;
          display:flex; align-items:center; justify-content:space-between;
          transition:all .25s;
        }
        .tos-nav.scrolled{
          background:rgba(10,10,20,.8);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          border-bottom:0.5px solid rgba(255,255,255,.08);
        }
        .tos-nav-logo{display:flex;align-items:center;gap:8px;text-decoration:none;}
        .tos-nav-mark{
          width:30px;height:30px;border-radius:8px;
          background:linear-gradient(135deg,rgba(139,92,246,.7),rgba(217,70,239,.6));
          border:0.5px solid rgba(200,160,255,.3);
          display:flex;align-items:center;justify-content:center;font-size:14px;
        }
        .tos-nav-name{font-family:'DM Serif Display',serif;font-size:18px;color:rgba(255,255,255,.9);}
        .tos-nav-back{
          font-size:12px;color:rgba(255,255,255,.4);text-decoration:none;
          padding:6px 14px;border:0.5px solid rgba(255,255,255,.1);border-radius:100px;
          transition:all .2s;
        }
        .tos-nav-back:hover{color:rgba(255,255,255,.8);border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.06);}

        .tos-layout{
          position:relative;z-index:1;
          max-width:1100px;margin:0 auto;
          display:grid;grid-template-columns:220px 1fr;
          padding-top:60px;
        }

        .tos-sidebar{
          position:sticky;top:60px;
          height:calc(100vh - 60px);overflow-y:auto;
          padding:36px 20px 40px 32px;
          border-right:0.5px solid rgba(255,255,255,.06);
        }
        .tos-sidebar::-webkit-scrollbar{width:0;}

        .tos-sidebar-label{
          font-size:10px;font-weight:500;letter-spacing:1.5px;
          text-transform:uppercase;color:rgba(255,255,255,.2);
          margin-bottom:14px;padding-left:4px;
        }
        .tos-link{
          display:block;padding:6px 10px;border-radius:8px;
          font-size:12px;font-weight:400;color:rgba(255,255,255,.38);
          cursor:pointer;transition:all .15s;margin-bottom:2px;
          border:none;background:transparent;text-align:left;width:100%;
          font-family:'DM Sans',sans-serif;
        }
        .tos-link:hover{color:rgba(255,255,255,.7);background:rgba(255,255,255,.06);}
        .tos-link.active{color:rgba(167,139,250,.95);background:rgba(139,92,246,.12);font-weight:500;}

        .tos-content{padding:48px 60px 80px 56px;max-width:780px;}

        .tos-hero{margin-bottom:52px;padding-bottom:36px;border-bottom:0.5px solid rgba(255,255,255,.07);}
        .tos-badge{
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(236,72,153,.1);border:0.5px solid rgba(236,72,153,.22);
          border-radius:100px;padding:4px 12px;margin-bottom:16px;
          font-size:11px;font-weight:500;color:rgba(249,168,212,.85);letter-spacing:.3px;
        }
        .tos-hero-title{
          font-family:'DM Serif Display',serif;
          font-size:40px;font-weight:400;color:rgba(255,255,255,.95);
          letter-spacing:-1px;line-height:1.1;margin-bottom:14px;
        }
        .tos-hero-desc{
          font-size:14px;color:rgba(255,255,255,.42);
          font-weight:300;line-height:1.7;max-width:560px;margin-bottom:20px;
        }
        .tos-meta{display:flex;gap:24px;flex-wrap:wrap;}
        .tos-meta-item{font-size:12px;color:rgba(255,255,255,.28);}
        .tos-meta-item strong{color:rgba(255,255,255,.55);font-weight:500;}

        @media(max-width:768px){
          .tos-layout{grid-template-columns:1fr;}
          .tos-sidebar{display:none;}
          .tos-content{padding:32px 24px 60px;}
          .tos-hero-title{font-size:30px;}
        }
      `}</style>

      <nav className={`tos-nav${scrolled ? ' scrolled' : ''}`}>
        <a href="/" className="tos-nav-logo">
          <div className="tos-nav-mark">✦</div>
          <span className="tos-nav-name">Planix</span>
        </a>
        <a href="/" className="tos-nav-back">← Back to app</a>
      </nav>

      <div className="tos-layout">

        <aside className="tos-sidebar">
          <div className="tos-sidebar-label">Contents</div>
          {sections.map(s => (
            <button
              key={s.id}
              className={`tos-link${activeSection === s.id ? ' active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.label}
            </button>
          ))}
        </aside>

        <main className="tos-content">

          {/* Hero */}
          <div className="tos-hero" id="acceptance">
            <div className="tos-badge">✦ Legal</div>
            <h1 className="tos-hero-title">Terms of Service</h1>
            <p className="tos-hero-desc">
              These Terms govern your use of Planix. Please read them carefully. By using Planix, you agree to be bound by these Terms. If you don't agree, please don't use our service.
            </p>
            <div className="tos-meta">
              <div className="tos-meta-item">Last updated: <strong>{LAST_UPDATED}</strong></div>
              <div className="tos-meta-item">Effective: <strong>{EFFECTIVE_DATE}</strong></div>
            </div>
          </div>

          <Section id="acceptance" title="1. Acceptance of Terms">
            <InfoBox color="purple">
              By accessing or using Planix in any way — including browsing the website, creating an account, or using any feature — you confirm that you have read, understood, and agree to be legally bound by these Terms of Service and our Privacy Policy.
            </InfoBox>
            <P>
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and {COMPANY} ("we," "us," or "our") regarding your access to and use of the Planix platform, including all associated websites, applications, APIs, and services (collectively, the "Service").
            </P>
            <P>
              If you are using Planix on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms, and references to "you" shall include both you individually and the organization.
            </P>
            <P>
              We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the revised Terms.
            </P>
          </Section>

          <Section id="description" title="2. Description of Service">
            <P>
              Planix is a smart calendar management platform that integrates with Google Calendar to help users organize, schedule, and receive intelligent reminders for their events and tasks. Key features include:
            </P>
            <UL items={[
              'Two-way synchronization with Google Calendar via the Google Calendar API',
              'Creation, editing, and deletion of calendar events through a web-based interface',
              'Smart reminder engine: custom messages with precise trigger times delivered via server-side scheduling',
              'Secure authentication via Google OAuth 2.0 — no separate password required',
              'Dashboard visualization of upcoming and past events',
              'Cross-device access via any modern web browser',
            ]} />
            <P>
              Planix is provided as a software-as-a-service (SaaS) product. We reserve the right to add, modify, or remove features at any time. We will make reasonable efforts to notify users of significant changes.
            </P>
          </Section>

          <Section id="eligibility" title="3. Eligibility">
            <P>To use Planix, you must meet the following requirements:</P>
            <UL items={[
              'You must be at least 13 years of age (or 16 in the European Economic Area)',
              'You must have a valid Google account in good standing',
              'You must not be located in a country subject to a U.S. government embargo or designated as a terrorist-supporting country',
              'You must not be a person barred from receiving services under applicable laws',
              'You must not have been previously suspended or removed from Planix',
            ]} />
            <P>
              By using the Service, you represent and warrant that you meet all eligibility requirements. We reserve the right to verify eligibility at any time and to terminate accounts that do not comply.
            </P>
          </Section>

          <Section id="accounts" title="4. Accounts & Authentication">
            <P>
              Planix uses Google OAuth 2.0 for account creation and authentication. By signing in with Google, you authorize Planix to access certain Google account data as described in our Privacy Policy and as shown on Google's consent screen.
            </P>
            <UL items={[
              'You are responsible for maintaining the security of your Google account, including your Google password and two-factor authentication settings',
              'You must notify us immediately at ' + CONTACT_EMAIL + ' if you suspect unauthorized access to your Planix account',
              'You may not share your account credentials or allow others to access Planix on your behalf without our written consent',
              'You are responsible for all activity that occurs under your account',
              'We are not liable for any loss or damage arising from unauthorized access to your account resulting from your failure to maintain account security',
            ]} />
            <P>
              Each account is for individual use only. Creating multiple accounts to circumvent limits, suspensions, or any other restriction is prohibited.
            </P>
          </Section>

          <Section id="acceptable" title="5. Acceptable Use Policy">
            <InfoBox color="red">
              Violation of this Acceptable Use Policy may result in immediate suspension or termination of your account without notice or refund.
            </InfoBox>
            <P>You agree to use Planix only for lawful purposes and in a manner that does not infringe the rights of others. You must not:</P>
            <UL items={[
              'Use the Service to store, transmit, or process illegal content, including content that infringes copyright, trademarks, or other intellectual property rights',
              'Attempt to gain unauthorized access to the Service, its servers, databases, or related systems',
              'Reverse engineer, decompile, disassemble, or attempt to extract the source code of the Service',
              'Use automated tools (bots, crawlers, scrapers) to access the Service without our express written permission',
              'Introduce viruses, malware, trojans, or any other malicious code',
              'Interfere with or disrupt the integrity or performance of the Service or its underlying infrastructure',
              'Impersonate any person or entity, or falsely represent your affiliation with any person or entity',
              'Use the Service to send unsolicited communications (spam) to other users',
              'Circumvent, disable, or otherwise interfere with security features of the Service',
              'Use the Service in any way that could damage, disable, overburden, or impair our servers or networks',
              'Sublicense, sell, resell, transfer, assign, or otherwise commercially exploit the Service',
              'Access the Service for competitive intelligence or to build a competing product',
            ]} />
            <P>
              We reserve the right to investigate violations of this policy and to cooperate with law enforcement authorities in prosecuting users who violate applicable laws.
            </P>
          </Section>

          <Section id="intellectual" title="6. Intellectual Property">
            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,.75)', marginBottom: '10px', marginTop: '4px' }}>6.1 Our Property</h3>
            <P>
              The Planix platform, including its design, code, interfaces, logos, trademarks, and all proprietary technology, is owned by {COMPANY} and is protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable license to use the Service for personal, non-commercial purposes in accordance with these Terms.
            </P>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,.75)', marginBottom: '10px', marginTop: '20px' }}>6.2 Your Content</h3>
            <P>
              You retain full ownership of all content you create within Planix, including event titles, descriptions, notes, and reminder messages ("Your Content"). By using the Service, you grant Planix a limited license to store, process, and display Your Content solely for the purpose of providing the Service to you.
            </P>
            <P>
              We do not claim ownership of Your Content. We will not use Your Content for any purpose other than operating the Service, and we will delete Your Content within 30 days of account termination.
            </P>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,.75)', marginBottom: '10px', marginTop: '20px' }}>6.3 Feedback</h3>
            <P>
              If you submit suggestions, ideas, or feedback about the Service ("Feedback"), you grant us a perpetual, worldwide, royalty-free license to use and incorporate that Feedback into the Service without any obligation to compensate you.
            </P>
          </Section>

          <Section id="google" title="7. Google Services & Third-Party Terms">
            <P>
              Planix integrates with Google Calendar via the Google Calendar API. Your use of Planix is also subject to Google's terms:
            </P>
            <UL items={[
              'Google Terms of Service: https://policies.google.com/terms',
              'Google Calendar API Terms of Service: https://developers.google.com/terms',
              'Google Privacy Policy: https://policies.google.com/privacy',
            ]} />
            <P>
              By using Planix, you authorize us to access and manage your Google Calendar data on your behalf. We act as a processor of your Google Calendar data and comply with all applicable Google API terms, including the Limited Use requirements of the Google API Services User Data Policy.
            </P>
            <P>
              We are not affiliated with, endorsed by, or sponsored by Google LLC. Any disputes related to your Google account must be resolved directly with Google.
            </P>
            <InfoBox color="cyan">
              You can revoke Planix's access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Google Account Security settings</a>. Revoking access will immediately disconnect the integration.
            </InfoBox>
          </Section>

          <Section id="data" title="8. Your Data & Portability">
            <P>
              You own your data. We are stewards of it, not owners. This means:
            </P>
            <UL items={[
              'You can export all your Planix data at any time by contacting ' + CONTACT_EMAIL,
              'We will provide your data in JSON format within 10 business days of a valid request',
              'Upon account deletion, we will permanently delete your data within 30 days from our servers and backups',
              'We do not use your calendar data to train machine learning models or derive insights for commercial purposes',
              'We do not sell, rent, or otherwise monetize your data',
            ]} />
            <P>
              For full details on how we handle your data, please refer to our <a href="/privacy" style={{ color: 'rgba(167,139,250,.85)', textDecoration: 'none' }}>Privacy Policy</a>.
            </P>
          </Section>

          <Section id="availability" title="9. Availability & Service Levels">
            <P>
              We strive to maintain high availability of the Planix service, but we do not guarantee uninterrupted access. The following applies:
            </P>
            <UL items={[
              'We target 99.5% monthly uptime for the core application, excluding scheduled maintenance',
              'Scheduled maintenance will be announced at least 24 hours in advance via in-app notification and/or email',
              'Emergency maintenance may be performed without advance notice if required to address security vulnerabilities or critical failures',
              'The smart reminder CRON system runs on a 60-second cycle; reminder delivery is best-effort and not guaranteed to the second',
              'Google Calendar synchronization is dependent on Google API availability and may be affected by Google outages beyond our control',
            ]} />
            <InfoBox color="amber">
              <strong>No SLA for free tier:</strong> Planix is currently offered free of charge. No formal service level agreement (SLA) applies to free accounts. We reserve the right to introduce paid tiers with formal SLAs in the future.
            </InfoBox>
          </Section>

          <Section id="disclaimers" title="10. Disclaimers & Warranties">
            <InfoBox color="red">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            </InfoBox>
            <P>
              To the fullest extent permitted by applicable law, {COMPANY} expressly disclaims all warranties, including but not limited to:
            </P>
            <UL items={[
              'Implied warranties of merchantability, fitness for a particular purpose, and non-infringement',
              'Warranties that the Service will meet your requirements or expectations',
              'Warranties that the Service will be uninterrupted, timely, secure, or error-free',
              'Warranties regarding the accuracy, reliability, or completeness of any information provided',
              'Warranties that defects or errors will be corrected',
            ]} />
            <P>
              We do not warrant that the Service is free of viruses or other harmful components. You are responsible for implementing appropriate security measures on your devices.
            </P>
          </Section>

          <Section id="liability" title="11. Limitation of Liability">
            <InfoBox color="red">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PLANIX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
            </InfoBox>
            <P>
              In no event shall {COMPANY}'s total cumulative liability to you for all claims arising out of or relating to these Terms or the Service exceed the greater of (a) the amount you paid to {COMPANY} in the twelve (12) months preceding the claim, or (b) USD $50.
            </P>
            <P>
              This limitation applies whether the liability arises in contract, tort (including negligence), strict liability, or any other theory, and whether or not {COMPANY} has been advised of the possibility of such damages.
            </P>
            <P>
              Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for consequential or incidental damages. In such jurisdictions, our liability is limited to the greatest extent permitted by law.
            </P>
          </Section>

          <Section id="indemnification" title="12. Indemnification">
            <P>
              You agree to defend, indemnify, and hold harmless {COMPANY} and its officers, directors, employees, agents, and successors from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to:
            </P>
            <UL items={[
              'Your use of or access to the Service',
              'Your violation of these Terms',
              'Your violation of any third-party right, including intellectual property rights or privacy rights',
              'Any content you create, store, or transmit through the Service',
              'Your violation of any applicable law or regulation',
            ]} />
            <P>
              We reserve the right to assume exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of such claims.
            </P>
          </Section>

          <Section id="termination" title="13. Termination">
            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,.75)', marginBottom: '10px', marginTop: '4px' }}>13.1 Termination by You</h3>
            <P>
              You may terminate your Planix account at any time by contacting us at {CONTACT_EMAIL} or by revoking Planix's access via your Google Account settings. Upon termination, your right to use the Service will immediately cease.
            </P>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,.75)', marginBottom: '10px', marginTop: '20px' }}>13.2 Termination by Planix</h3>
            <P>
              We may suspend or terminate your account at any time and for any reason, including but not limited to:
            </P>
            <UL items={[
              'Violation of these Terms or our Acceptable Use Policy',
              'Suspected fraudulent, abusive, or illegal activity',
              'Prolonged inactivity (accounts inactive for more than 18 months)',
              'Our decision to discontinue the Service',
            ]} />
            <P>
              We will make reasonable efforts to notify you before termination except where immediate action is required to protect the security or integrity of the Service or other users.
            </P>

            <h3 style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(255,255,255,.75)', marginBottom: '10px', marginTop: '20px' }}>13.3 Effect of Termination</h3>
            <P>
              Upon termination: your license to use the Service ends immediately; we will delete your data within 30 days; provisions of these Terms that by their nature should survive (including intellectual property, disclaimers, liability, and indemnification clauses) will survive termination.
            </P>
          </Section>

          <Section id="governing" title="14. Governing Law & Dispute Resolution">
            <P>
              These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
            </P>
            <P>
              Before initiating any formal dispute resolution, you agree to contact us at {CONTACT_EMAIL} and attempt to resolve the dispute informally. We will make good-faith efforts to resolve the dispute within 30 days.
            </P>
            <P>
              If informal resolution fails, any dispute arising from or relating to these Terms shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, except that either party may seek emergency equitable relief in a court of competent jurisdiction.
            </P>
            <InfoBox color="cyan">
              <strong>Class action waiver:</strong> You and Planix agree that each may bring claims against the other only in individual capacity, and not as a plaintiff or class member in any purported class or representative proceeding.
            </InfoBox>
            <P>
              If you are a consumer located in the European Union, nothing in these Terms affects your statutory rights under applicable EU consumer protection laws.
            </P>
          </Section>

          <Section id="changes" title="15. Changes to Terms">
            <P>
              We reserve the right to modify these Terms at any time. When we make material changes, we will:
            </P>
            <UL items={[
              'Update the "Last Updated" date at the top of this page',
              'Send an email notification to your registered address',
              'Display a prominent in-app notice when you next log in',
            ]} />
            <P>
              Changes take effect 14 days after notification for material changes, or immediately for changes required by law or to address security concerns. Your continued use of the Service after the effective date constitutes acceptance of the revised Terms.
            </P>
            <P>
              We maintain an archive of prior Terms versions available upon request at {CONTACT_EMAIL}.
            </P>
          </Section>

          <Section id="contact" title="16. Contact">
            <P>For questions about these Terms, to exercise your rights, or to report violations, contact us:</P>
            <div style={{
              background: 'rgba(255,255,255,.04)',
              border: '0.5px solid rgba(255,255,255,.09)',
              borderRadius: '16px', padding: '20px 22px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {[
                ['Company',       COMPANY],
                ['Legal Email',   CONTACT_EMAIL],
                ['Website',       WEBSITE],
                ['Response Time', 'Within 30 business days'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,.3)', width: '120px', flexShrink: 0 }}>{k}</span>
                  <span style={{ color: 'rgba(255,255,255,.7)' }}>{v}</span>
                </div>
              ))}
            </div>
            <P style={{ marginTop: '18px' }}>
              These Terms were last reviewed by our team on {LAST_UPDATED}. If you have a legal inquiry, please clearly state "Legal Notice" in your email subject line.
            </P>
          </Section>

        </main>
      </div>
    </>
  );
}