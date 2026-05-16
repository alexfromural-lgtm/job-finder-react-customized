import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractApiError } from '../utils/apiError';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

type Tab = 'seeker' | 'recruiter';

export default function SignupPage() {
  const { signupJobSeeker, signupRecruiter } = useAuth();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>((params.get('role') as Tab) ?? 'seeker');
  const navigate = useNavigate();

  // Shared fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Recruiter-only fields
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [industry, setIndustry] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (tab === 'recruiter' && !companyName) {
      setError('Company name is required for recruiter accounts.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (tab === 'seeker') {
        await signupJobSeeker({ name, email, password });
      } else {
        await signupRecruiter({
          name,
          email,
          password,
          companyName,
          companyWebsite: companyWebsite || undefined,
          industry: industry || undefined,
        });
      }
      // AuthContext has already populated user state via getMe().
      // Navigate directly to the dashboard.
      navigate(tab === 'seeker' ? '/dashboard/seeker' : '/dashboard/recruiter');
    } catch (err) {
      setError(extractApiError(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="hero-gradient"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <div
        className="glass-strong"
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-card)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
            Create your account
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Join thousands of professionals on JobFinder
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 4,
            marginBottom: '1.5rem',
          }}
        >
          {(['seeker', 'recruiter'] as Tab[]).map((t) => (
            <button
              key={t}
              id={`tab-${t}`}
              type="button"
              onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: 'calc(var(--radius-md) - 4px)',
                background: tab === t ? 'var(--color-primary)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--color-text-muted)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {t === 'seeker' ? '👤 Job Seeker' : '🏢 Recruiter'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <Input
            id="signup-name"
            label="Full Name *"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          <Input
            id="signup-email"
            type="email"
            label="Email Address *"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            id="signup-password"
            type="password"
            label="Password * (min. 6 characters)"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          {/* Recruiter-only fields */}
          {tab === 'recruiter' && (
            <>
              <hr className="divider" style={{ margin: '0.25rem 0' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Company Information
              </p>

              <Input
                id="signup-company"
                label="Company Name *"
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <Input
                id="signup-website"
                type="url"
                label="Company Website"
                placeholder="https://acme.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />

              <Input
                id="signup-industry"
                label="Industry"
                placeholder="e.g. Technology, Finance, Healthcare"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </>
          )}

          <Button
            id="signup-submit"
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {tab === 'seeker' ? 'Start Job Hunting →' : 'Start Hiring →'}
          </Button>
        </form>

        <hr className="divider" />

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
