import { useState, useRef, useEffect } from 'react';
import { applyToJob } from '../../api/applications.api';
import Button from '../ui/Button';

interface Props {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  onSuccess: (applicationId: string) => void;
  onClose: () => void;
}

export default function ApplyModal({ jobId, jobTitle, companyName, onSuccess, onClose }: Props) {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea on open
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [loading, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const application = await applyToJob(jobId, coverLetter.trim() || undefined);
      setSuccessMsg('🎉 Application submitted!');
      setTimeout(() => onSuccess(application.id), 1200);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
      if (axiosErr?.response?.status === 409) {
        setErrorMsg('You have already applied to this job.');
      } else {
        setErrorMsg(axiosErr?.response?.data?.error ?? 'Something went wrong. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      id="apply-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Modal panel */}
      <div
        id="apply-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        className="glass-strong"
        style={{
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2
              id="apply-modal-title"
              style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', fontWeight: 800 }}
            >
              Apply for Position
            </h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {jobTitle}{companyName ? ` · ${companyName}` : ''}
            </p>
          </div>
          <button
            id="apply-modal-close"
            aria-label="Close dialog"
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.4rem',
              lineHeight: 1,
              padding: '0.25rem',
              opacity: loading ? 0.4 : 1,
              fontFamily: 'inherit',
            }}
          >
            ✕
          </button>
        </div>

        {/* Success state */}
        {successMsg ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--color-success, #22c55e)',
              fontSize: '1.1rem',
              fontWeight: 700,
            }}
          >
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="cover-letter-input"
              style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}
            >
              Cover Letter <span style={{ fontWeight: 400, opacity: 0.7 }}>(optional)</span>
            </label>
            <textarea
              id="cover-letter-input"
              ref={textareaRef}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the recruiter why you're a great fit for this role…"
              disabled={loading}
              rows={6}
              className="input"
              style={{
                width: '100%',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />

            {errorMsg && (
              <div className="alert alert-error" style={{ marginTop: '0.75rem' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <Button
                id="apply-modal-cancel"
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                id="apply-modal-submit"
                type="submit"
                variant="primary"
                loading={loading}
              >
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
