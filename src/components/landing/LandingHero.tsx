import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

interface LandingHeroProps {
  totalJobs: number;
}

export default function LandingHero({ totalJobs }: LandingHeroProps) {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Jobs',      value: `${totalJobs}+` },
    { label: 'Companies',        value: '50+' },
    { label: 'Hired This Month', value: '200+' },
  ];

  return (
    <section style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ textAlign: 'center' }}>

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(79, 142, 247, 0.1)', border: '1px solid rgba(79, 142, 247, 0.25)',
            borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
            color: 'var(--color-primary)', marginBottom: '2rem',
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          ⚡ Your career starts here
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 auto 1.25rem', maxWidth: 780 }}>
          Find the Job That{' '}<span className="gradient-text">Ignites</span>{' '}Your Career
        </h1>

        {/* Sub-text */}
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Discover thousands of opportunities from top companies. Connect with recruiters and land your dream role — faster.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button id="hero-signup-seeker" variant="primary" size="lg" onClick={() => navigate('/signup?role=seeker')}>
            Get Hired →
          </Button>
          <Button id="hero-signup-recruiter" variant="secondary" size="lg" onClick={() => navigate('/signup?role=recruiter')}>
            Post a Job
          </Button>
        </div>

        {/* Stats Strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
