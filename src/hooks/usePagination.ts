import { useState, useCallback } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────

export const PAGE_SIZES = [10, 25, 50] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UsePaginationOptions {
  totalItems: number;
  initialPage?: number;
  initialPageSize?: number;
}

export interface UsePaginationResult {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  /** Navigate to page n (clamped to [1, totalPages]). */
  goToPage: (n: number) => void;
  /** Change page size and reset to page 1. */
  setPageSize: (n: number) => void;
  /** Reset to page 1 (call when filters change). */
  reset: () => void;
  /** Slice any array to the current page window. Generic — no domain dependency. */
  getPageSlice: <T>(items: T[]) => T[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Generic pagination hook.
 *
 * Manages current page, page size, and total-page derivation.
 * Has no knowledge of what is being paginated — callers pass any T[] to
 * `getPageSlice` to receive the correct window.
 */
export function usePagination({
  totalItems,
  initialPage = 1,
  initialPageSize = PAGE_SIZES[0],
}: UsePaginationOptions): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeRaw] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const goToPage = useCallback(
    (n: number) => setCurrentPage(Math.max(1, Math.min(n, totalPages))),
    [totalPages],
  );

  const setPageSize = useCallback((n: number) => {
    setPageSizeRaw(n);
    setCurrentPage(1);
  }, []);

  const reset = useCallback(() => setCurrentPage(1), []);

  const getPageSlice = useCallback(
    <T>(items: T[]): T[] => {
      const start = (safePage - 1) * pageSize;
      return items.slice(start, start + pageSize);
    },
    [safePage, pageSize],
  );

  return { currentPage: safePage, pageSize, totalPages, goToPage, setPageSize, reset, getPageSlice };
}
