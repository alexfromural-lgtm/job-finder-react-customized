import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as JobsApi from '../../api/jobs.api';
import type { Job } from '../../types';
import JobList from '../../components/jobs/JobList';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import { usePaginatedJobs } from '../../hooks/usePaginatedJobs';

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    JobsApi.getAllJobs(controller.signal)
      .then(setJobs)
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return;
        setError('Failed to load jobs.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const {
    search,
    currentPage, pageSize, totalPages, scrollMode,
    filteredJobs, pageItems, hasMore, loadingMore,
    setSearch,
    goToPage, setPageSize, setScrollMode, loadMore,
  } = usePaginatedJobs({ allJobs: jobs, defaultPageSize: 10 });

  return (
    <div className="page hero-gradient">
      <div className="container">
        {/* Welcome header */}
        <div
          className="glass-strong"
          style={{
            borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '1rem', animation: 'slideUp 0.3s ease',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800 }}>
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Browse the latest opportunities and find your perfect role.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div className="glass" style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {jobs.filter((j) => j.isActive).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Open Jobs</div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="glass"
          style={{
            display: 'flex', gap: '1rem', padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', alignItems: 'center',
          }}
        >
          <input
            id="seeker-job-search"
            className="input"
            placeholder="🔍  Search jobs or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          {search && (
            <Button id="seeker-clear-search" variant="ghost" size="sm" onClick={() => setSearch('')}>
              Clear
            </Button>
          )}
        </div>

        {/* Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
            {loading ? 'Loading jobs…' : `${filteredJobs.length} Available Job${filteredJobs.length !== 1 ? 's' : ''}`}
          </h2>
          <Button id="browse-all-btn" variant="ghost" size="sm" onClick={() => navigate('/')}>
            Browse All →
          </Button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <JobList
          jobs={pageItems}
          loading={loading}
          emptyMessage="No jobs match your search."
          onLoadMore={scrollMode ? loadMore : undefined}
          loadingMore={loadingMore}
        />

        {!loading && filteredJobs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            scrollMode={scrollMode}
            totalItems={filteredJobs.length}
            hasMore={hasMore}
            onPageChange={goToPage}
            onPageSizeChange={setPageSize}
            onScrollModeToggle={setScrollMode}
          />
        )}
      </div>
    </div>
  );
}
