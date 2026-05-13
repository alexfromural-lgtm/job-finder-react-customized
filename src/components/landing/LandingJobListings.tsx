import JobList from '../jobs/JobList';
import JobFilterBar from '../jobs/JobFilterBar';
import Pagination from '../ui/Pagination';
import { useJobSearch } from '../../hooks/useJobSearch';

interface LandingJobListingsProps {
  hook: ReturnType<typeof useJobSearch>;
}

export default function LandingJobListings({ hook }: LandingJobListingsProps) {
  const {
    search, categoryFilter, page, pageSize, scrollMode,
    categories, meta, displayJobs, hasMore,
    loading, loadingMore, error,
    setSearch, setCategoryFilter, setPage, setPageSize, setScrollMode, loadMore,
  } = hook;

  return (
    <section style={{ paddingBottom: '4rem' }}>
      <div className="container">

        <JobFilterBar
          search={search}
          categoryFilter={categoryFilter}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={(c) => { setCategoryFilter(c); setPage(1); }}
          onClear={() => { setSearch(''); setCategoryFilter(''); }}
        />

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
  );
}
