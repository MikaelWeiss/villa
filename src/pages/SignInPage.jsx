import { useState } from 'react';
import { useAuth } from '../authentication';

export default function SignInPage() {
  const { signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithMagicLink(email);
      setEmailSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,rgb(5, 7, 13) 0%,rgb(0, 0, 0) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
          margin: '1rem'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>📧</div>
          <h2 style={{
            color: '#333',
            marginBottom: '1rem',
            fontSize: '1.8rem'
          }}>Check your email</h2>
          <p style={{
            color: '#666',
            fontSize: '1rem',
            lineHeight: '1.5'
          }}>
            We've sent a magic link to <strong>{email}</strong>.
            Click the link in the email to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,rgb(5, 7, 13) 0%,rgb(0, 0, 0) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        margin: '1rem'
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '0.5rem',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>Villa</h1>
        <p style={{
          color: '#666',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>Sign in to create or manage damage reports</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              marginBottom: '1rem',
              boxSizing: 'border-box'
            }}
          />

          {error && (
            <p style={{
              color: '#e53e3e',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#999' : '#4285f4',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => !loading && (e.target.style.background = '#3367d6')}
            onMouseOut={(e) => !loading && (e.target.style.background = '#4285f4')}
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
