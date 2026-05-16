import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as JobsApi from '../../api/jobs.api';
import type { Job, JobFormData } from '../../types';
import JobCard from '../../components/jobs/JobCard';
import JobForm from '../../components/jobs/JobForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { extractApiError } from '../../utils/apiError';
import { usePageTitle } from '../../hooks/usePageTitle';


export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  usePageTitle('My Job Postings');

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJobs = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await JobsApi.getRecruiterJobs(signal);
      setJobs(data);
    } catch (err: unknown) {
      if ((err as { code?: string })?.code === 'ERR_CANCELED') return;
      setError(extractApiError(err, 'Failed to load your job postings.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchJobs(controller.signal);
    return () => controller.abort();
  }, [fetchJobs]);

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreate = async (data: JobFormData) => {
    await JobsApi.createJob(data);
    setCreateOpen(false);
    flash('Job posting created successfully! 🎉');
    await fetchJobs();
  };

  const handleEdit = async (data: JobFormData) => {
    if (!editJob) return;
    await JobsApi.updateJob(editJob.id, data);
    setEditJob(null);
    flash('Job updated successfully!');
    await fetchJobs();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await JobsApi.deleteJob(deleteTarget.id);
      setDeleteTarget(null);
      flash('Job deleted.');
      await fetchJobs();
    } catch (err) {
      setError(extractApiError(err, 'Failed to delete job.'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeJobs = jobs.filter((j) => j.isActive);

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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            animation: 'slideUp 0.3s ease',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800 }}>
              My Job Postings
            </h1>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Welcome back, {user?.name?.split(' ')[0]}. Manage your listings, find the right candidate.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Stats */}
            {[
              { label: 'Total', value: jobs.length, color: 'var(--color-primary)' },
              { label: 'Active', value: activeJobs.length, color: 'var(--color-success)' },
            ].map((s) => (
              <div
                key={s.label}
                className="glass"
                style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.label}</div>
              </div>
            ))}
            <Button
              id="create-job-btn"
              variant="primary"
              size="lg"
              onClick={() => setCreateOpen(true)}
            >
              + Post New Job
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>{successMsg}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

        {/* Job list */}
        {loading ? (
          <div className="spinner-page"><div className="spinner" style={{ width: 36, height: 36 }} /></div>
        ) : jobs.length === 0 ? (
          <div
            className="glass"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📭</div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>No job postings yet</h3>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-muted)' }}>
              Create your first job posting to start finding candidates.
            </p>
            <Button id="empty-create-btn" variant="primary" onClick={() => setCreateOpen(true)}>
              Post Your First Job
            </Button>
          </div>
        ) : (
          <div className="grid-jobs">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                actions={
                  <>
                    <Button
                      id={`edit-job-${job.id}`}
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditJob(job)}
                    >
                      Edit
                    </Button>
                    <Button
                      id={`delete-job-${job.id}`}
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTarget(job)}
                    >
                      Delete
                    </Button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Job Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="✨ Post New Job">
        <JobForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} submitLabel="Post Job" />
      </Modal>

      {/* Edit Job Modal */}
      <Modal isOpen={!!editJob} onClose={() => setEditJob(null)} title="✏️ Edit Job Posting">
        {editJob && (
          <JobForm
            initial={editJob}
            onSubmit={handleEdit}
            onCancel={() => setEditJob(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Job Posting" maxWidth="400px">
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--color-text)' }}>"{deleteTarget?.title}"</strong>?
          This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            id="confirm-delete-btn"
            variant="danger"
            loading={deleteLoading}
            onClick={handleDelete}
          >
            Delete Job
          </Button>
        </div>
      </Modal>
    </div>
  );
}
