import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type UrlParamMap = Record<string, string | undefined>;

/**
 * Generic URL-sync hook.
 *
 * Writes `params` into the URL search string (replace mode) whenever they
 * change. Keys mapped to `undefined` or `''` are omitted from the URL.
 *
 * Has no knowledge of what is being synced — any flat string map works.
 */
export function useUrlSync(params: UrlParamMap): void {
  const [, setSearchParams] = useSearchParams();

  // Serialise to a stable string so the effect only fires when values change.
  const serialised = JSON.stringify(params);

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') next[key] = value;
    }
    setSearchParams(next, { replace: true });
    // `serialised` is the stable dep; `params` is intentionally excluded to
    // avoid re-running on every render due to the object being recreated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialised]);
}
