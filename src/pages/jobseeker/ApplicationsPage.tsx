import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../api/applications.api';
import { extractApiError } from '../../utils/apiError';
import type { Application } from '../../types';
import ApplicationsList from '../../components/jobs/ApplicationsList';
import Button from '../../components/ui/Button';

export default function ApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getMyApplications(controller.signal)
      .then(setApplications)
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return;
        setError(extractApiError(err, 'Failed to load your applications.'));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleWithdraw = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const submitted   = applications.filter((a) => a.status === 'submitted').length;
  const shortlisted = applications.filter((a) => a.status === 'shortlisted').length;
  const underReview = applications.filter((a) => a.status === 'under_review').length;

  return (
    <div className="page hero-gradient">
      <div className="container">
        {/* Header */}
        <div
          className="glass-strong"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '2rem',
            animation: 'slideUp 0.3s ease',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800 }}>
                My Applications
              </h1>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {user?.name?.split(' ')[0]}'s job applications
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Stat label="Total" value={applications.length} color="var(--color-primary)" />
              <Stat label="Submitted" value={submitted} color="var(--color-primary)" />
              <Stat label="In Review" value={underReview} color="#f59e0b" />
              <Stat label="Shortlisted" value={shortlisted} color="#22c55e" />
            </div>
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Button
              id="back-to-dashboard-btn"
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/seeker')}
            >
              ← Back to Dashboard
            </Button>
            <Button
              id="browse-jobs-btn"
              variant="primary"
              size="sm"
              onClick={() => navigate('/')}
            >
              Browse Jobs →
            </Button>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <ApplicationsList
          applications={applications}
          loading={loading}
          onWithdraw={handleWithdraw}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="glass"
      style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: 72 }}
    >
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{label}</div>
    </div>
  );
}
