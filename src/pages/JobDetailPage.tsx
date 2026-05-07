import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Job } from '../types';
import * as JobsApi from '../api/jobs.api';
import { getMyApplications } from '../api/applications.api';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ApplyModal from '../components/jobs/ApplyModal';
import { useAuth } from '../context/AuthContext';

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
        {title}
      </h3>
      <p style={{ margin: 0, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--color-text)' }}>
        {content}
      </p>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply state
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    JobsApi.getJobById(id, controller.signal)
      .then(setJob)
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return;
        setError('Job not found or unavailable.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  // Check if already applied (only for jobseekers)
  useEffect(() => {
    if (!id || !isAuthenticated || !hasRole('JOB_SEEKER')) return;
    setCheckingApplication(true);
    getMyApplications()
      .then((apps) => {
        const existing = apps.find((a) => a.jobId === id);
        if (existing) setApplicationId(existing.id);
      })
      .catch(() => { /* non-critical — silently ignore */ })
      .finally(() => setCheckingApplication(false));
  }, [id, isAuthenticated, hasRole]);

  const handleApplySuccess = useCallback((newApplicationId: string) => {
    setApplicationId(newApplicationId);
    setShowModal(false);
  }, []);

  if (loading) {
    return (
      <div className="spinner-page page">
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-error">{error || 'Job not found.'}</div>
          <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>
            ← Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Determine CTA content
  const renderCTA = () => {
    if (!isAuthenticated) {
      return (
        <Button id="apply-login-prompt" variant="primary" size="lg" onClick={() => navigate('/login')}>
          Login to Apply
        </Button>
      );
    }
    if (!hasRole('JOB_SEEKER')) return null;
    if (checkingApplication) {
      return (
        <Button id="apply-btn" variant="primary" size="lg" disabled>
          <span className="spinner" style={{ width: 16, height: 16, display: 'inline-block', marginRight: '0.5rem' }} />
          Checking…
        </Button>
      );
    }
    if (applicationId) {
      return (
        <Button
          id="applied-badge"
          variant="primary"
          size="lg"
          disabled
          style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', cursor: 'default', opacity: 1 }}
        >
          ✓ Applied
        </Button>
      );
    }
    return (
      <Button id="apply-btn" variant="primary" size="lg" onClick={() => setShowModal(true)}>
        Apply Now →
      </Button>
    );
  };

  return (
    <>
      <div className="page hero-gradient">
        <div className="container" style={{ maxWidth: 820 }}>
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              padding: 0,
              fontFamily: 'Inter, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            ← Back to Jobs
          </button>

          {/* Header card */}
          <div
            className="glass-strong"
            style={{
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              marginBottom: '1.5rem',
              animation: 'slideUp 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.7rem', fontWeight: 800, lineHeight: 1.2 }}>
                  {job.title}
                </h1>
                {job.recruiter?.companyName && (
                  <p style={{ margin: '0 0 1rem', color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '1rem' }}>
                    🏢 {job.recruiter.companyName}
                    {job.recruiter.industry && ` · ${job.recruiter.industry}`}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <Badge color="teal">📍 {job.location}</Badge>
                  {job.category && <Badge color="purple">{job.category}</Badge>}
                  {job.salaryRange && <Badge color="green">💰 {job.salaryRange}</Badge>}
                  <Badge color={job.isActive ? 'blue' : 'red'}>
                    {job.isActive ? '● Active' : '● Closed'}
                  </Badge>
                </div>
              </div>

              {/* CTA */}
              <div style={{ flexShrink: 0 }}>{renderCTA()}</div>
            </div>
          </div>

          {/* Content */}
          <div
            className="glass"
            style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <Section title="📋 About This Role" content={job.description} />
            <hr className="divider" />
            <Section title="✅ Requirements" content={job.requirements} />

            {job.recruiter?.companyWebsite && (
              <>
                <hr className="divider" />
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    🔗 Company Website
                  </h3>
                  <a
                    href={job.recruiter.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--color-primary)', fontWeight: 500 }}
                  >
                    {job.recruiter.companyWebsite}
                  </a>
                </div>
              </>
            )}

            <hr className="divider" />
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Posted on {new Date(job.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Apply Modal (rendered outside page div for proper z-index stacking) */}
      {showModal && job && (
        <ApplyModal
          jobId={job.id}
          jobTitle={job.title}
          companyName={job.recruiter?.companyName}
          onSuccess={handleApplySuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
