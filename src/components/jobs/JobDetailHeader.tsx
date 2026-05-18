import type { Job } from '../../types';
import Badge from '../ui/Badge';
import JobDetailCTA from './JobDetailCTA';

interface JobDetailHeaderProps {
  job: Job;
  isAuthenticated: boolean;
  isJobSeeker: boolean;
  checkingApplication: boolean;
  applicationId: string | null;
  isSaved: boolean;
  savingJob: boolean;
  saveError: string;
  onApplyClick: () => void;
  onSaveClick: () => void;
}

export default function JobDetailHeader({
  job,
  isAuthenticated,
  isJobSeeker,
  checkingApplication,
  applicationId,
  isSaved,
  savingJob,
  saveError,
  onApplyClick,
  onSaveClick,
}: JobDetailHeaderProps) {
  return (
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

        <div style={{ flexShrink: 0 }}>
          <JobDetailCTA
            isAuthenticated={isAuthenticated}
            isJobSeeker={isJobSeeker}
            checkingApplication={checkingApplication}
            applicationId={applicationId}
            isSaved={isSaved}
            savingJob={savingJob}
            onApplyClick={onApplyClick}
            onSaveClick={onSaveClick}
          />
          {saveError && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-error, #f87171)', textAlign: 'right', maxWidth: 220 }}>
              ⚠ {saveError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

