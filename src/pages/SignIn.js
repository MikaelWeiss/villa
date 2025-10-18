import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Building2, Mail, CheckCircle2, ArrowLeft, Shield, Zap, Clock } from 'lucide-react';

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
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-accent-600 p-12 flex-col justify-between text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <Building2 size={28} className="text-white" />
            </div>
            <span className="text-2xl font-bold">Villa</span>
          </Link>

          <div className="max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Check your email</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              We've sent a secure magic link to help you sign in quickly and safely.
            </p>
          </div>

          <div className="text-white/60 text-sm">
            Modern maintenance management © {new Date().getFullYear()}
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="max-w-md w-full animate-fade-in-up">
            <Link to="/" className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary transition-colors mb-8">
              <ArrowLeft size={16} />
              <span className="text-sm">Back to home</span>
            </Link>

            <Card variant="elevated" padding="xl" className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success-100 flex items-center justify-center animate-bounce-in">
                <Mail size={32} className="text-success-600" />
              </div>

              <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                Check your email
              </h1>

              <p className="text-secondary-600 mb-6 leading-relaxed">
                We've sent a magic link to
              </p>

              <div className="px-4 py-3 rounded-xl bg-primary-50 border border-primary-200 mb-6">
                <p className="font-semibold text-primary-700">{email}</p>
              </div>

              <p className="text-sm text-secondary-500 mb-8">
                Click the link in the email to sign in to your account. The link will expire in 15 minutes.
              </p>

              <div className="pt-6 border-t border-secondary-200">
                <p className="text-sm text-secondary-600 mb-4">
                  Didn't receive the email?
                </p>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                >
                  Try again
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-accent-600 p-12 flex-col justify-between text-white">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
            <Building2 size={28} className="text-white" />
          </div>
          <span className="text-2xl font-bold">Villa</span>
        </Link>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-6">
            Welcome to modern apartment maintenance
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Streamline maintenance requests, track progress, and keep your properties in excellent condition.
          </p>

          <div className="space-y-4">
            {[
              { icon: <Zap />, text: 'Fast and secure magic link authentication' },
              { icon: <Shield />, text: 'Enterprise-grade security and privacy' },
              { icon: <Clock />, text: 'Access your dashboard in seconds' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {React.cloneElement(feature.icon, { size: 20 })}
                </div>
                <span className="text-white/90">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/60 text-sm">
          Modern maintenance management © {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="max-w-md w-full animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
              <Building2 size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900">Villa</span>
          </div>

          <Link to="/" className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} />
            <span className="text-sm">Back to home</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Sign in to your account
            </h1>
            <p className="text-secondary-600">
              Enter your email to receive a magic link
            </p>
          </div>

          <Card variant="elevated" padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={error}
              />

              {error && (
                <div className="px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                fullWidth
                size="lg"
                leftIcon={<Mail />}
              >
                Send Magic Link
              </Button>

              <div className="text-center">
                <p className="text-xs text-secondary-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </form>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Don't have an account?{' '}
              <Link to="/quote" className="text-primary-600 hover:text-primary-700 font-medium">
                Request access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
