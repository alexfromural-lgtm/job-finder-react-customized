import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Job } from '../types';
import * as JobsApi from '../api/jobs.api';
import type { JobsMeta } from '../api/jobs.api';
import { PAGE_SIZES } from './usePagination';
import { useDebounce } from './useDebounce';

const DEFAULT_PAGE_SIZE = 10;

export interface UseJobSearchResult {
  // Filter state
  search: string;
  categoryFilter: string;
  page: number;
  pageSize: number;
  scrollMode: boolean;
  // Data
  categories: string[];
  meta: JobsMeta;
  displayJobs: Job[];
  hasMore: boolean;
  // Loading
  loading: boolean;
  loadingMore: boolean;
  error: string;
  // Actions
  setSearch: (s: string) => void;
  setCategoryFilter: (c: string) => void;
  setPage: (n: number) => void;
  setPageSize: (n: number) => void;
  setScrollMode: (v: boolean) => void;
  loadMore: () => void;
}

export function useJobSearch(): UseJobSearchResult {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Filter / pagination state (restored from URL on mount) ─────────────────
  const [search, setSearchRaw] = useState(() => searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilterRaw] = useState(() => searchParams.get('category') ?? '');
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

  // ── Reset to page 1 whenever filters / page-size change ───────────────────
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setPage(1);
    setScrollJobs([]);
  }, [debouncedSearch, categoryFilter, pageSize]);

  // ── Main data fetch (server-side) ──────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    JobsApi.searchJobs(
      { search: debouncedSearch || undefined, category: categoryFilter || undefined, page, pageSize },
      controller.signal,
    )
      .then(({ jobs: newJobs, meta: newMeta }) => {
        setJobs(newJobs);
        setMeta(newMeta);
        if (scrollMode) setScrollJobs((prev) => (page === 1 ? newJobs : [...prev, ...newJobs]));
        // Seed categories from the initial unfiltered load
        if (!debouncedSearch && !categoryFilter && page === 1) {
          setCategories(Array.from(new Set(newJobs.map((j) => j.category).filter(Boolean))) as string[]);
        }
      })
      .catch((err) => {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
        setError('Could not load jobs. Make sure the backend is running.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });

    return () => controller.abort();
  }, [debouncedSearch, categoryFilter, page, pageSize]); // scrollMode intentionally excluded

  // ── URL persistence ────────────────────────────────────────────────────────
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (categoryFilter) params.category = categoryFilter;
    if (page > 1) params.page = String(page);
    if (pageSize !== DEFAULT_PAGE_SIZE) params.pageSize = String(pageSize);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, categoryFilter, page, pageSize, setSearchParams]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const setSearch = useCallback((s: string) => setSearchRaw(s), []);

  const setCategoryFilter = useCallback((c: string) => setCategoryFilterRaw(c), []);

  const setPageSize = useCallback((n: number) => setPageSizeRaw(n), []);

  const setScrollMode = useCallback(
    (v: boolean) => {
      setScrollModeRaw(v);
      if (v) setScrollJobs([...jobs]); // seed scroll list from current page
      else { setScrollJobs([]); setPage(1); }
    },
    [jobs],
  );

  const loadMore = useCallback(() => {
    if (loadingMore || meta.page >= meta.totalPages) return;
    const nextPage = meta.page + 1;
    setLoadingMore(true);
    JobsApi.searchJobs({ search: debouncedSearch || undefined, category: categoryFilter || undefined, page: nextPage, pageSize })
      .then(({ jobs: newJobs, meta: newMeta }) => {
        setScrollJobs((prev) => [...prev, ...newJobs]);
        setMeta(newMeta);
        setPage(nextPage);
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED') return;
        setError('Could not load more jobs. Please try again.');
      })
      .finally(() => setLoadingMore(false));
  }, [loadingMore, meta, debouncedSearch, categoryFilter, pageSize]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const displayJobs = scrollMode ? scrollJobs : jobs;
  const hasMore = meta.page < meta.totalPages;

  return {
    search, categoryFilter, page, pageSize, scrollMode,
    categories, meta, displayJobs, hasMore,
    loading, loadingMore, error,
    setSearch, setCategoryFilter, setPage, setPageSize, setScrollMode, loadMore,
  };
}
