import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSavedJobs, unsaveJob } from '../../api/applications.api';
import { extractApiError } from '../../utils/apiError';
import type { SavedJob } from '../../types';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function SavedJobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  usePageTitle('Saved Jobs');

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unsavingId, setUnsavingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getSavedJobs(controller.signal)
      .then(setSavedJobs)
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return;
        setError(extractApiError(err, 'Failed to load saved jobs.'));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleUnsave = async (savedJob: SavedJob) => {
    setUnsavingId(savedJob.jobId);
    try {
      await unsaveJob(savedJob.jobId);
      setSavedJobs((prev) => prev.filter((s) => s.jobId !== savedJob.jobId));
    } catch {
      // silently ignore
    } finally {
      setUnsavingId(null);
    }
  };

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
                🔖 Saved Jobs
              </h1>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {user?.name?.split(' ')[0]}'s bookmarked opportunities
              </p>
            </div>

            {/* Count chip */}
            <div className="glass" style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', minWidth: 72 }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {savedJobs.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>Saved</div>
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

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : savedJobs.length === 0 ? (
          <div
            className="glass"
            style={{
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2rem',
              textAlign: 'center',
              animation: 'slideUp 0.3s ease',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>No saved jobs yet</p>
            <p style={{ color: 'var(--color-text-muted)', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
              Bookmark jobs from the job detail page to keep track of them here.
            </p>
            <Button id="find-jobs-btn" variant="primary" onClick={() => navigate('/')}>
              Find Jobs →
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {savedJobs.map((saved) => (
              <SavedJobCard
                key={saved.jobId}
                saved={saved}
                unsaving={unsavingId === saved.jobId}
                onView={() => navigate(`/jobs/${saved.jobId}`)}
                onUnsave={() => handleUnsave(saved)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

interface SavedJobCardProps {
  saved: SavedJob;
  unsaving: boolean;
  onView: () => void;
  onUnsave: () => void;
}

function SavedJobCard({ saved, unsaving, onView, onUnsave }: SavedJobCardProps) {
  const job = saved.job;

  return (
    <Card hover style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            margin: '0 0 0.4rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: 'var(--color-text)',
            lineHeight: 1.3,
          }}
          onClick={onView}
        >
          {job?.title ?? 'Job Listing'}
        </h3>

        {job?.recruiter?.companyName && (
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            🏢 {job.recruiter.companyName}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {job?.location && <Badge color="teal">📍 {job.location}</Badge>}
          {job?.category && <Badge color="purple">{job.category}</Badge>}
          {job?.salaryRange && <Badge color="green">💰 {job.salaryRange}</Badge>}
          {job && !job.isActive && <Badge color="red">Closed</Badge>}
        </div>

        <p style={{ margin: '0.4rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Saved {new Date(saved.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <Button id={`view-saved-${saved.jobId}`} variant="secondary" size="sm" onClick={onView}>
          View →
        </Button>
        <Button
          id={`unsave-${saved.jobId}`}
          variant="ghost"
          size="sm"
          loading={unsaving}
          onClick={onUnsave}
          style={{ color: 'var(--color-text-muted)' }}
        >
          {unsaving ? '' : '✕ Unsave'}
        </Button>
      </div>
    </Card>
  );
}
