import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RequestQuote() {
  React.useEffect(() => {
    document.title = 'Request a Quote - Villa';
  }, []);

  const [formState, setFormState] = React.useState({
    name: '',
    email: '',
    phone: '',
    portfolioSize: '',
    message: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { error: insertError } = await supabase
        .from('quotes')
        .insert({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          portfolio_size: formState.portfolioSize,
          message: formState.message,
          status: 'new',
          source: 'website',
        });

      if (insertError) throw insertError;

      setSubmitted(true);
      setFormState({ name: '', email: '', phone: '', portfolioSize: '', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(key, value) {
    setFormState(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1e 0%, #000000 100%)', color: 'white' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/favicon-32x32.png" alt="Villa" width={28} height={28} />
          <strong style={{ fontSize: 18 }}>Villa</strong>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Home</Link>
          <Link to="/signin" style={{ color: '#0a0f1e', background: 'white', padding: '10px 14px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </nav>
      </header>

      <main style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: 36 }}>Request a quote</h1>
          <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.85)' }}>Tell us a bit about your properties and we will reach out shortly.</p>

          {submitted && (
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: 'rgba(46, 204, 113, 0.15)', border: '1px solid rgba(46, 204, 113, 0.35)' }}>
              Thanks! We received your request and will be in touch.
            </div>
          )}
          {error && (
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: 'rgba(231, 76, 60, 0.15)', border: '1px solid rgba(231, 76, 60, 0.35)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Name</span>
              <input value={formState.name} onChange={e => updateField('name', e.target.value)} required placeholder="Full name" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Email</span>
              <input type="email" value={formState.email} onChange={e => updateField('email', e.target.value)} required placeholder="you@company.com" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Phone</span>
              <input value={formState.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(555) 555-5555" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Portfolio size</span>
              <input value={formState.portfolioSize} onChange={e => updateField('portfolioSize', e.target.value)} placeholder="Units or doors" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' }} />
            </label>
            <label style={{ display: 'grid', gap: 6, gridColumn: '1 / -1' }}>
              <span>What are you looking to improve?</span>
              <textarea value={formState.message} onChange={e => updateField('message', e.target.value)} rows={6} placeholder="Share any context (e.g., current tools, challenges, timelines)" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', resize: 'vertical' }} />
            </label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'center' }}>
              <button type="submit" disabled={submitting} style={{ background: 'white', color: '#0a0f1e', padding: '12px 16px', borderRadius: 10, fontWeight: 700, border: 0, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting…' : 'Request a quote'}
              </button>
              <Link to="/" style={{ color: 'white' }}>Back to home</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
