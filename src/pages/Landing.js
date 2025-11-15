import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import {
  Building2,
  Zap,
  Target,
  MessageSquare,
  BarChart3,
  Camera,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  Home
} from 'lucide-react';

export default function LandingPage() {
  const { user, role } = useAuth();

  useEffect(() => {
    document.title = 'Villa - Modern Apartment Maintenance Management';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-background to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
                <Building2 size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">Villa</span>
            </div>
            <nav className="flex items-center gap-3">
              {user ? (
                <Link to={role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard'}>
                  <Button variant="ghost-secondary" size="sm">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/signin">
                  <Button variant="ghost-secondary" size="sm">
                    Sign in
                  </Button>
                </Link>
              )}
              <Link to="/quote">
                {/* <Button size="sm" leftIcon={<Sparkles />}> */}
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8 animate-fade-in-down">
            {/* <Sparkles size={16} /> */}
            <span>Modern maintenance management</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-secondary-900 mb-6 animate-fade-in-up tracking-tight">
            Apartment maintenance,
            <span className="block bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              beautifully simple
            </span>
          </h1>

          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Capture, track, and resolve apartment damage reports with clarity. Villa connects tenants and managers through streamlined workflows that save time and reduce friction.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <Link to="/quote">
              <Button size="lg" leftIcon={<ArrowRight />}>
                Request a Demo
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline-secondary" size="lg">
                Learn More
              </Button>
            </a>
          </div>

          {/* Social Proof */}
          {/* <div className="mt-16 pt-8 border-t border-secondary-200 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <p className="text-sm text-secondary-500 mb-6">Trusted by property managers nationwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2 text-secondary-400">
                  <Building2 size={20} />
                  <span className="text-sm font-semibold">Property Group {i}</span>
                </div>
              ))}
            </div>
          </div> */}
        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Everything you need to manage maintenance
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Built for modern property management teams who value clarity and efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Camera />,
                title: 'Visual Reports',
                desc: 'Tenants capture damage with photos and context in seconds',
                color: 'from-primary-500 to-primary-600'
              },
              {
                icon: <Target />,
                title: 'Smart Triage',
                desc: 'Auto-prioritize issues and route to the right team instantly',
                color: 'from-accent-500 to-accent-600'
              },
              {
                icon: <MessageSquare />,
                title: 'Real-time Updates',
                desc: 'Keep everyone informed with automatic status notifications',
                color: 'from-success-500 to-success-600'
              },
              {
                icon: <BarChart3 />,
                title: 'Clear Insights',
                desc: 'Track metrics and export reports for owners and stakeholders',
                color: 'from-warning-500 to-warning-600'
              },
            ].map((feature, index) => (
              <Card
                key={feature.title}
                interactive
                variant="elevated"
                className="group animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {React.cloneElement(feature.icon, { size: 24 })}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary-600 leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* For Everyone Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl my-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Built for every stakeholder
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Villa delivers value across your entire property management ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Home />,
                title: 'For Tenants',
                desc: 'Report issues from any device with photos and context. Track progress in real-time.',
                features: ['Mobile-friendly', 'Photo upload', 'Status tracking']
              },
              {
                icon: <Shield />,
                title: 'For Managers',
                desc: 'Triage requests efficiently with smart prioritization and vendor coordination.',
                features: ['Smart routing', 'Team collaboration', 'Analytics dashboard']
              },
              {
                icon: <Users />,
                title: 'For Owners',
                desc: 'Protect your assets and maintain property value with comprehensive insights.',
                features: ['Detailed reports', 'Cost tracking', 'Compliance ready']
              },
            ].map((segment, index) => (
              <Card
                key={segment.title}
                variant="elevated"
                padding="lg"
                className="bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white mb-5">
                  {React.cloneElement(segment.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">
                  {segment.title}
                </h3>
                <p className="text-secondary-600 mb-4 leading-relaxed">
                  {segment.desc}
                </p>
                <ul className="space-y-2">
                  {segment.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-secondary-700">
                      <CheckCircle2 size={16} className="text-success-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Simple workflow, powerful results
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              From submission to resolution in four streamlined steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: <Camera />,
                title: 'Submit',
                desc: 'Tenant captures damage with photos and details in under a minute'
              },
              {
                step: '02',
                icon: <Zap />,
                title: 'Triage',
                desc: 'Smart prioritization routes the request to the right team instantly'
              },
              {
                step: '03',
                icon: <Clock />,
                title: 'Resolve',
                desc: 'Track progress, coordinate vendors, and update stakeholders in real-time'
              },
              {
                step: '04',
                icon: <CheckCircle2 />,
                title: 'Review',
                desc: 'Export comprehensive reports for owners, insurance, and compliance'
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-accent-200"></div>
                )}
                <Card variant="elevated" padding="lg" className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xl font-bold mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-primary-600">
                    {React.cloneElement(item.icon, { size: 28 })}
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary-600 leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Common questions
            </h2>
            <p className="text-lg text-secondary-600">
              Everything you need to know about Villa
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Can Villa replace our current maintenance system?',
                a: 'Yes. Villa provides comprehensive intake, triage, communication, and tracking capabilities. We also offer data export and API access for integration with existing systems.'
              },
              {
                q: 'Do tenants need to install a mobile app?',
                a: 'No. Villa works seamlessly in any web browser on desktop, tablet, or mobile. Tenants can submit reports instantly without downloads or installations.'
              },
              {
                q: 'How quickly can we get started?',
                a: 'Most property management teams are fully operational within 24 hours. Our onboarding process is streamlined, and our team provides personalized support to ensure a smooth transition.'
              },
              {
                q: 'What about data security and privacy?',
                a: 'Villa uses enterprise-grade encryption and complies with industry security standards. All data is encrypted in transit and at rest. We never sell or share your data with third parties.'
              },
            ].map((faq, index) => (
              <Card
                key={index}
                variant="outline"
                padding="lg"
                className="hover:border-primary-200 transition-colors"
              >
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  {faq.q}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 py-20">
          <Card
            variant="elevated"
            padding="xl"
            className="bg-gradient-to-br from-primary-600 to-accent-600 text-white text-center border-none shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to simplify maintenance?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join property managers who are transforming maintenance operations with Villa
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/quote">
                <Button
                  size="lg"
                  variant="secondary"
                  leftIcon={<ArrowRight />}
                  className="bg-white text-primary-700 hover:bg-white/90"
                >
                  Request a Demo
                </Button>
              </Link>
              {user ? (
                <Link to={role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard'}>
                  <Button
                    size="lg"
                    variant="outline-secondary"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/signin">
                  <Button
                    size="lg"
                    variant="outline-secondary"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
                  <Building2 size={24} className="text-white" />
                </div>
                <span className="text-xl font-bold text-secondary-900">Villa</span>
              </div>
              <p className="text-secondary-600 mb-4 max-w-md">
                Modern apartment maintenance management that brings clarity and efficiency to property operations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-secondary-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-secondary-600 hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/quote" className="text-secondary-600 hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-secondary-900 mb-4">Access</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/signin" className="text-secondary-600 hover:text-primary transition-colors">
                    Sign In
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link
                      to={role === 'manager' ? '/manager/dashboard' : '/tenant/dashboard'}
                      className="text-secondary-600 hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-secondary-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-500">
              © {new Date().getFullYear()} Villa. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-secondary-500">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
