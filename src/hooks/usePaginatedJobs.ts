import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Job } from '../types';

export const PAGE_SIZES = [10, 25, 50] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export interface UsePaginatedJobsOptions {
  allJobs: Job[];
  defaultPageSize?: number;
  /** Enable category filtering (Landing Page only) */
  enableCategory?: boolean;
}

export interface PaginatedJobsState {
  // Controlled input values
  search: string;
  categoryFilter: string;
  // Pagination state
  currentPage: number;
  pageSize: number;
  totalPages: number;
  // Scroll state
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

export function usePaginatedJobs({
  allJobs,
  defaultPageSize = 10,
  enableCategory = false,
}: UsePaginatedJobsOptions): PaginatedJobsState {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── State initialised from URL params ───────────────────────────────────────
  const [search, setSearchRaw] = useState<string>(() => searchParams.get('search') ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [categoryFilter, setCategoryFilterRaw] = useState<string>(
    () => (enableCategory ? (searchParams.get('category') ?? '') : ''),
  );
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const p = parseInt(searchParams.get('page') ?? '1', 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });
  const [pageSize, setPageSizeRaw] = useState<number>(() => {
    const ps = parseInt(searchParams.get('pageSize') ?? String(defaultPageSize), 10);
    return (PAGE_SIZES as readonly number[]).includes(ps) ? ps : defaultPageSize;
  });
  const [scrollMode, setScrollModeRaw] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(() => pageSize);
  const [loadingMore, setLoadingMore] = useState(false);

  // ── Debounce search ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ── Client-side filtering ────────────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    let result = allJobs;
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q),
      );
    }
    if (enableCategory && categoryFilter) {
      result = result.filter((j) => j.category === categoryFilter);
    }
    return result;
  }, [allJobs, debouncedSearch, categoryFilter, enableCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // ── Reset on filter/size change ──────────────────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
    setScrollVisible(pageSize);
  }, [debouncedSearch, categoryFilter, pageSize]);

  // ── Derived page items ───────────────────────────────────────────────────────
  const pageItems = useMemo(() => {
    if (scrollMode) return filteredJobs.slice(0, scrollVisible);
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, safeCurrentPage, pageSize, scrollMode, scrollVisible]);

  const hasMore = scrollMode
    ? scrollVisible < filteredJobs.length
    : safeCurrentPage < totalPages;

  // ── URL sync ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (enableCategory && categoryFilter) params.category = categoryFilter;
    if (!scrollMode && safeCurrentPage > 1) params.page = String(safeCurrentPage);
    if (pageSize !== defaultPageSize) params.pageSize = String(pageSize);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, categoryFilter, safeCurrentPage, pageSize, scrollMode]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const setSearch = useCallback((s: string) => setSearchRaw(s), []);

  const setCategoryFilter = useCallback((c: string) => setCategoryFilterRaw(c), []);

  const goToPage = useCallback(
    (n: number) => {
      setCurrentPage(Math.max(1, Math.min(n, totalPages)));
      setScrollModeRaw(false);
    },
    [totalPages],
  );

  const setPageSize = useCallback((n: number) => {
    setPageSizeRaw(n);
    setCurrentPage(1);
    setScrollVisible(n);
  }, []);

  const setScrollMode = useCallback(
    (v: boolean) => {
      setScrollModeRaw(v);
      if (v) {
        setScrollVisible(safeCurrentPage * pageSize);
      } else {
        setCurrentPage(1);
      }
    },
    [safeCurrentPage, pageSize],
  );

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    requestAnimationFrame(() => {
      setScrollVisible((prev) => Math.min(prev + pageSize, filteredJobs.length));
      setLoadingMore(false);
    });
  }, [loadingMore, hasMore, pageSize, filteredJobs.length]);

  return {
    search,
    categoryFilter,
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    scrollMode,
    filteredJobs,
    pageItems,
    hasMore,
    loadingMore,
    setSearch,
    setCategoryFilter,
    goToPage,
    setPageSize,
    setScrollMode,
    loadMore,
  };
}
