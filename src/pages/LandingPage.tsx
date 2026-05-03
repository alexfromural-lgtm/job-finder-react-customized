import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobList from '../components/jobs/JobList';
import type { Job } from '../types';
import * as JobsApi from '../api/jobs.api';
import Button from '../components/ui/Button';

export default function LandingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    JobsApi.getAllJobs()
      .then((data) => {
        setJobs(data);
        setFiltered(data);
      })
      .catch(() => setError('Could not load jobs. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = jobs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      result = result.filter((j) => j.category === categoryFilter);
    }
    setFiltered(result);
  }, [search, categoryFilter, jobs]);

  const categories = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean))) as string[];

  return (
    <div className="hero-gradient" style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          {/* Animated floating badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'rgba(79, 142, 247, 0.1)',
              border: '1px solid rgba(79, 142, 247, 0.25)',
              borderRadius: 999,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              marginBottom: '2rem',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            ⚡ Your career starts here
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 auto 1.25rem',
              maxWidth: 780,
            }}
          >
            Find the Job That{' '}
            <span className="gradient-text">Ignites</span>{' '}
            Your Career
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              maxWidth: 560,
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}
          >
            Discover thousands of opportunities from top companies. Connect with
            recruiters and land your dream role — faster.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              id="hero-signup-seeker"
              variant="primary"
              size="lg"
              onClick={() => navigate('/signup?role=seeker')}
            >
              Get Hired →
            </Button>
            <Button
              id="hero-signup-recruiter"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/signup?role=recruiter')}
            >
              Post a Job
            </Button>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              marginTop: '4rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Active Jobs', value: `${jobs.filter((j) => j.isActive).length}+` },
              { label: 'Companies', value: '50+' },
              { label: 'Hired This Month', value: '200+' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section style={{ paddingBottom: '4rem' }}>
        <div className="container">
          {/* Filter Bar */}
          <div
            className="glass"
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                id="job-search"
                className="input"
                placeholder="🔍  Search jobs, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>
            <select
              id="category-filter"
              className="input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: 'auto', minWidth: 160 }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {(search || categoryFilter) && (
              <Button
                id="clear-filters"
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setCategoryFilter(''); }}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>
              {loading ? 'Loading jobs...' : `${filtered.length} Job${filtered.length !== 1 ? 's' : ''} Found`}
            </h2>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

          <JobList jobs={filtered} loading={loading} emptyMessage="No jobs match your search." />
        </div>
      </section>
    </div>
  );
}
