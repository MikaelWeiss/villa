import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Card from '../components/ui/Card';

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
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 to-black text-white">
      <header className="flex items-center justify-between px-8 py-6 border-b border-white border-opacity-10">
        <div className="flex items-center gap-3">
          <img src="/favicon-32x32.png" alt="Villa" width={28} height={28} />
          <span className="text-lg font-bold">Villa</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-primary-300 transition-smooth">Home</Link>
          <Link to="/signin">
            <Button variant="secondary">Sign in</Button>
          </Link>
        </nav>
      </header>

      <main className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-2">Request a quote</h1>
          <p className="text-white text-opacity-85 mb-6">Tell us a bit about your properties and we will reach out shortly.</p>

          {submitted && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-success-100 bg-opacity-20 border border-success-400 text-white">
              Thanks! We received your request and will be in touch.
            </div>
          )}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-error-100 bg-opacity-20 border border-error-400 text-white">
              {error}
            </div>
          )}

          <Card className="bg-white bg-opacity-5 border border-white border-opacity-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={formState.name}
                onChange={e => updateField('name', e.target.value)}
                required
                placeholder="Full name"
                className="bg-black bg-opacity-30 border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-50"
                containerClassName="text-white"
              />
              <Input
                type="email"
                label="Email"
                value={formState.email}
                onChange={e => updateField('email', e.target.value)}
                required
                placeholder="you@company.com"
                className="bg-black bg-opacity-30 border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-50"
                containerClassName="text-white"
              />
              <Input
                label="Phone"
                value={formState.phone}
                onChange={e => updateField('phone', e.target.value)}
                placeholder="(555) 555-5555"
                className="bg-black bg-opacity-30 border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-50"
                containerClassName="text-white"
              />
              <Input
                label="Portfolio size"
                value={formState.portfolioSize}
                onChange={e => updateField('portfolioSize', e.target.value)}
                placeholder="Units or doors"
                className="bg-black bg-opacity-30 border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-50"
                containerClassName="text-white"
              />
              <div className="md:col-span-2">
                <TextArea
                  label="What are you looking to improve?"
                  value={formState.message}
                  onChange={e => updateField('message', e.target.value)}
                  rows={6}
                  placeholder="Share any context (e.g., current tools, challenges, timelines)"
                  className="bg-black bg-opacity-30 border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-50"
                  containerClassName="text-white"
                />
              </div>
              <div className="md:col-span-2 flex gap-3 items-center">
                <Button type="submit" disabled={submitting} loading={submitting} variant="secondary" size="lg">
                  Request a quote
                </Button>
                <Link to="/" className="text-white hover:text-primary-300 transition-smooth">Back to home</Link>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
