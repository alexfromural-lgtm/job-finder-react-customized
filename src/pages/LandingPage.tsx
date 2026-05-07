import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import JobList from '../components/jobs/JobList';
import Pagination from '../components/ui/Pagination';
import type { Job } from '../types';
import * as JobsApi from '../api/jobs.api';
import type { JobsMeta } from '../api/jobs.api';
import Button from '../components/ui/Button';
import { PAGE_SIZES } from '../hooks/usePaginatedJobs';

const DEFAULT_PAGE_SIZE = 10;

export default function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── Filter / pagination state (restored from URL) ──────────────────────────
  const [search, setSearchRaw] = useState(() => searchParams.get('search') ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get('category') ?? '');
  const [page, setPage] = useState(() => Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1));
  const [pageSize, setPageSizeRaw] = useState(() => {
    const ps = parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10);
    return (PAGE_SIZES as readonly number[]).includes(ps) ? ps : DEFAULT_PAGE_SIZE;
  });
  const [scrollMode, setScrollModeRaw] = useState(false);

  // ── API data ───────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<Job[]>([]);
  const [scrollJobs, setScrollJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [meta, setMeta] = useState<JobsMeta>({ total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // ── Debounce search ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ── Reset to page 1 when filters change ───────────────────────────────────
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setPage(1);
    setScrollJobs([]);
  }, [debouncedSearch, categoryFilter, pageSize]);

  // ── Main data fetch — fires every time params change ──────────────────────
  useEffect(() => {
    setLoading(true);
    JobsApi.searchJobs({
      search: debouncedSearch || undefined,
      category: categoryFilter || undefined,
      page,
      pageSize,
    })
      .then(({ jobs: newJobs, meta: newMeta }) => {
        setJobs(newJobs);
        setMeta(newMeta);
        if (scrollMode) {
          setScrollJobs((prev) => (page === 1 ? newJobs : [...prev, ...newJobs]));
        }
        // Populate categories from unfiltered first load
        if (!debouncedSearch && !categoryFilter && page === 1) {
          setCategories(Array.from(new Set(newJobs.map((j) => j.category).filter(Boolean))) as string[]);
        }
      })
      .catch(() => setError('Could not load jobs. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, categoryFilter, page, pageSize]); // scrollMode excluded intentionally

  // ── URL persistence ────────────────────────────────────────────────────────
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (categoryFilter) params.category = categoryFilter;
    if (page > 1) params.page = String(page);
    if (pageSize !== DEFAULT_PAGE_SIZE) params.pageSize = String(pageSize);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, categoryFilter, page, pageSize, setSearchParams]);

  // ── Infinite scroll load-more ──────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (loadingMore || meta.page >= meta.totalPages) return;
    const nextPage = meta.page + 1;
    setLoadingMore(true);
    JobsApi.searchJobs({
      search: debouncedSearch || undefined,
      category: categoryFilter || undefined,
      page: nextPage,
      pageSize,
    })
      .then(({ jobs: newJobs, meta: newMeta }) => {
        setScrollJobs((prev) => [...prev, ...newJobs]);
        setMeta(newMeta);
        setPage(nextPage);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [loadingMore, meta, debouncedSearch, categoryFilter, pageSize]);

  // ── Mode toggle ────────────────────────────────────────────────────────────
  const setScrollMode = useCallback(
    (v: boolean) => {
      setScrollModeRaw(v);
      if (v) setScrollJobs([...jobs]); // seed scroll list with current page
      else { setScrollJobs([]); setPage(1); }
    },
    [jobs],
  );

  const setPageSize = useCallback((n: number) => { setPageSizeRaw(n); }, []);
  const setSearch = useCallback((s: string) => setSearchRaw(s), []);

  const displayJobs = scrollMode ? scrollJobs : jobs;
  const hasMore = meta.page < meta.totalPages;

  return (
    <div className="hero-gradient" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
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
            <Button id="hero-signup-seeker" variant="primary" size="lg" onClick={() => navigate('/signup?role=seeker')}>Get Hired →</Button>
            <Button id="hero-signup-recruiter" variant="secondary" size="lg" onClick={() => navigate('/signup?role=recruiter')}>Post a Job</Button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Active Jobs', value: `${meta.total}+` },
              { label: 'Companies', value: '50+' },
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

      {/* Job Listings */}
      <section style={{ paddingBottom: '4rem' }}>
        <div className="container">
          {/* Filter Bar */}
          <div className="glass" style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                id="job-search"
                className="input"
                placeholder="🔍  Search jobs, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>
            <select
              id="category-filter"
              className="input"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              style={{ width: 'auto', minWidth: 160 }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {(search || categoryFilter) && (
              <Button id="clear-filters" variant="ghost" size="sm" onClick={() => { setSearch(''); setCategoryFilter(''); }}>
                Clear
              </Button>
            )}
          </div>

          {/* Results header */}
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
