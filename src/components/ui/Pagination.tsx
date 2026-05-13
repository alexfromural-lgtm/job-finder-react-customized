import type { CSSProperties } from 'react';
import { PAGE_SIZES } from '../../hooks/usePagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  scrollMode: boolean;
  totalItems: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onScrollModeToggle: (v: boolean) => void;
}

function buildPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  scrollMode,
  totalItems,
  hasMore,
  onPageChange,
  onPageSizeChange,
  onScrollModeToggle,
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className="glass"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginTop: '1.75rem',
        padding: '0.875rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* ── Left: count + page size ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
          {scrollMode
            ? hasMore
              ? `Showing ${endItem} of ${totalItems}`
              : `All ${totalItems} jobs loaded`
            : totalItems === 0
              ? 'No results'
              : `${startItem}–${endItem} of ${totalItems}`}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Per page:</span>
          <select
            id="page-size-selector"
            className="input"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.82rem', marginBottom: 0 }}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Center: page pills (pagination mode only) ───────────────────── */}
      {!scrollMode && totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
          <PageBtn
            id="pagination-prev"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            ‹
          </PageBtn>

          {buildPageNumbers(currentPage, totalPages).map((p, i) =>
            p === '…' ? (
              <span
                key={`ell-${i}`}
                style={{ color: 'var(--color-text-muted)', padding: '0 0.1rem', lineHeight: '32px' }}
              >
                …
              </span>
            ) : (
              <PageBtn
                key={p}
                id={`pagination-page-${p}`}
                onClick={() => onPageChange(p as number)}
                active={p === currentPage}
                aria-label={`Page ${p}`}
              >
                {p}
              </PageBtn>
            ),
          )}

          <PageBtn
            id="pagination-next"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            ›
          </PageBtn>
        </div>
      )}

      {/* ── Right: mode toggle ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 3,
          gap: 3,
        }}
      >
        <ModeBtn id="mode-pagination" active={!scrollMode} onClick={() => onScrollModeToggle(false)} title="Pagination mode">
          ☰ Pages
        </ModeBtn>
        <ModeBtn id="mode-infinite-scroll" active={scrollMode} onClick={() => onScrollModeToggle(true)} title="Infinite scroll mode">
          ↓ Scroll
        </ModeBtn>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface PageBtnProps {
  id?: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  'aria-label'?: string;
}

function PageBtn({ id, onClick, disabled, active, children, 'aria-label': ariaLabel }: PageBtnProps) {
  const style: CSSProperties = {
    minWidth: 32,
    height: 32,
    padding: '0 0.4rem',
    border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.04)',
    color: active ? '#fff' : disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    fontWeight: active ? 700 : 400,
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s ease',
    lineHeight: '1',
  };
  return (
    <button id={id} onClick={onClick} disabled={disabled} aria-label={ariaLabel} style={style}>
      {children}
    </button>
  );
}

interface ModeBtnProps {
  id?: string;
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}

function ModeBtn({ id, active, onClick, title, children }: ModeBtnProps) {
  const style: CSSProperties = {
    padding: '0.3rem 0.75rem',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: active ? 'var(--color-primary)' : 'transparent',
    color: active ? '#fff' : 'var(--color-text-muted)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: active ? 600 : 400,
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  };
  return (
    <button id={id} onClick={onClick} title={title} style={style}>
      {children}
    </button>
  );
}
