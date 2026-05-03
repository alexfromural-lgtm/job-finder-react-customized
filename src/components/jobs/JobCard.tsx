import { useNavigate } from 'react-router-dom';
import type { Job } from '../../types';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface JobCardProps {
  job: Job;
  actions?: React.ReactNode;
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobCard({ job, actions }: JobCardProps) {
  const navigate = useNavigate();

  return (
    <Card hover className="job-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h3
          style={{
            margin: 0,
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.3,
            cursor: 'pointer',
            color: 'var(--color-text)',
          }}
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          {job.title}
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
          {timeAgo(job.createdAt)}
        </span>
      </div>

      {/* Company (from recruiter profile if available) */}
      {job.recruiter?.companyName && (
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          🏢 {job.recruiter.companyName}
        </p>
      )}

      {/* Badges row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        <Badge color="teal">📍 {job.location}</Badge>
        {job.category && <Badge color="purple">{job.category}</Badge>}
        {job.salaryRange && <Badge color="green">💰 {job.salaryRange}</Badge>}
        {!job.isActive && <Badge color="red">Closed</Badge>}
      </div>

      {/* Description excerpt */}
      <p
        style={{
          margin: 0,
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {job.description}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <Button
          id={`view-job-${job.id}`}
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          View Details →
        </Button>
        {actions && <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div>}
      </div>
    </Card>
  );
}
