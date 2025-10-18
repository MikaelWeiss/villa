import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function SignInPage() {
  const { signInWithEmail, user, role } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    document.title = 'Sign In - Villa';
    if (user && role) {
      const redirectPath = role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [user, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email);
      setEmailSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form if user is authenticated
  if (user) {
    return null;
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 to-black flex items-center justify-center p-4">
        <Card className="text-center max-w-md w-full" padding="lg">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="mb-4">Check your email</h2>
          <p className="text-secondary-600">
            We've sent a magic link to <strong className="text-secondary-800">{email}</strong>.
            Click the link in the email to sign in.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 to-black flex items-center justify-center p-4">
      <Card className="text-center max-w-md w-full" padding="lg">
        <h1 className="mb-2">Villa</h1>
        <p className="text-secondary-600 mb-8 text-lg">Sign in to create or manage damage reports</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={error}
          />

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full"
            size="lg"
          >
            Send Magic Link
          </Button>
        </form>
      </Card>
    </div>
  );
}
