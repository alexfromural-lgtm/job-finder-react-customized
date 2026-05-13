import { useState, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UseInfiniteScrollOptions {
  totalItems: number;
  pageSize: number;
  initialVisible?: number;
}

export interface UseInfiniteScrollResult {
  visibleCount: number;
  hasMore: boolean;
  loadingMore: boolean;
  /** Append the next page of items to the visible window. */
  loadMore: () => void;
  /** Reset visible window (e.g. when filters change). Defaults to `pageSize`. */
  reset: (count?: number) => void;
  /** Slice any array to the current visible window. Generic — no domain dependency. */
  getVisibleSlice: <T>(items: T[]) => T[];
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Generic infinite-scroll hook.
 *
 * Manages how many items from an already-available list are currently visible.
 * Has no knowledge of what is being scrolled — callers pass any T[] to
 * `getVisibleSlice` to receive the visible window.
 */
export function useInfiniteScroll({
  totalItems,
  pageSize,
  initialVisible,
}: UseInfiniteScrollOptions): UseInfiniteScrollResult {
  const [visibleCount, setVisibleCount] = useState(initialVisible ?? pageSize);
  const [loadingMore, setLoadingMore] = useState(false);

  const hasMore = visibleCount < totalItems;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    requestAnimationFrame(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, totalItems));
      setLoadingMore(false);
    });
  }, [loadingMore, hasMore, pageSize, totalItems]);

  const reset = useCallback(
    (count?: number) => setVisibleCount(count ?? pageSize),
    [pageSize],
  );

  const getVisibleSlice = useCallback(
    <T>(items: T[]): T[] => items.slice(0, visibleCount),
    [visibleCount],
  );

  return { visibleCount, hasMore, loadingMore, loadMore, reset, getVisibleSlice };
}
