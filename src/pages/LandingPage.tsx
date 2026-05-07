import { useNavigate } from 'react-router-dom';
import JobList from '../components/jobs/JobList';
import JobFilterBar from '../components/jobs/JobFilterBar';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import { useJobSearch } from '../hooks/useJobSearch';

export default function LandingPage() {
  const navigate = useNavigate();

  const {
    search, categoryFilter, page, pageSize, scrollMode,
    categories, meta, displayJobs, hasMore,
    loading, loadingMore, error,
    setSearch, setCategoryFilter, setPage, setPageSize, setScrollMode, loadMore,
  } = useJobSearch();

  return (
    <div className="hero-gradient" style={{ minHeight: '100vh' }}>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>

          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'rgba(79, 142, 247, 0.1)', border: '1px solid rgba(79, 142, 247, 0.25)',
              borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
              color: 'var(--color-primary)', marginBottom: '2rem',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            ⚡ Your career starts here
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 auto 1.25rem', maxWidth: 780 }}>
            Find the Job That{' '}<span className="gradient-text">Ignites</span>{' '}Your Career
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Discover thousands of opportunities from top companies. Connect with recruiters and land your dream role — faster.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button id="hero-signup-seeker" variant="primary" size="lg" onClick={() => navigate('/signup?role=seeker')}>
              Get Hired →
            </Button>
            <Button id="hero-signup-recruiter" variant="secondary" size="lg" onClick={() => navigate('/signup?role=recruiter')}>
              Post a Job
            </Button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Active Jobs', value: `${meta.total}+` },
              { label: 'Companies',   value: '50+' },
              { label: 'Hired This Month', value: '200+' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Job Listings ──────────────────────────────────────────────────── */}
      <section style={{ paddingBottom: '4rem' }}>
        <div className="container">

          <JobFilterBar
            search={search}
            categoryFilter={categoryFilter}
            categories={categories}
            onSearchChange={setSearch}
            onCategoryChange={(c) => { setCategoryFilter(c); setPage(1); }}
            onClear={() => { setSearch(''); setCategoryFilter(''); }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
              {loading ? 'Loading jobs…' : `${meta.total} Job${meta.total !== 1 ? 's' : ''} Found`}
            </h2>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

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
      </section>
    </div>
  );
}
