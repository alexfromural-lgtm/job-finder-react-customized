import { useEffect, useRef } from 'react';
import type { Job } from '../../types';
import JobCard from './JobCard';

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  emptyMessage?: string;
  renderActions?: (job: Job) => React.ReactNode;
  /** Provide to enable infinite-scroll sentinel */
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

export default function JobList({
  jobs,
  loading = false,
  emptyMessage = 'No jobs found.',
  renderActions,
  onLoadMore,
  loadingMore = false,
}: JobListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Keep callback in a ref so the observer doesn't need to re-register on every render
  const callbackRef = useRef(onLoadMore);
  useEffect(() => { callbackRef.current = onLoadMore; }, [onLoadMore]);

  // Attach IntersectionObserver only when onLoadMore is provided
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!onLoadMore || !sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) callbackRef.current?.(); },
      { rootMargin: '300px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!onLoadMore]); // re-attach only when presence of prop changes

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
    <>
      <div className="grid-jobs">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} actions={renderActions ? renderActions(job) : undefined} />
        ))}
      </div>

      {/* Sentinel triggers loadMore when scrolled into view */}
      {onLoadMore && <div ref={sentinelRef} style={{ height: 1 }} />}

      {loadingMore && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="spinner" style={{ width: 24, height: 24 }} />
        </div>
      )}
    </>
  );
}
