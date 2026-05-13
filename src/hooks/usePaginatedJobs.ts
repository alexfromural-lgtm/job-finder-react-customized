import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Job } from '../types';
import { useDebounce } from './useDebounce';
import { usePagination, PAGE_SIZES } from './usePagination';
import { useInfiniteScroll } from './useInfiniteScroll';
import { useUrlSync } from './useUrlSync';

// Re-export so existing consumers (Pagination.tsx, useJobSearch.ts) keep working.
export { PAGE_SIZES };
export type { PageSize } from './usePagination';

// ── Filter abstraction (DIP) ───────────────────────────────────────────────────

/**
 * Predicate that decides whether a job matches the current filter inputs.
 * Callers can inject their own logic; the default covers text + category.
 */
export type JobFilterFn = (job: Job, search: string, category: string) => boolean;

const defaultFilterFn: JobFilterFn = (job, search, category) => {
  if (search) {
    const q = search.toLowerCase();
    if (
      !job.title.toLowerCase().includes(q) &&
      !job.location.toLowerCase().includes(q) &&
      !job.description.toLowerCase().includes(q)
    ) {
      return false;
    }
  }
  if (category && job.category !== category) return false;
  return true;
};

// ── Public API ────────────────────────────────────────────────────────────────

export interface UsePaginatedJobsOptions {
  allJobs: Job[];
  defaultPageSize?: number;
  /** Override the default text+category filter with a custom predicate. */
  filterFn?: JobFilterFn;
}

export interface PaginatedJobsState {
  // Filter inputs
  search: string;
  categoryFilter: string;
  // Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
  // Scroll mode
  scrollMode: boolean;
  // Data
  filteredJobs: Job[];
  pageItems: Job[];
  hasMore: boolean;
  loadingMore: boolean;
  // Actions
  setSearch: (s: string) => void;
  setCategoryFilter: (c: string) => void;
  goToPage: (n: number) => void;
  setPageSize: (n: number) => void;
  setScrollMode: (v: boolean) => void;
  loadMore: () => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Job-specific orchestrator.
 *
 * Composes four generic hooks:
 *   useDebounce       – debounced search input
 *   usePagination     – page math and slicing
 *   useInfiniteScroll – scroll-mode visible-count and load-more
 *   useUrlSync        – persists filter/pagination state in the URL
 *
 * This hook is the only layer that knows about `Job`.
 * The four primitives above are fully domain-agnostic.
 */
export function usePaginatedJobs({
  allJobs,
  defaultPageSize = 10,
  filterFn = defaultFilterFn,
}: UsePaginatedJobsOptions): PaginatedJobsState {
  const [searchParams] = useSearchParams();

  // ── Filter inputs ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [categoryFilter, setCategoryFilter] = useState(() => searchParams.get('category') ?? '');
  const debouncedSearch = useDebounce(search, 300);

  // ── Apply filter (memoised; filterFn is the only Job-aware piece) ──────────
  const filteredJobs = useMemo(
    () => allJobs.filter((j) => filterFn(j, debouncedSearch, categoryFilter)),
    [allJobs, debouncedSearch, categoryFilter, filterFn],
  );

  // ── Generic pagination ─────────────────────────────────────────────────────
  const pagination = usePagination({
    totalItems: filteredJobs.length,
    initialPage: Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1),
    initialPageSize: (() => {
      const ps = parseInt(searchParams.get('pageSize') ?? String(defaultPageSize), 10);
      return (PAGE_SIZES as readonly number[]).includes(ps) ? ps : defaultPageSize;
    })(),
  });

  // ── Generic infinite scroll ────────────────────────────────────────────────
  const scroll = useInfiniteScroll({
    totalItems: filteredJobs.length,
    pageSize: pagination.pageSize,
  });

  // ── Scroll-mode toggle ─────────────────────────────────────────────────────
  const [scrollMode, setScrollModeRaw] = useState(false);

  // ── Reset page + scroll window when filters change ─────────────────────────
  useEffect(() => {
    pagination.reset();
    scroll.reset();
    // pagination.reset and scroll.reset are stable callbacks — safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, categoryFilter]);

  // ── Derived items and hasMore ──────────────────────────────────────────────
  const pageItems = scrollMode
    ? scroll.getVisibleSlice(filteredJobs)
    : pagination.getPageSlice(filteredJobs);

  const hasMore = scrollMode ? scroll.hasMore : pagination.currentPage < pagination.totalPages;

  // ── URL sync (generic — no Job knowledge) ─────────────────────────────────
  useUrlSync({
    search: debouncedSearch || undefined,
    category: categoryFilter || undefined,
    page: !scrollMode && pagination.currentPage > 1 ? String(pagination.currentPage) : undefined,
    pageSize: pagination.pageSize !== defaultPageSize ? String(pagination.pageSize) : undefined,
  });

  // ── Actions ────────────────────────────────────────────────────────────────
  const goToPage = useCallback(
    (n: number) => {
      pagination.goToPage(n);
      setScrollModeRaw(false);
    },
    [pagination],
  );

  const setPageSize = useCallback(
    (n: number) => {
      pagination.setPageSize(n); // also resets to page 1
      scroll.reset(n);           // reset scroll window to new page size
    },
    [pagination, scroll],
  );

  const setScrollMode = useCallback(
    (v: boolean) => {
      setScrollModeRaw(v);
      if (!v) pagination.reset();
    },
    [pagination],
  );

  return {
    search,
    categoryFilter,
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    totalPages: pagination.totalPages,
    scrollMode,
    filteredJobs,
    pageItems,
    hasMore,
    loadingMore: scroll.loadingMore,
    setSearch,
    setCategoryFilter,
    goToPage,
    setPageSize,
    setScrollMode,
    loadMore: scroll.loadMore,
  };
}
