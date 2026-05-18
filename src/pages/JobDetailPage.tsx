import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Job } from '../types';
import * as JobsApi from '../api/jobs.api';
import { getMyApplications, getSavedJobs, saveJob, unsaveJob } from '../api/applications.api';
import { pollUntilDone } from '../api/queue.api';
import Button from '../components/ui/Button';
import ApplyModal from '../components/jobs/ApplyModal';
import JobDetailHeader from '../components/jobs/JobDetailHeader';
import JobDetailBody from '../components/jobs/JobDetailBody';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading, hasRole } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply state
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Save state
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [saveError, setSaveError] = useState('');
  const saveAbortRef = useRef<AbortController | null>(null);

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

  // Check if already applied & already saved (only for jobseekers)
  useEffect(() => {
    if (!id || !isAuthenticated || !hasRole('JOB_SEEKER')) return;
    const controller = new AbortController();

    setCheckingApplication(true);
    Promise.all([
      getMyApplications(controller.signal),
      getSavedJobs(controller.signal),
    ])
      .then(([apps, saved]) => {
        const existing = apps.find((a) => a.jobId === id);
        if (existing) setApplicationId(existing.id);
        setIsSaved(saved.some((s) => s.jobId === id));
      })
      .catch(() => { /* non-critical — silently ignore */ })
      .finally(() => setCheckingApplication(false));

    return () => controller.abort();
  }, [id, isAuthenticated, hasRole]);

  // Cleanup any in-flight save poll on unmount
  useEffect(() => {
    return () => { saveAbortRef.current?.abort(); };
  }, []);

  const handleApplySuccess = useCallback((newApplicationId: string) => {
    setApplicationId(newApplicationId);
    setShowModal(false);
  }, []);

  const handleSaveToggle = useCallback(async () => {
    if (!id || savingJob) return;
    setSaveError('');

    if (isSaved) {
      // Unsave is synchronous DELETE
      setSavingJob(true);
      try {
        await unsaveJob(id);
        setIsSaved(false);
      } catch {
        setSaveError('Failed to unsave. Please try again.');
      } finally {
        setSavingJob(false);
      }
    } else {
      // Save is queued — enqueue then poll
      setSavingJob(true);
      try {
        const { queueJobId } = await saveJob(id);
        const controller = new AbortController();
        saveAbortRef.current = controller;
        await pollUntilDone(queueJobId, 600, 15_000, controller.signal);
        saveAbortRef.current = null;
        setIsSaved(true);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const msg = err instanceof Error ? err.message : 'Failed to save job. Please try again.';
        setSaveError(msg);
      } finally {
        setSavingJob(false);
      }
    }
  }, [id, isSaved, savingJob]);

  if (loading || isAuthLoading) {
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

          <JobDetailHeader
            job={job}
            isAuthenticated={isAuthenticated}
            isJobSeeker={hasRole('JOB_SEEKER')}
            checkingApplication={checkingApplication}
            applicationId={applicationId}
            isSaved={isSaved}
            savingJob={savingJob}
            saveError={saveError}
            onApplyClick={() => setShowModal(true)}
            onSaveClick={handleSaveToggle}
          />

          <JobDetailBody job={job} />
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

