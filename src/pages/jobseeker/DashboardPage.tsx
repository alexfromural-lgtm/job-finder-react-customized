import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import JobList from '../../components/jobs/JobList';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import { useJobSearch } from '../../hooks/useJobSearch';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  usePageTitle('Dashboard');

  const {
    search, categoryFilter, page, pageSize, scrollMode,
    categories, meta, displayJobs, hasMore,
    loading, loadingMore, error,
    setSearch, setCategoryFilter, setPage, setPageSize, setScrollMode, loadMore,
  } = useJobSearch();

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
                {meta.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Open Jobs</div>
            </div>
          </div>
        </div>

        {/* Search + filter bar */}
        <div
          className="glass"
          style={{
            display: 'flex', gap: '1rem', padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem',
            alignItems: 'center', flexWrap: 'wrap',
          }}
        >
          <input
            id="seeker-job-search"
            className="input"
            placeholder="🔍  Search jobs, skills, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          {categories.length > 0 && (
            <select
              id="seeker-category-filter"
              className="input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ maxWidth: 200 }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
          {(search || categoryFilter) && (
            <Button
              id="seeker-clear-filters"
              variant="ghost"
              size="sm"
              onClick={() => { setSearch(''); setCategoryFilter(''); }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
            {loading ? 'Loading jobs…' : `${meta.total} Available Job${meta.total !== 1 ? 's' : ''}`}
          </h2>
          <Button id="browse-all-btn" variant="ghost" size="sm" onClick={() => navigate('/')}>
            Browse All →
          </Button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <JobList
          jobs={displayJobs}
          loading={loading}
          emptyMessage="No jobs match your search."
          onLoadMore={scrollMode ? loadMore : undefined}
          loadingMore={loadingMore}
        />

        {!loading && meta.total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            pageSize={pageSize}
            scrollMode={scrollMode}
            totalItems={meta.total}
            hasMore={hasMore}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onScrollModeToggle={setScrollMode}
          />
        )}
      </div>
    </div>
  );
}
