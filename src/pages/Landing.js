import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LandingPage() {
  const { user, role } = useAuth();

  useEffect(() => {
    document.title = 'Villa - Apartment Maintenance Made Simple';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-8 py-6 border-b border-secondary-200 bg-white">
        <div className="flex items-center gap-3">
          <img src="/favicon-32x32.png" alt="Villa" width={28} height={28} />
          <span className="text-lg font-bold text-secondary-800">Villa</span>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <Link
              to={role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard'}
              className="text-secondary-800 hover:text-primary transition-smooth"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/signin" className="text-secondary-800 hover:text-primary transition-smooth">Sign in</Link>
          )}
          <Link to="/quote">
            <Button>Request a quote</Button>
          </Link>
        </nav>
      </header>

      <main className="px-6 py-14 pb-20">
        <section className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold leading-tight mb-4">Apartment damage reports made simple</h1>
          <p className="text-lg text-secondary-600 mt-4 mb-6">
            Capture, track, and resolve unit damage fast. Villa helps tenants submit clear reports and managers coordinate fixes without the back‑and‑forth.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Link to="/quote">
              <Button size="lg">Get a free quote</Button>
            </Link>
            {user ? (
              <Link to={role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard'}>
                <Button variant="outline" size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/signin">
                <Button variant="outline" size="lg">Sign in</Button>
              </Link>
            )}
          </div>
        </section>

        <section className="max-w-5xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Fast reporting', desc: 'Tenants log damage with photos and details in minutes.' },
            { title: 'Smart triage', desc: 'Auto‑prioritize issues and route to the right vendor.' },
            { title: 'Clear communication', desc: 'Keep everyone in the loop with updates and timelines.' },
            { title: 'Track outcomes', desc: 'See status at a glance and export landlord‑ready summaries.' },
          ].map(card => (
            <Card key={card.title}>
              <h3 className="mb-2">{card.title}</h3>
              <p className="text-sm text-secondary-600">{card.desc}</p>
            </Card>
          ))}
        </section>

        <section className="max-w-4xl mx-auto mt-14">
          <Card padding="lg">
            <h2 className="mb-3">Meet Villa</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              Villa is the modern, friendly way to handle apartment damage and maintenance. Tenants get a clear place to report issues with photos and context. Managers get an organized queue, smart priorities, and effortless vendor coordination. Everyone gets transparency.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {[
                { title: 'For tenants', desc: 'Report problems from your phone and track progress in one place.' },
                { title: 'For managers', desc: 'Stay ahead of issues, assign work quickly, and keep records tidy.' },
                { title: 'For owners', desc: 'Reduce downtime, protect assets, and see clean summaries of work.' },
              ].map(x => (
                <div key={x.title} className="bg-background border border-secondary-100 rounded-lg p-4">
                  <strong className="block mb-2 text-secondary-800">{x.title}</strong>
                  <span className="text-sm text-secondary-600">{x.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="max-w-5xl mx-auto mt-14">
          <h2 className="text-center mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Submit', desc: 'Tenant reports an issue with photos and details in seconds.' },
              { step: '2', title: 'Triage', desc: 'Villa suggests priority and routes to the right team or vendor.' },
              { step: '3', title: 'Resolve', desc: 'Track updates, schedule work, and close the loop with proof.' },
              { step: '4', title: 'Review', desc: 'Export summaries for owners, insurance, or compliance.' },
            ].map(s => (
              <Card key={s.step}>
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-3">{s.step}</div>
                <h3 className="mb-2">{s.title}</h3>
                <p className="text-sm text-secondary-600">{s.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto mt-14">
          <Card padding="lg">
            <h2 className="mb-4">Frequently asked</h2>
            <div className="space-y-4">
              <div>
                <strong className="block mb-2 text-secondary-800">Can Villa replace my current maintenance tool?</strong>
                <p className="text-secondary-600">Yes. Villa covers intake, triage, communication, and tracking, and exports reports you can share with owners or systems.</p>
              </div>
              <div>
                <strong className="block mb-2 text-secondary-800">Do tenants need to install an app?</strong>
                <p className="text-secondary-600">No, they can submit from any device. We keep it simple and fast.</p>
              </div>
              <div>
                <strong className="block mb-2 text-secondary-800">How quickly can we get started?</strong>
                <p className="text-secondary-600">Most teams are up and running in under a day. We'll guide you.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Link to="/quote">
                <Button>Talk to us</Button>
              </Link>
              {user ? (
                <Link to={role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard'}>
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link to="/signin">
                  <Button variant="outline">Sign in</Button>
                </Link>
              )}
            </div>
          </Card>
        </section>
      </main>

      <footer className="px-8 py-6 border-t border-secondary-200 bg-white">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-secondary-500">
          <span>© {new Date().getFullYear()} Villa</span>
          <div className="flex gap-4">
            {user ? (
              <Link
                to={role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard'}
                className="text-primary hover:text-primary-600 transition-smooth"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/signin" className="text-primary hover:text-primary-600 transition-smooth">Tenant/Manager sign in</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
