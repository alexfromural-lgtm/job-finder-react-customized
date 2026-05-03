import type { Job } from '../../types';
import JobCard from './JobCard';

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  emptyMessage?: string;
  renderActions?: (job: Job) => React.ReactNode;
}

export default function JobList({
  jobs,
  loading = false,
  emptyMessage = 'No jobs found.',
  renderActions,
}: JobListProps) {
  if (loading) {
    return (
      <div className="spinner-page">
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid-jobs">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          actions={renderActions ? renderActions(job) : undefined}
        />
      ))}
    </div>
  );
}
