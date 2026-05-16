import { useEffect } from 'react';

/**
 * Updates document.title for the current page.
 * Automatically appends the app name for consistent branding.
 *
 * Usage:
 *   usePageTitle('Job Details');  // sets "Job Details | Job Finder"
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | Job Finder`;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
