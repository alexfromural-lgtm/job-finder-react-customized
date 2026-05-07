import { useState } from 'react';
import type { Application, ApplicationStatus } from '../../types';
import { withdrawApplication } from '../../api/applications.api';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface Props {
  applications: Application[];
  loading: boolean;
  onWithdraw: (id: string) => void;
}

const STATUS_COLOR: Record<ApplicationStatus, 'blue' | 'yellow' | 'green' | 'red'> = {
  submitted:    'blue',
  under_review: 'yellow',
  shortlisted:  'green',
  rejected:     'red',
};

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted:    '📨 Submitted',
  under_review: '🔍 Under Review',
  shortlisted:  '⭐ Shortlisted',
  rejected:     '✗ Rejected',
};

export default function ApplicationsList({ applications, loading, onWithdraw }: Props) {
  // Track which row is in "confirm withdraw" mode and which is actively withdrawing
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState('');

  const handleWithdraw = async (id: string) => {
    setWithdrawingId(id);
    setWithdrawError('');
    try {
      await withdrawApplication(id);
      onWithdraw(id);
    } catch {
      setWithdrawError('Failed to withdraw. Please try again.');
    } finally {
      setWithdrawingId(null);
      setConfirmId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div
        className="glass"
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
        <p style={{ margin: 0, fontWeight: 600 }}>No applications yet.</p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
          Browse jobs and hit <strong>Apply Now</strong> to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {withdrawError && (
        <div className="alert alert-error">{withdrawError}</div>
      )}

      {applications.map((app) => (
        <div
          key={app.id}
          className="glass"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            animation: 'slideUp 0.25s ease',
            transition: 'opacity 0.3s ease',
          }}
        >
          {/* Job info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
              {app.job?.title ?? 'Unknown Job'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {app.job?.recruiter?.companyName && (
                <span>🏢 {app.job.recruiter.companyName}</span>
              )}
              {app.job?.location && (
                <span>📍 {app.job.location}</span>
              )}
              {app.job?.salaryRange && (
                <span>💰 {app.job.salaryRange}</span>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div style={{ flexShrink: 0 }}>
            <Badge color={STATUS_COLOR[app.status]}>
              {STATUS_LABEL[app.status]}
            </Badge>
          </div>

          {/* Applied date */}
          <div style={{ flexShrink: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', minWidth: 90, textAlign: 'right' }}>
            {new Date(app.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </div>

          {/* Withdraw action */}
          <div style={{ flexShrink: 0 }}>
            {confirmId === app.id ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Withdraw?</span>
                <Button
                  id={`confirm-withdraw-${app.id}`}
                  variant="primary"
                  size="sm"
                  loading={withdrawingId === app.id}
                  onClick={() => handleWithdraw(app.id)}
                >
                  Yes
                </Button>
                <Button
                  id={`cancel-withdraw-${app.id}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmId(null)}
                  disabled={withdrawingId === app.id}
                >
                  No
                </Button>
              </div>
            ) : (
              <Button
                id={`withdraw-${app.id}`}
                variant="secondary"
                size="sm"
                onClick={() => setConfirmId(app.id)}
              >
                Withdraw
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
