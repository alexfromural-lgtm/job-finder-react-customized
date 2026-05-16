import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractApiError } from '../utils/apiError';
import { usePageTitle } from '../hooks/usePageTitle';
import { Input } from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, hasRole } = useAuth();
  const navigate = useNavigate();
  usePageTitle('Sign In');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // Redirect to the role-specific dashboard
      if (hasRole('RECRUITER')) {
        navigate('/dashboard/recruiter');
      } else if (hasRole('JOB_SEEKER')) {
        navigate('/dashboard/seeker');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(extractApiError(err, 'Invalid email or password.'));
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
          maxWidth: 420,
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-card)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
            }}
          >
            ⚡
          </div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
            Welcome back
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Sign in to your JobFinder account
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

          <Input
            id="login-email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />

          <Input
            id="login-password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Button
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Sign In
          </Button>
        </form>

        <hr className="divider" />

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
