import Button from '../ui/Button';

interface JobFilterBarProps {
  search: string;
  categoryFilter: string;
  categories: string[];
  onSearchChange: (s: string) => void;
  onCategoryChange: (c: string) => void;
  onClear: () => void;
}

export default function JobFilterBar({
  search,
  categoryFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onClear,
}: JobFilterBarProps) {
  const hasActiveFilters = Boolean(search || categoryFilter);

  return (
    <div
      className="glass"
      style={{
        display: 'flex', gap: '1rem', padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-lg)', marginBottom: '2rem',
        flexWrap: 'wrap', alignItems: 'center',
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <input
          id="job-search"
          className="input"
          placeholder="🔍  Search jobs, locations..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ marginBottom: 0 }}
        />
      </div>

      <select
        id="category-filter"
        className="input"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={{ width: 'auto', minWidth: 160 }}
      >
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      {hasActiveFilters && (
        <Button id="clear-filters" variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  );
}
