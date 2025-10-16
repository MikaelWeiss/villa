import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      color: '#0a0f1e',
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px',
        borderBottom: '1px solid rgba(10,15,30,0.08)',
        background: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/favicon-32x32.png" alt="Villa" width={28} height={28} />
          <strong style={{ fontSize: 18 }}>Villa</strong>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/signin" style={{ color: '#0a0f1e', textDecoration: 'none', opacity: 0.9 }}>Sign in</Link>
          <Link to="/quote" style={{ color: 'white', background: '#1976d2', padding: '10px 14px', borderRadius: 999, textDecoration: 'none', fontWeight: 600 }}>Request a quote</Link>
        </nav>
      </header>

      <main style={{ padding: '56px 24px 80px' }}>
        <section style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 44, lineHeight: 1.15, margin: 0 }}>Apartment damage reports made simple</h1>
          <p style={{ fontSize: 18, color: 'rgba(10,15,30,0.8)', marginTop: 16 }}>
            Capture, track, and resolve unit damage fast. Villa helps tenants submit clear reports and managers coordinate fixes without the back‑and‑forth.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
            <Link to="/quote" style={{ color: 'white', background: '#1976d2', padding: '12px 18px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}>Get a free quote</Link>
            <Link to="/signin" style={{ color: '#1976d2', padding: '12px 18px', borderRadius: 999, textDecoration: 'none', border: '1px solid rgba(25,118,210,0.35)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </section>

        <section style={{ maxWidth: 1000, margin: '64px auto 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { title: 'Fast reporting', desc: 'Tenants log damage with photos and details in minutes.' },
            { title: 'Smart triage', desc: 'Auto‑prioritize issues and route to the right vendor.' },
            { title: 'Clear communication', desc: 'Keep everyone in the loop with updates and timelines.' },
            { title: 'Track outcomes', desc: 'See status at a glance and export landlord‑ready summaries.' },
          ].map(card => (
            <div key={card.title} style={{ background: 'white', border: '1px solid rgba(10,15,30,0.08)', borderRadius: 12, padding: 20, boxShadow: '0 6px 16px rgba(10,15,30,0.06)' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, color: '#0a0f1e' }}>{card.title}</h3>
              <p style={{ margin: 0, color: 'rgba(10,15,30,0.75)' }}>{card.desc}</p>
            </div>
          ))}
        </section>

        <section style={{ maxWidth: 920, margin: '56px auto 0', background: 'white', border: '1px solid rgba(10,15,30,0.08)', borderRadius: 12, padding: 24, boxShadow: '0 6px 16px rgba(10,15,30,0.06)' }}>
          <h2 style={{ margin: 0, fontSize: 28 }}>Meet Villa</h2>
          <p style={{ marginTop: 10, color: 'rgba(10,15,30,0.75)', lineHeight: 1.6 }}>
            Villa is the modern, friendly way to handle apartment damage and maintenance. Tenants get a clear place to report issues with photos and context. Managers get an organized queue, smart priorities, and effortless vendor coordination. Everyone gets transparency.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16, marginTop: 12 }}>
            {[
              { title: 'For tenants', desc: 'Report problems from your phone and track progress in one place.' },
              { title: 'For managers', desc: 'Stay ahead of issues, assign work quickly, and keep records tidy.' },
              { title: 'For owners', desc: 'Reduce downtime, protect assets, and see clean summaries of work.' },
            ].map(x => (
              <div key={x.title} style={{ background: '#f5f7fa', border: '1px solid rgba(10,15,30,0.06)', borderRadius: 10, padding: 16 }}>
                <strong style={{ display: 'block', marginBottom: 6 }}>{x.title}</strong>
                <span style={{ color: 'rgba(10,15,30,0.75)' }}>{x.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1000, margin: '56px auto 0' }}>
          <h2 style={{ fontSize: 28, margin: 0, textAlign: 'center' }}>How it works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 16 }}>
            {[ 
              { step: '1', title: 'Submit', desc: 'Tenant reports an issue with photos and details in seconds.' },
              { step: '2', title: 'Triage', desc: 'Villa suggests priority and routes to the right team or vendor.' },
              { step: '3', title: 'Resolve', desc: 'Track updates, schedule work, and close the loop with proof.' },
              { step: '4', title: 'Review', desc: 'Export summaries for owners, insurance, or compliance.' },
            ].map(s => (
              <div key={s.step} style={{ background: 'white', border: '1px solid rgba(10,15,30,0.08)', borderRadius: 12, padding: 18, boxShadow: '0 6px 16px rgba(10,15,30,0.06)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{s.step}</div>
                <h3 style={{ margin: '10px 0 6px', fontSize: 18 }}>{s.title}</h3>
                <p style={{ margin: 0, color: 'rgba(10,15,30,0.75)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 920, margin: '56px auto 0', background: 'white', border: '1px solid rgba(10,15,30,0.08)', borderRadius: 12, padding: 24, boxShadow: '0 6px 16px rgba(10,15,30,0.06)' }}>
          <h2 style={{ margin: 0, fontSize: 28 }}>Frequently asked</h2>
          <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
            <div>
              <strong>Can Villa replace my current maintenance tool?</strong>
              <p style={{ margin: '6px 0 0', color: 'rgba(10,15,30,0.75)' }}>Yes. Villa covers intake, triage, communication, and tracking, and exports reports you can share with owners or systems.</p>
            </div>
            <div>
              <strong>Do tenants need to install an app?</strong>
              <p style={{ margin: '6px 0 0', color: 'rgba(10,15,30,0.75)' }}>No, they can submit from any device. We keep it simple and fast.</p>
            </div>
            <div>
              <strong>How quickly can we get started?</strong>
              <p style={{ margin: '6px 0 0', color: 'rgba(10,15,30,0.75)' }}>Most teams are up and running in under a day. We’ll guide you.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Link to="/quote" style={{ color: 'white', background: '#1976d2', padding: '10px 14px', borderRadius: 999, textDecoration: 'none', fontWeight: 600 }}>Talk to us</Link>
            <Link to="/signin" style={{ color: '#1976d2', textDecoration: 'none', border: '1px solid rgba(25,118,210,0.35)', padding: '10px 14px', borderRadius: 999, fontWeight: 600 }}>Sign in</Link>
          </div>
        </section>
      </main>

      <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(10,15,30,0.08)', background: 'white' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'rgba(10,15,30,0.7)' }}>
          <span>© {new Date().getFullYear()} Villa</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/signin" style={{ color: '#1976d2', textDecoration: 'none' }}>Tenant/Manager sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


