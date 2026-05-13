import type { Job } from '../../types';
import JobDetailSection from './JobDetailSection';

interface JobDetailBodyProps {
  job: Job;
}

export default function JobDetailBody({ job }: JobDetailBodyProps) {
  return (
    <div
      className="glass"
      style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <JobDetailSection title="📋 About This Role" content={job.description} />
      <hr className="divider" />
      <JobDetailSection title="✅ Requirements" content={job.requirements} />

      {job.recruiter?.companyWebsite && (
        <>
          <hr className="divider" />
          <div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              🔗 Company Website
            </h3>
            <a
              href={job.recruiter.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-primary)', fontWeight: 500 }}
            >
              {job.recruiter.companyWebsite}
            </a>
          </div>
        </>
      )}

      <hr className="divider" />
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        Posted on {new Date(job.createdAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        })}
      </p>
    </div>
  );
}
