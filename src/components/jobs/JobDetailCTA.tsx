import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

interface JobDetailCTAProps {
  isAuthenticated: boolean;
  isJobSeeker: boolean;
  checkingApplication: boolean;
  applicationId: string | null;
  isSaved: boolean;
  savingJob: boolean;
  onApplyClick: () => void;
  onSaveClick: () => void;
}

export default function JobDetailCTA({
  isAuthenticated,
  isJobSeeker,
  checkingApplication,
  applicationId,
  isSaved,
  savingJob,
  onApplyClick,
  onSaveClick,
}: JobDetailCTAProps) {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Button id="apply-login-prompt" variant="primary" size="lg" onClick={() => navigate('/login')}>
        Login to Apply
      </Button>
    );
  }

  if (!isJobSeeker) return null;

  if (checkingApplication) {
    return (
      <Button id="apply-btn" variant="primary" size="lg" disabled>
        <span className="spinner" style={{ width: 16, height: 16, display: 'inline-block', marginRight: '0.5rem' }} />
        Checking…
      </Button>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Save / Unsave */}
      <button
        id="save-job-btn"
        onClick={onSaveClick}
        disabled={savingJob}
        title={isSaved ? 'Unsave job' : 'Save job'}
        aria-label={isSaved ? 'Unsave job' : 'Save job'}
        style={{
          border: isSaved
            ? '2px solid var(--color-primary)'
            : '2px dashed rgba(255,255,255,0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '0.55rem 0.8rem',
          cursor: savingJob ? 'not-allowed' : 'pointer',
          color: isSaved ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
          fontSize: '1.3rem',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          transition: 'all 0.2s ease',
          opacity: savingJob ? 0.6 : 1,
          background: isSaved ? 'rgba(99,102,241,0.12)' : 'transparent',
        } as React.CSSProperties}
      >
        {savingJob ? (
          <span className="spinner" style={{ width: 16, height: 16 }} />
        ) : isSaved ? (
          /* Filled bookmark — saved */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3C5 2.44772 5.44772 2 6 2H18C18.5523 2 19 2.44772 19 3V21.382C19 21.7607 18.786 22.107 18.4472 22.2764C18.1085 22.4458 17.7049 22.4124 17.4 22.2L12 18.3333L6.6 22.2C6.29511 22.4124 5.89151 22.4458 5.55279 22.2764C5.21407 22.107 5 21.7607 5 21.382V3Z"/>
          </svg>
        ) : (
          /* Outline bookmark — unsaved */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"/>
          </svg>
        )}
      </button>

      {/* Apply */}
      {applicationId ? (
        <Button
          id="applied-badge"
          variant="primary"
          size="lg"
          disabled
          style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', cursor: 'default', opacity: 1 }}
        >
          ✓ Applied
        </Button>
      ) : (
        <Button id="apply-btn" variant="primary" size="lg" onClick={onApplyClick}>
          Apply Now →
        </Button>
      )}
    </div>
  );
}
